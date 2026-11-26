import { useEffect, useMemo, useRef, useState } from 'react';
import Pagination from '../ui/Pagination';
import Icon from '../ui/Icon';
import { ChannelChips, MentorPreviewChips, mailingAsChannels } from '../orgs/MentorParts';
import { ORGS } from '../../data/orgs';
import {
  ITEMS_PER_PAGE, formatRelativeRefresh, githubUrlFromValue, isPostSelection,
  sanitizeHrefUrl, scrollDirectoryToTop,
} from '../../lib/utils';
import { useApp } from '../../context/AppContext';

const CHANNELS = ['Slack', 'Zulip', 'Discord', 'Matrix', 'IRC', 'Mailing list'];

const getPrimaryContact = (entry) => (entry.channels || [])[0] || (entry.mailingLists || [])[0] || null;

function statusClass(status) {
  if (status === 'ok') return 'bg-green-100 text-green-700';
  if (status === 'no-contact-found') return 'bg-zinc-100 text-zinc-600';
  return 'bg-red-100 text-red-700';
}

export default function Mentors() {
  const { mentors } = useApp();
  const [search, setSearch] = useState('');
  const [channel, setChannel] = useState('all');
  const [page, setPage] = useState(1);
  const gridRef = useRef(null);
  const stale = isPostSelection();

  useEffect(() => { setPage(1); }, [search, channel]);

  const records = useMemo(
    () => (mentors.state === 'loaded' ? ORGS.map((org) => ({ org, entry: mentors.getEntry(org.name) })) : []),
    [mentors],
  );

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return records.filter(({ org, entry }) => {
      const haystack = [org.name, ...(entry.mentors || []).flatMap((m) => [m.name || '', m.github || ''])].join(' ').toLowerCase();
      const contacts = [...(entry.channels || []), ...mailingAsChannels(entry.mailingLists)];
      return (!q || haystack.includes(q)) && (channel === 'all' || contacts.some((c) => c.type === channel));
    });
  }, [records, search, channel]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / ITEMS_PER_PAGE));
  const currentPage = Math.min(page, totalPages);
  const pageItems = filtered.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

  let lastUpdated = 'Last updated: pending refresh';
  if (mentors.state === 'error') lastUpdated = 'Last updated: unavailable';
  else if (mentors.state === 'loaded') lastUpdated = formatRelativeRefresh(records.map((r) => r.entry.lastFetched).find(Boolean));

  const changePage = (p) => {
    setPage(p);
    requestAnimationFrame(() => scrollDirectoryToTop(gridRef.current));
  };

  let gridContent;
  if (mentors.state === 'idle' || mentors.state === 'loading') {
    gridContent = (
      <div className="col-span-full mentor-empty"><p className="text-sm text-zinc-500">Loading mentor contact data...</p></div>
    );
  } else if (mentors.state === 'error') {
    gridContent = (
      <div className="col-span-full mentor-empty">
        <p className="font-bold text-zinc-900 mb-2">Mentor data unavailable right now.</p>
        <p className="text-sm text-zinc-600">The cached mentor snapshot could not be loaded. Please try again later.</p>
      </div>
    );
  } else if (filtered.length === 0) {
    gridContent = (
      <div className="col-span-full mentor-empty">
        <p className="font-bold text-zinc-900 mb-2">No mentor matches found.</p>
        <p className="text-sm text-zinc-600">Try a different org name, GitHub handle, or channel filter.</p>
      </div>
    );
  } else {
    gridContent = pageItems.map(({ org, entry }) => <MentorCard key={org.name} org={org} entry={entry} />);
  }

  const showPager = mentors.state === 'loaded' && filtered.length > 0;

  return (
    <section id="mentors" className="py-20 px-6 bg-surface-container-low">
      <div className="max-w-7xl mx-auto">
        <div className="mb-12">
          <span className="font-label text-xs font-bold uppercase tracking-[0.2em] text-primary-ink">Mentor Outreach</span>
          <h2 className="text-4xl md:text-5xl font-extrabold font-headline tracking-tighter mt-2">Mentor Finder</h2>
          <p className="text-zinc-600 mt-4 max-w-3xl">
            Pre-fetched contact channels and conservative mentor handles from org ideas pages, so you can find where to introduce yourself before proposal season gets busy.
          </p>
        </div>

        <div className="bg-white border border-zinc-100 rounded-2xl p-6 mb-8 flex flex-col sm:flex-row items-start sm:items-center gap-4">
          <div className="flex items-center gap-3">
            <div
              className={`w-3 h-3 rounded-full${stale ? '' : ' pulse-dot'}`}
              id="mentorBannerDot"
              style={{ backgroundColor: stale ? '#a1a1aa' : '#F04400' }}
            />
            <div>
              <p className="font-bold text-zinc-900 text-sm">Cached mentor contact data</p>
              <p className="text-xs text-zinc-600">Generated offline by the project workflow to keep scraping out of the browser.</p>
            </div>
          </div>
          <div className="ml-auto text-right">
            <span id="mentorLastUpdated" className="text-xs font-mono text-zinc-500">{lastUpdated}</span>
            {stale && (
              <span id="mentorStaleNote" className="ml-2 text-xs font-medium text-blue-700 bg-blue-50 border border-blue-200 rounded-full px-2 py-0.5">
                ℹ GSoC selection complete. Data won&apos;t update frequently.
              </span>
            )}
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-zinc-100 p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-[minmax(0,1fr)_220px] gap-4">
            <label className="relative block">
              <Icon name="search" className="absolute left-3 top-3 text-zinc-400 text-sm" />
              <input
                id="mentorSearchInput"
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                aria-label="Search mentors"
                placeholder="Search org name or mentor GitHub handle..."
                className="w-full pl-10 pr-4 py-3 bg-surface-container-low border-none rounded-xl text-sm focus:ring-2 focus:ring-primary"
              />
            </label>
            <select
              id="mentorChannelFilter"
              value={channel}
              onChange={(e) => setChannel(e.target.value)}
              className="bg-surface-container-low border-none rounded-xl text-sm font-medium focus:ring-2 focus:ring-primary text-zinc-700 px-4"
            >
              <option value="all">All channels</option>
              {CHANNELS.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
        </div>

        <div ref={gridRef} id="mentorGrid" className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 scrollable-directory mentor-directory">
          {gridContent}
        </div>
      </div>
      {showPager && (
        <Pagination
          id="mentorPagination"
          className="mt-10 flex-nowrap items-center justify-center gap-1 overflow-x-auto no-scrollbar"
          ariaLabel="Mentor pagination"
          total={filtered.length}
          page={currentPage}
          onPageChange={changePage}
        />
      )}
    </section>
  );
}

function MentorCard({ org, entry }) {
  const primary = getPrimaryContact(entry);
  const ok = entry.status === 'ok';
  const contactLabel = ok ? 'Contact' : 'Ideas page';
  const helper = ok ? 'Ideas page remains available from the org modal.' : 'Use the ideas page to find the latest contact guidance.';
  const href = sanitizeHrefUrl(primary?.url || org.ideas || githubUrlFromValue(org.github));
  const links = [...(entry.channels || []), ...mailingAsChannels(entry.mailingLists)];

  let body;
  if (ok) {
    body = (
      <div className="space-y-3">
        <div className="flex flex-wrap gap-2"><ChannelChips records={links.slice(0, 2)} /></div>
        <MentorPreviewChips mentors={entry.mentors || []} />
        <div className="text-sm text-zinc-600">
          <p><strong className="text-zinc-900">Primary channel:</strong> {primary?.type || 'Not specified'}</p>
        </div>
        {entry.tip && <p className="text-sm text-zinc-600 line-clamp-3">{entry.tip}</p>}
      </div>
    );
  } else if (entry.status === 'no-contact-found') {
    body = <p className="text-sm text-zinc-600">No mentor contact info parsed yet for this org.</p>;
  } else {
    body = <p className="text-sm text-zinc-600">Mentor data unavailable right now.</p>;
  }

  const chipInner = (<><span>📡</span><span>{contactLabel}</span></>);
  return (
    <article className="mentor-card">
      <div className="flex items-start justify-between gap-3 mb-4">
        <div>
          <p className="text-[10px] font-label uppercase tracking-widest text-primary-ink mb-1">{org.cat}</p>
          <h3 className="font-headline text-xl font-bold text-zinc-900">{org.name}</h3>
        </div>
        <span className={`text-xs font-bold uppercase tracking-widest px-2 py-1 rounded-full ${statusClass(entry.status)}`}>{entry.status}</span>
      </div>
      {body}
      <div className="mt-5 pt-4 border-t border-zinc-100">
        {href ? (
          <a href={href} target="_blank" rel="noopener noreferrer" className="mentor-link-chip">{chipInner}</a>
        ) : (
          <span className="mentor-link-chip">{chipInner}</span>
        )}
        <p className="text-xs text-zinc-500 mt-3">{helper}</p>
      </div>
    </article>
  );
}
