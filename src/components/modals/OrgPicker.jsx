import { useEffect, useMemo, useRef, useState } from 'react';
import { ORGS } from '../../data/orgs';
import { useApp } from '../../context/AppContext';

/** "Choose an Organization" picker used by the compare slots and the Watchlist "Add" button. */
export default function OrgPicker() {
  const { picker, closePicker, bookmarks, compareList, addBookmark, setCompareSlot } = useApp();
  const [query, setQuery] = useState('');
  const inputRef = useRef(null);

  useEffect(() => {
    if (!picker.open) return undefined;
    setQuery('');
    const t = setTimeout(() => inputRef.current?.focus(), 50);
    return () => clearTimeout(t);
  }, [picker.open]);

  const results = useMemo(() => {
    const q = query.toLowerCase();
    return ORGS.filter((o) => {
      const notInList = picker.mode === 'watchlist' ? !bookmarks.has(o.name) : !compareList.includes(o.name);
      return o.name.toLowerCase().includes(q) && notInList;
    });
  }, [query, picker.mode, bookmarks, compareList]);

  if (!picker.open) return null;

  const choose = (org) => {
    if (picker.mode === 'watchlist') addBookmark(org.name);
    else setCompareSlot(picker.slot, org.name);
    closePicker();
  };

  return (
    <dialog
      open
      id="orgPickerModal"
      aria-modal="true"
      aria-labelledby="orgPickerTitle"
      onClick={(e) => { if (e.target === e.currentTarget) closePicker(); }}
      style={{ display: 'flex', position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', zIndex: 1000, alignItems: 'center', justifyContent: 'center', padding: 16, width: '100%', height: '100%', margin: 0 }}
    >
      <div style={{ background: '#fff', borderRadius: 16, width: '100%', maxWidth: 500, maxHeight: '80vh', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '20px 24px 12px' }}>
          <h2 id="orgPickerTitle" style={{ fontSize: 18, fontWeight: 800, fontFamily: "'Plus Jakarta Sans',sans-serif" }}>Choose an Organization</h2>
          <button onClick={closePicker} aria-label="Close" style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 20, color: '#71717a' }}>✕</button>
        </div>
        <div style={{ padding: '0 24px 12px' }}>
          <input
            id="orgPickerSearch"
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search organizations..."
            style={{ width: '100%', padding: '10px 14px', border: '1px solid #e4e4e7', borderRadius: 8, fontSize: 14, outline: 'none', fontFamily: "'Space Grotesk',sans-serif", boxSizing: 'border-box' }}
          />
        </div>
        <div id="orgPickerList" style={{ overflowY: 'auto', flex: 1, padding: '0 24px 24px', display: 'flex', flexDirection: 'column', gap: 6 }}>
          {results.length === 0 ? (
            <p style={{ textAlign: 'center', color: '#a1a1aa', fontSize: 14, padding: '24px 0' }}>No organizations found</p>
          ) : (
            results.map((org) => <PickerRow key={org.name} org={org} onChoose={choose} />)
          )}
        </div>
      </div>
    </dialog>
  );
}

function PickerRow({ org, onChoose }) {
  const [hover, setHover] = useState(false);
  return (
    <div
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 12px', border: '1px solid #e4e4e7', borderRadius: 8, cursor: 'pointer', transition: 'background 0.15s', background: hover ? '#FFF1EA' : '' }}
    >
      <div>
        <p style={{ fontWeight: 700, fontSize: 14, color: '#000000' }}>{org.name}</p>
        <p style={{ fontSize: 11, color: '#8c7164', marginTop: 2 }}>{org.cat} · {org.years}y · {org.competition}</p>
      </div>
      <button
        onClick={() => onChoose(org)}
        style={{ background: '#F04400', color: '#000', border: 'none', borderRadius: 6, padding: '6px 14px', fontSize: 12, fontWeight: 700, cursor: 'pointer', fontFamily: "'Space Grotesk',sans-serif" }}
      >
        Add
      </button>
    </div>
  );
}
