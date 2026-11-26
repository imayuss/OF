import { useMemo } from 'react';
import Icon from '../ui/Icon';
import OrgLogo from '../ui/OrgLogo';
import { ORGS } from '../../data/orgs';
import { RECENTLY_VIEWED_LIMIT, useApp } from '../../context/AppContext';
import { computeWatchlistInsight } from '../../lib/insights';
import { getActiveDeadlines, getCategoryMeta, logoUrlFor } from '../../lib/utils';

const byName = (name) => ORGS.find((o) => o.name === name);

export default function Watchlist() {
  const {
    bookmarks, toggleBookmark, clearBookmarks, openOrg, openPicker,
    recentlyViewed, removeRecentlyViewed, clearRecentlyViewed,
  } = useApp();

  const saved = useMemo(() => [...bookmarks].map(byName).filter(Boolean), [bookmarks]);
  const insight = useMemo(() => computeWatchlistInsight(saved), [saved]);
  const deadlines = getActiveDeadlines();
  const overflow = Math.max(recentlyViewed.length - RECENTLY_VIEWED_LIMIT, 0);

  return (
    <section id="watchlist" className="bg-surface-container-low py-20 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-12 flex items-start justify-between gap-4 flex-wrap">
          <div>
            <span className="font-label text-xs font-bold uppercase tracking-[0.2em] text-primary-ink">Scholarly Sandbox</span>
            <h2 className="text-4xl md:text-5xl font-extrabold font-headline tracking-tighter mt-2">Watchlist.</h2>
            <p className="text-zinc-600 mt-4 max-w-2xl">Curate your open-source journey. Track organizations, monitor deadlines, and prepare your proposals for GSoC 2026.</p>
          </div>
          {saved.length > 0 && (
            <button
              id="clearAllBookmarksBtn"
              onClick={clearBookmarks}
              className="mt-8 flex-shrink-0 flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-red-500 border border-red-200 rounded-full px-4 py-2 hover:bg-red-50 transition-colors"
              title="Remove all bookmarks"
            >
              <Icon name="delete_sweep" className="text-sm" />
              Clear All
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white/50 dark:bg-zinc-800/30 border-2 border-dashed border-zinc-200 dark:border-zinc-700 hover:border-solid hover:bg-white dark:hover:bg-zinc-800/80 transition-all rounded-2xl p-2 sm:p-5 flex flex-col max-h-[420px]">
              <div className="flex items-center justify-between flex-wrap gap-3 mb-3 sm:mb-4 pb-2 sm:pb-3 border-b border-zinc-200/60 dark:border-zinc-700/60 flex-shrink-0 px-2 sm:px-0 pt-2 sm:pt-0">
                <div className="flex items-center gap-1 sm:gap-2">
                  <Icon name="bookmark_border" className="text-zinc-400 dark:text-zinc-500 text-lg sm:text-2xl" />
                  <h3 className="font-bold text-zinc-700 dark:text-zinc-200 text-sm sm:text-base">Your Watchlist</h3>
                </div>
                <button
                  onClick={() => openPicker('watchlist')}
                  className="inline-flex items-center gap-1 px-3 sm:px-4 py-1.5 bg-primary !text-black rounded-lg text-xs font-bold hover:bg-orange-600 transition-colors shadow-sm whitespace-nowrap"
                  aria-label="Add Organization"
                >
                  <Icon name="add" className="text-sm" /> Add Organization
                </button>
              </div>

              <div className="space-y-3 sm:space-y-4 overflow-y-auto pr-1 sm:pr-2 custom-scrollbar flex-1 px-1 sm:px-0" id="watchlistContainer">
                {saved.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-center pb-8">
                    <Icon name="bookmark_border" className="text-4xl text-zinc-300 mb-4 block" />
                    <p className="font-bold text-zinc-500 mb-1">Your Watchlist is Empty</p>
                    <p className="text-sm text-zinc-400">Click the ★ on any organization card to start tracking it here.</p>
                  </div>
                ) : (
                  saved.map((org) => <WatchlistItem key={org.name} org={org} onOpen={openOrg} onRemove={toggleBookmark} />)
                )}
              </div>
            </div>

            {recentlyViewed.length > 0 && (
              <div id="recentlyViewedSection" className="space-y-4">
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3 flex-wrap">
                    <h3 className="text-lg font-bold text-zinc-900">Recently Viewed Organizations</h3>
                    {overflow > 0 && (
                      <span id="recentlyViewedOverflowBadge" className="rounded-full bg-zinc-100 px-2.5 py-1 text-[11px] font-bold uppercase tracking-wider text-zinc-500">+{overflow}</span>
                    )}
                  </div>
                  <button
                    id="clearRecentlyViewedBtn"
                    onClick={clearRecentlyViewed}
                    className="text-xs font-bold uppercase tracking-wider text-zinc-500 hover:text-red-500 transition-colors"
                    aria-label="Clear All recently viewed organizations"
                  >
                    Clear All
                  </button>
                </div>
                <div id="recentlyViewedContainer" className="space-y-3 max-h-[210px] overflow-y-auto pr-2 pb-2 custom-scrollbar">
                  {recentlyViewed.slice(0, RECENTLY_VIEWED_LIMIT).map((name) => {
                    const org = byName(name);
                    if (!org) return null;
                    const category = getCategoryMeta(org.cat);
                    return (
                      <div
                        key={name}
                        className="bg-white rounded-lg p-4 border border-zinc-100 hover:border-primary transition-colors cursor-pointer flex items-center justify-between"
                        onClick={() => openOrg(org.name)}
                      >
                        <div className="flex-1 min-w-0">
                          <h4 className="font-bold text-sm mb-1">{org.name}</h4>
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className={`${category.className} rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider`}>{category.label}</span>
                            <span className="text-[10px] text-zinc-500">{org.years} years</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 ml-2 flex-shrink-0">
                          <button
                            className="text-zinc-400 hover:text-red-500 transition-colors"
                            title="Remove from recently viewed"
                            aria-label={`Remove ${name} from recently viewed`}
                            onClick={(e) => { e.stopPropagation(); removeRecentlyViewed(name); }}
                          >
                            <Icon name="close" className="text-base" />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          <div className="space-y-6">
            <div className="bg-white rounded-2xl p-6 border border-zinc-100">
              <h4 className="font-bold mb-4 flex items-center gap-2"><Icon name="event" className="text-primary-ink text-lg" /> Upcoming Deadlines</h4>
              <div id="dynamic-deadlines-container" className="space-y-4">
                {deadlines.map((d) => (
                  <div key={d.date} className="deadline-node" data-date={d.date}>
                    <p className="text-[10px] font-label uppercase tracking-wider text-zinc-400">{d.label}</p>
                    <p className="text-sm font-bold">{d.title}</p>
                    <p className="text-xs text-zinc-500">{d.body}</p>
                  </div>
                ))}
              </div>
              {deadlines.length === 0 && <p id="deadlines-empty-fallback" className="text-xs text-zinc-400 italic mt-4">No upcoming deadlines.</p>}
            </div>

            <div className="bg-black text-white rounded-2xl p-6 relative overflow-hidden border border-black dark:border-[#333333]">
              <div className="absolute top-0 right-0 p-4 opacity-30 text-neon"><Icon name="auto_awesome" className="text-5xl" /></div>
              <h4 className="font-bold mb-3 text-neon">AI Application Insight</h4>
              <div id="aiInsightText" className="text-sm text-white/90 leading-relaxed mb-4">
                <Insight insight={insight} />
              </div>
              <span className="text-[10px] font-label uppercase tracking-widest text-neon">Automated System Advice</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function WatchlistItem({ org, onOpen, onRemove }) {
  const category = getCategoryMeta(org.cat);
  return (
    <div
      className="bg-white rounded-2xl p-3 sm:p-5 border border-zinc-100 flex gap-3 sm:gap-4 items-start hover:shadow-lg hover:border-primary/20 transition-all animate-fade-up cursor-pointer"
      data-watchlist-org={org.name}
      onClick={() => onOpen(org.name)}
    >
      <div className="w-12 h-12 rounded-xl bg-surface-container-low flex items-center justify-center flex-shrink-0 overflow-hidden border border-zinc-100">
        {logoUrlFor(org) ? <OrgLogo org={org} /> : <Icon name="corporate_fare" className="text-primary-ink text-xl" />}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2 mb-1.5 flex-wrap">
          <h4 className="font-bold text-zinc-900 leading-tight">{org.name}</h4>
          <div className="flex items-center gap-2 flex-shrink-0">
            <span className={`text-[10px] font-label font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${category.className}`}>{category.label}</span>
            <span className="text-[10px] font-label font-bold uppercase tracking-wider text-black bg-primary px-2 py-0.5 rounded-full">★ Saved</span>
          </div>
        </div>
        <p className="text-sm text-zinc-500 mb-3 line-clamp-1">{org.desc || ''}</p>
        <div className="flex flex-wrap gap-1.5 mb-3">
          {(org.tags || []).slice(0, 4).map((t) => (
            <span key={t} className="px-2 py-0.5 bg-surface-container-low text-[10px] font-mono rounded text-zinc-600">{t}</span>
          ))}
        </div>
        <div className="flex items-center justify-between flex-wrap gap-y-2 pt-3 border-t border-zinc-100 dark:border-zinc-800/60">
          <div className="flex items-center gap-3 text-xs text-zinc-400">
            <span className="flex items-center gap-1"><Icon name="calendar_today" className="text-xs" />{org.years}y</span>
            <span className="flex items-center gap-1"><Icon name="bar_chart" className="text-xs" />{org.competition || '—'}</span>
          </div>
          <button
            className="bookmark-btn text-[10px] font-bold uppercase tracking-widest text-red-400 hover:text-red-600 flex items-center gap-1 transition-colors ml-auto"
            onClick={(e) => { e.stopPropagation(); onRemove(org.name); }}
          >
            <Icon name="bookmark_remove" className="text-xs" />
            Remove
          </button>
        </div>
      </div>
    </div>
  );
}

function Insight({ insight }) {
  if (!insight) return <>Star organizations to get personalized contribution advice.</>;
  const { count, topTags, advice, catLabel, strategy } = insight;
  const strategyMsg = {
    high: <>⚠️ Your watchlist skews towards <strong>high-competition</strong> orgs — consider adding a few <em>Chill</em> orgs to diversify your odds.</>,
    low: <>✅ Smart move — your watchlist is weighted towards <strong>lower-competition</strong> orgs, which improves acceptance probability.</>,
    balanced: <>📊 Your watchlist has a <strong>balanced mix</strong> of competition levels — a solid hedging strategy.</>,
  }[strategy];

  return (
    <div className="space-y-3 text-sm leading-relaxed">
      <p>
        <span className="font-bold">📌 Stack Focus:</span>{' '}
        {topTags.length ? <>Your saved orgs centre on <strong>{topTags.join(', ')}</strong>.</> : 'Your saved orgs span a diverse set of technologies.'}{' '}
        Highlight experience with <strong>{advice.tools}</strong> in your proposals.
      </p>
      <p>
        <span className="font-bold">🎯 Domain Strategy ({catLabel}):</span>{' '}
        Before submitting, {advice.action} to demonstrate early commitment to mentors.
      </p>
      <p>{strategyMsg}</p>
      <p className="text-neon text-[10px] font-label uppercase tracking-widest pt-1 border-t border-white/20">
        Based on {count} saved org{count !== 1 ? 's' : ''} · Automated insight
      </p>
    </div>
  );
}
