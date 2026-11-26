import { useEffect, useRef, useState } from 'react';
import Modal from './Modal';
import Icon from '../ui/Icon';
import { MentorContactSection } from '../orgs/MentorParts';
import { ORGS } from '../../data/orgs';
import { githubUrlFromValue, sanitizeHrefUrl } from '../../lib/utils';
import { useApp } from '../../context/AppContext';

const YEARS = [2020, 2021, 2022, 2023, 2024, 2025, 2026];
const EMPTY_STATS = { stars: '---', forks: '---', issues: '---', activity: 'Moderate', activityClass: 'text-blue-400' };

function timelineUrl(org, year) {
  if (year < org.firstYear) return null;
  if (year === 2020) return sanitizeHrefUrl(org['2020_project_url'] || null);
  if (year === 2021) return sanitizeHrefUrl(org['2021_project_url'] || null);
  if (org.slug) return sanitizeHrefUrl(`https://summerofcode.withgoogle.com/programs/${year}/organizations/${org.slug}`);
  return null;
}

/** Org detail dialog (was #orgModal + renderModalHeader/openModal in the old inline script). */
export default function OrgModal() {
  const {
    selectedOrg, closeOrg, proposalOrg, openProposal,
    bookmarks, toggleBookmark, compareList, toggleCompare, mentors,
  } = useApp();

  const current = ORGS.find((o) => o.name === selectedOrg) || null;
  // Keep showing the last org while the fade-out runs.
  const [lastOrg, setLastOrg] = useState(null);
  useEffect(() => { if (current) setLastOrg(current); }, [current]);
  const org = current || lastOrg;

  const [stats, setStats] = useState(EMPTY_STATS);
  const [fetchLabel, setFetchLabel] = useState('Fetch Live Stats');
  const [copied, setCopied] = useState(false);
  const timers = useRef([]);

  useEffect(() => {
    setStats(EMPTY_STATS);
    setFetchLabel('Fetch Live Stats');
    setCopied(false);
  }, [selectedOrg]);
  useEffect(() => () => timers.current.forEach(clearTimeout), []);

  // Same simulated fetch as the original ("no token, so we simulate realistic growth").
  const fetchStats = async () => {
    setFetchLabel('Fetching...');
    await new Promise((r) => { timers.current.push(setTimeout(r, 1200)); });
    const stars = Math.random() * 5000 + 1000;
    setStats({
      stars: `${(stars / 1000).toFixed(1)}k`,
      forks: (stars * 0.2).toFixed(0),
      issues: (Math.random() * 50 + 10).toFixed(0),
      activity: 'High',
      activityClass: 'text-green-400',
    });
    setFetchLabel('Stats Updated!');
    timers.current.push(setTimeout(() => setFetchLabel('Fetch Live Stats'), 3000));
  };

  const copyIdeas = () => {
    if (!navigator.clipboard || typeof navigator.clipboard.writeText !== 'function') {
      console.error('Failed to copy link: Clipboard API unavailable');
      return;
    }
    navigator.clipboard.writeText(org.ideas).then(() => {
      setCopied(true);
      timers.current.push(setTimeout(() => setCopied(false), 2000));
    }).catch((err) => console.error('Failed to copy link:', err));
  };

  const open = !!current;
  return (
    <Modal id="orgModal" open={open} onClose={closeOrg} aria-hidden={proposalOrg ? 'true' : undefined}>
      <div className="modal">
        <button className="close-btn" onClick={closeOrg} aria-label="Close"><Icon name="close" /></button>
        {org && <OrgModalBody
          org={org}
          isBookmarked={bookmarks.has(org.name)}
          isComparing={compareList.includes(org.name)}
          onBookmark={() => toggleBookmark(org.name)}
          onCompare={() => toggleCompare(org.name)}
          onDraft={() => openProposal(org.name)}
          stats={stats}
          fetchLabel={fetchLabel}
          fetching={fetchLabel === 'Fetching...'}
          onFetchStats={fetchStats}
          copied={copied}
          onCopy={copyIdeas}
          mentorState={mentors.state}
          mentorEntry={mentors.getEntry(org.name)}
        />}
      </div>
    </Modal>
  );
}

function OrgModalBody({
  org, isBookmarked, isComparing, onBookmark, onCompare, onDraft, stats, fetchLabel, fetching,
  onFetchStats, copied, onCopy, mentorState, mentorEntry,
}) {
  const ideasUrl = sanitizeHrefUrl(org.ideas);
  const repoUrl = sanitizeHrefUrl(githubUrlFromValue(org.github));
  const linkProps = (url) => (url
    ? { href: url }
    : { 'aria-disabled': 'true', tabIndex: -1 });
  const disabledCls = (url) => (url ? '' : ' opacity-50 pointer-events-none');

  return (
    <>
      <div className="modal-header" id="mHeader">
        <span className="category-tag">{String(org.cat).toUpperCase()}</span>
        <div className="flex items-start justify-between pr-10 gap-4">
          <div>
            <h2>{org.name}</h2>
            <p className="text-zinc-500">GSoC Partner for {org.years} Years</p>
            {ideasUrl && (
              <a href={ideasUrl} target="_blank" rel="noopener noreferrer" className="mentor-link-chip">
                <span>💡</span><span>Visit ideas page</span>
              </a>
            )}
          </div>
          <div className="flex flex-col items-end gap-2">
            <button
              id="modalCompareBtn"
              onClick={onCompare}
              className={`text-[10px] font-bold uppercase tracking-widest ${isComparing ? 'text-primary-ink' : 'text-orange-400'} hover:text-primary-ink flex items-center gap-1`}
            >
              <Icon name={isComparing ? 'check_circle' : 'compare_arrows'} className="text-sm" /> {isComparing ? 'Comparing' : 'Add to compare'}
            </button>
            <button
              id="modalBookmarkBtn"
              onClick={onBookmark}
              className={`bookmark-btn ${isBookmarked ? 'active' : 'text-orange-300'} flex-shrink-0`}
              aria-label={isBookmarked ? 'Remove bookmark' : 'Add to Watchlist'}
              title={isBookmarked ? 'Remove bookmark' : 'Add to Watchlist'}
            >
              <Icon name="star" className="text-2xl" fill={isBookmarked} />
            </button>
          </div>
        </div>
      </div>

      <div className="modal-body">
        <div className="metrics-grid mb-8" id="mMetrics">
          <div className="metric-card"><p className="metric-value">{org.years}</p><p className="metric-label">Years In</p></div>
          <div className="metric-card"><p className="metric-value">{org.firstYear}</p><p className="metric-label">First Year</p></div>
          <div className="metric-card"><p className="metric-value font-mono text-sm">{String(org.competition).toUpperCase()}</p><p className="metric-label">Competition</p></div>
          <div className="metric-card"><p className="metric-value font-mono text-sm">{String(org.codebase).toUpperCase()}</p><p className="metric-label">Codebase</p></div>
        </div>

        <div className="github-stats-container mb-8">
          <div className="gh-stat-item"><Icon name="star" className="text-sm" /> <span id="mStars">{stats.stars}</span></div>
          <div className="gh-stat-item"><Icon name="fork_right" className="text-sm" /> <span id="mForks">{stats.forks}</span></div>
          <div className="gh-stat-item"><Icon name="bug_report" className="text-sm" /> <span id="mIssues">{stats.issues}</span></div>
          <div className={`gh-stat-item ${stats.activityClass}`}><Icon name="history" className="text-sm" /> <span id="mActivity">{stats.activity}</span></div>
          <button className="gh-fetch" id="mFetchBtn" onClick={onFetchStats} disabled={fetching}>{fetchLabel}</button>
        </div>

        <div className="section-title">Description</div>
        <p id="mDesc" className="text-sm text-zinc-600 leading-relaxed mb-6">{org.desc}</p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <div className="section-title">Technologies</div>
            <div className="tech-tags" id="mTech">{org.tags.map((t) => <span key={t} className="tech-tag">{t}</span>)}</div>
          </div>
          <div>
            <div className="section-title">Ideal Fit</div>
            <div className="fit-tags" id="mFit">{org.fit.map((f) => <span key={f} className="fit-tag">{f}</span>)}</div>
          </div>
        </div>

        <div className="section-title">
          Participation Timeline
          <span style={{ fontWeight: 400, fontSize: '0.7rem', fontStyle: 'italic', color: '#888', textTransform: 'none', letterSpacing: '0.02em' }}>
            {' '}· click a year to explore its projects
          </span>
        </div>
        <div className="timeline-grid" id="mTimeline">
          {YEARS.map((y) => {
            const active = y >= org.firstYear;
            const isCurrent = y === 2026;
            const url = active ? timelineUrl(org, y) : null;
            return url ? (
              <a key={y} href={url} target="_blank" rel="noopener noreferrer"
                className={`timeline-year-link${isCurrent ? ' current-year' : ''}`} title={`View ${org.name} at GSoC ${y}`}>{y}</a>
            ) : (
              <span key={y} className={`${isCurrent ? 'current-year ' : ''}${active ? 'opacity-100' : 'opacity-30'}`}>{y}</span>
            );
          })}
        </div>

        <div className="section-title">Mentors &amp; Contact</div>
        <div id="mMentorSection" className="space-y-4">
          <MentorContactSection state={mentorState} entry={mentorEntry} />
        </div>
      </div>

      <div className="modal-footer">
        <button type="button" id="mDraftBtn" onClick={onDraft} className="modal-cta modal-proposal-link flex items-center justify-center gap-2">
          <Icon name="edit_document" className="text-lg" /> Open Proposal Builder
        </button>
        <div className="modal-footer-secondary">
          <a id="mIdeasBtn" target="_blank" rel="noopener noreferrer" {...linkProps(ideasUrl)}
            className={`modal-cta modal-ideas-link flex items-center justify-center gap-2${disabledCls(ideasUrl)}`}>
            <Icon name="lightbulb" className="text-lg" /> Project Ideas
          </a>
          {org.ideas && (
            <button
              id="mIdeasCopyBtn"
              onClick={onCopy}
              className="modal-cta modal-repo-link flex items-center justify-center gap-2"
              style={copied ? { background: '#EEFAB8', color: '#384B00' } : undefined}
            >
              <Icon name={copied ? 'check_circle' : 'content_copy'} className="text-lg" /> {copied ? 'Copied!' : 'Copy Link'}
            </button>
          )}
          <a id="mRepoBtn" target="_blank" rel="noopener noreferrer" {...linkProps(repoUrl)}
            className={`modal-cta modal-repo-link flex items-center justify-center gap-2${disabledCls(repoUrl)}`}>
            <Icon name="code" className="text-lg" /> Repository
          </a>
        </div>
      </div>
    </>
  );
}
