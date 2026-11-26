import { useEffect, useMemo, useRef, useState } from 'react';
import DOMPurify from 'dompurify';
import { marked } from 'marked';
import Icon from '../ui/Icon';
import { useApp } from '../../context/AppContext';
import {
  clearDraft, getDraft, getTemplateForOrg, isAutosaveEnabled, proposalFilename,
  saveDraft, setAutosaveEnabled,
} from '../../lib/proposal';

const FOCUSABLE = 'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])';

/** Markdown proposal editor with live preview, autosave, and MD / PDF export. */
export default function ProposalBuilder() {
  const { proposalOrg, closeProposal } = useApp();
  const open = !!proposalOrg;

  const [text, setText] = useState('');
  const [autosave, setAutosave] = useState(false);
  const dialogRef = useRef(null);
  const closeBtnRef = useRef(null);
  const previewRef = useRef(null);
  const saveTimer = useRef(null);
  const returnFocus = useRef(null);
  const orgRef = useRef(null);

  // Load the draft (or the template) whenever the builder is opened for an org.
  useEffect(() => {
    if (!proposalOrg) return undefined;
    orgRef.current = proposalOrg;
    returnFocus.current = document.getElementById('mDraftBtn');
    const saved = getDraft(proposalOrg);
    setText(saved === null ? getTemplateForOrg(proposalOrg) : saved);
    setAutosave(isAutosaveEnabled());
    closeBtnRef.current?.focus();
    return () => {
      clearTimeout(saveTimer.current);
      returnFocus.current?.focus();
      returnFocus.current = null;
    };
  }, [proposalOrg]);

  // Preview is sanitised HTML: DOMPurify(marked(text)). The one place raw HTML is injected.
  const previewHtml = useMemo(() => {
    try {
      return DOMPurify.sanitize(marked.parse(text));
    } catch (err) {
      console.error('Proposal preview failed:', err);
      return '<p class="proposal-preview-error">Markdown preview unavailable. Reload the page and try again.</p>';
    }
  }, [text]);

  const stats = useMemo(() => {
    const trimmed = text.trim();
    return `${trimmed ? trimmed.split(/\s+/).length : 0} words · ${text.length} chars`;
  }, [text]);

  const onEdit = (e) => {
    const value = e.target.value;
    setText(value);
    if (!orgRef.current || !isAutosaveEnabled()) return;
    clearTimeout(saveTimer.current);
    const org = orgRef.current;
    saveTimer.current = setTimeout(() => saveDraft(org, value), 300);
  };

  const onAutosaveToggle = (e) => {
    setAutosaveEnabled(e.target.checked);
    setAutosave(isAutosaveEnabled());
    if (e.target.checked && proposalOrg) saveDraft(proposalOrg, text);
  };

  const clear = () => {
    if (!proposalOrg) return;
    if (!confirm('Clear this proposal draft? This removes the saved copy from this device.')) return;
    clearDraft(proposalOrg);
    setText(getTemplateForOrg(proposalOrg));
  };

  const exportMD = () => {
    if (!proposalOrg) return;
    const url = URL.createObjectURL(new Blob([text], { type: 'text/markdown' }));
    const a = document.createElement('a');
    a.href = url;
    a.download = proposalFilename(proposalOrg, 'md');
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  };

  const exportPDF = async () => {
    if (!proposalOrg || !previewRef.current) return;
    let html2pdf;
    try {
      ({ default: html2pdf } = await import('html2pdf.js'));
    } catch {
      alert('PDF export is unavailable. Check your connection and reload the page.');
      return;
    }
    const printElement = previewRef.current.cloneNode(true);
    Object.assign(printElement.style, { padding: '40px', background: 'white', color: 'black', width: '800px' });
    printElement.querySelectorAll('code, pre').forEach((node) => {
      node.style.background = '#f4f4f4';
      node.style.color = '#333';
    });
    document.body.appendChild(printElement);
    try {
      await html2pdf()
        .set({
          margin: 15,
          filename: proposalFilename(proposalOrg, 'pdf'),
          image: { type: 'jpeg', quality: 0.98 },
          html2canvas: { scale: 2, useCORS: true },
          jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' },
        })
        .from(printElement)
        .save();
    } catch (err) {
      console.error('PDF export failed:', err);
      alert('PDF export failed. Try exporting Markdown instead.');
    } finally {
      printElement.remove();
    }
  };

  // Keep Tab focus inside the dialog.
  const trapTab = (e) => {
    if (e.key !== 'Tab' || !open) return;
    const list = [...dialogRef.current.querySelectorAll(FOCUSABLE)].filter((el) => !el.disabled && el.offsetParent !== null);
    if (list.length === 0) return;
    const first = list[0];
    const last = list[list.length - 1];
    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault();
      last.focus();
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault();
      first.focus();
    }
  };

  return (
    <dialog ref={dialogRef} className={`proposal-bg${open ? ' open' : ''}`} id="proposalModal" aria-labelledby="pwOrgName" open={open} onKeyDown={trapTab}>
      <div className="proposal-workspace">
        <header className="proposal-header">
          <div className="proposal-header-title">
            <h2 id="pwOrgName">{proposalOrg ? `${proposalOrg} Proposal` : 'Organization Proposal'}</h2>
            <label className="proposal-autosave">
              <input type="checkbox" id="pwAutosaveToggle" aria-describedby="pwPrivacyNote" checked={autosave} onChange={onAutosaveToggle} />
              Enable autosave
              <p id="pwPrivacyNote">Drafts are stored only on this device when autosave is enabled.</p>
            </label>
            <div id="pwProposalStats" className="proposal-stats" aria-live="polite">{stats}</div>
          </div>
          <div className="proposal-toolbar">
            <button type="button" id="pwClearBtn" className="proposal-btn proposal-btn-danger" aria-label="Clear proposal draft" onClick={clear}>
              <Icon name="delete" className="text-sm" /> Clear
            </button>
            <button type="button" id="pwExportMDBtn" className="proposal-btn" aria-label="Export proposal as Markdown" onClick={exportMD}>
              <Icon name="download" className="text-sm" /> Markdown
            </button>
            <button type="button" id="pwExportPDFBtn" className="proposal-btn proposal-btn-primary" aria-label="Download proposal as PDF" onClick={exportPDF}>
              <Icon name="picture_as_pdf" className="text-sm" /> PDF
            </button>
            <button type="button" id="pwCloseBtn" ref={closeBtnRef} className="proposal-btn" aria-label="Close proposal builder" onClick={closeProposal}>
              <Icon name="close" className="text-sm" />
            </button>
          </div>
        </header>
        <div className="proposal-body">
          <div className="proposal-editor">
            <label htmlFor="pwEditor" className="sr-only">Proposal markdown editor</label>
            <textarea id="pwEditor" className="proposal-textarea" spellCheck="true" aria-label="Proposal markdown editor" value={text} onChange={onEdit} />
          </div>
          <div
            id="pwPreview"
            ref={previewRef}
            className="proposal-preview"
            aria-live="polite"
            aria-label="Proposal preview"
            dangerouslySetInnerHTML={{ __html: previewHtml }}
          />
        </div>
      </div>
    </dialog>
  );
}
