import { useEffect, useMemo, useRef, useState } from 'react';
import Modal from './Modal';
import Icon from '../ui/Icon';
import { BadgeSystem } from '../../lib/badges';
import { useApp } from '../../context/AppContext';

const STAT_CARD = { background: 'var(--bg)', border: '1.5px solid var(--border2)', borderRadius: 11, padding: 11, textAlign: 'center' };
const STAT_VALUE = { fontFamily: "'Playfair Display',serif", fontSize: 19, fontWeight: 900, marginBottom: 2 };
const STAT_LABEL = { fontSize: 9, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '.07em' };
const SECTION_TITLE = { fontSize: 10, fontWeight: 700, color: 'var(--muted)', letterSpacing: '.1em', textTransform: 'uppercase' };

/** Analytics & Achievements panel: engagement counters + badge progress (all stored in localStorage). */
export default function AnalyticsModal() {
  const { analyticsOpen, closeAnalytics } = useApp();
  const [tick, setTick] = useState(0); // bump to re-read BadgeSystem
  const [resetHover, setResetHover] = useState(false);
  const modalRef = useRef(null);
  const prevFocus = useRef(null);

  // Refresh whenever the panel opens or badges are reset elsewhere.
  useEffect(() => {
    if (!analyticsOpen) return undefined;
    setTick((t) => t + 1);
    prevFocus.current = document.activeElement;
    const focusTimer = setTimeout(() => modalRef.current?.querySelector('.close-btn')?.focus(), 100);
    return () => {
      clearTimeout(focusTimer);
      const el = prevFocus.current;
      if (el && document.contains(el)) el.focus();
      prevFocus.current = null;
    };
  }, [analyticsOpen]);

  useEffect(() => {
    const onReset = () => setTick((t) => t + 1);
    document.addEventListener('badgesReset', onReset);
    return () => document.removeEventListener('badgesReset', onReset);
  }, []);

  // Re-read localStorage-backed badge data whenever `tick` changes.
  const { stats, data, unlocked, total } = useMemo(
    () => ({
      stats: BadgeSystem.getBadgeStats(),
      data: BadgeSystem.getBadgeData(),
      unlocked: BadgeSystem.getUnlockedCount(),
      total: BadgeSystem.getTotalBadgesCount(),
    }),
    [tick], // eslint-disable-line react-hooks/exhaustive-deps
  );

  const counters = [
    ['Total Visits', 0], ['Today', 0], ['Searches', data.search_master],
    ['Org Views', data.explorer], ['Filters Used', data.filter_pro], ['Session Time', '—'],
  ];

  return (
    <Modal
      id="anBg"
      open={analyticsOpen}
      onClose={closeAnalytics}
      tabIndex={-1}
      role="dialog"
      aria-modal="true"
      aria-label="Analytics & Achievements"
    >
      <div className="modal w-full max-w-4xl" ref={modalRef}>
        <button className="close-btn" onClick={closeAnalytics} aria-label="Close"><Icon name="close" /></button>
        <div className="modal-header pb-4 border-b border-zinc-100">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-3xl font-extrabold font-headline">Analytics &amp; Achievements</h2>
              <p className="text-zinc-500 text-sm mt-1">Your activity stats and unlocked badges</p>
              <p className="text-zinc-400 text-xs mt-1 flex items-center gap-1">
                <Icon name="info" style={{ fontSize: 14 }} />
                Badges are stored locally in your browser (per-device, cleared with browser data)
              </p>
            </div>
            <span className="badge-indicator" id="badgeIndicator">
              <Icon name="emoji_events" style={{ fontSize: 16 }} /> {unlocked}/{total}
            </span>
          </div>
        </div>

        <div className="modal-body p-6">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(140px,1fr))', gap: 12, marginBottom: 24 }}>
            {counters.map(([label, value]) => (
              <div key={label} style={STAT_CARD}>
                <div style={STAT_VALUE}>{value}</div>
                <div style={STAT_LABEL}>{label}</div>
              </div>
            ))}
          </div>

          <div style={{ marginBottom: 24 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
              <h3 style={SECTION_TITLE}>🏆 Achievement Badges</h3>
              <button
                onClick={() => { if (BadgeSystem.resetProgress()) setTick((t) => t + 1); }}
                onMouseEnter={() => setResetHover(true)}
                onMouseLeave={() => setResetHover(false)}
                style={{
                  fontSize: 10, fontWeight: 700, color: 'var(--red)', cursor: 'pointer', transition: 'all .18s',
                  borderRadius: 8, padding: '4px 10px',
                  background: resetHover ? 'rgba(197,48,48,.06)' : 'transparent',
                  border: `1.5px solid ${resetHover ? 'var(--red)' : 'var(--border)'}`,
                }}
              >
                Reset Progress
              </button>
            </div>
            <div id="badgesContainer">
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(140px,1fr))', gap: 12, marginTop: 12 }}>
                {Object.entries(stats).map(([type, badge]) => {
                  const locked = !badge.level;
                  return (
                    <div key={type} className={`badge-card${locked ? ' badge-locked' : ''}`}>
                      <span className="badge-icon">{badge.name.split(' ')[0]}</span>
                      <div className="badge-name">{badge.name.substring(2)}</div>
                      <div className="badge-level">{badge.level ? badge.level.levelName : 'Locked'}</div>
                      <div className="badge-count">{badge.count}{badge.nextThreshold ? ` / ${badge.nextThreshold}` : ''}</div>
                      <div className="badge-progress"><div className="badge-progress-fill" style={{ width: `${badge.progress}%` }} /></div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {[['Top Categories', 'catChart'], ['Most Viewed Orgs', 'orgChart'], ['Recent Searches', 'srchTerms']].map(([title, id], i) => (
            <div key={id} style={{ marginBottom: i < 2 ? 20 : 0 }}>
              <h3 style={{ ...SECTION_TITLE, marginBottom: 8 }}>{title}</h3>
              <div id={id} />
            </div>
          ))}
        </div>
      </div>
    </Modal>
  );
}
