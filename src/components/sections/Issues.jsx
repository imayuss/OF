import Icon from '../ui/Icon';
import { ORGS } from '../../data/orgs';
import { useIssues } from '../../hooks/useIssues';
import { formatIssuesRefresh, isPostSelection, sanitizeHrefUrl } from '../../lib/utils';

const STATIC_FALLBACKS = ['rust-lang/rust', 'django/django', 'tensorflow/tensorflow', 'kubernetes/kubernetes'];

const gfiSearchUrl = (github) => {
  const query = github.includes('/')
    ? `repo:${github} is:issue is:open label:"good first issue"`
    : `user:${github} is:issue is:open label:"good first issue"`;
  return `https://github.com/issues?q=${encodeURIComponent(query)}`;
};

const CARD = 'bg-white rounded-xl p-5 border border-zinc-100 hover:shadow-lg transition-all group cursor-pointer';

function IssueCard({ href, title, repo, badges, extra, titleClamp = true, className = '' }) {
  const inner = (
    <>
      <div className="flex items-start justify-between mb-3">
        <h4 className={`font-bold text-sm group-hover:text-primary-ink transition-colors${titleClamp ? ' line-clamp-1' : ''}`}>{title}</h4>
        <Icon name="open_in_new" className="text-zinc-300 group-hover:text-primary-ink text-lg" />
      </div>
      <p className="text-xs text-zinc-500 mb-3 font-mono">{repo}</p>
      <div className="flex flex-wrap gap-1.5">
        {badges.map((b) => (
          <span key={b} className="text-[10px] px-2 py-0.5 bg-green-100 text-green-700 rounded font-bold">{b}</span>
        ))}
        {extra}
      </div>
    </>
  );
  return href ? (
    <a className={`${CARD} block${className}`} href={href} target="_blank" rel="noopener noreferrer">{inner}</a>
  ) : (
    <div className={`${CARD}${className}`}>{inner}</div>
  );
}

export default function Issues() {
  const { status, issues, updatedAt } = useIssues();
  const stale = isPostSelection();

  let lastUpdated = 'Last updated: pending refresh';
  if (status === 'error') lastUpdated = 'Last updated: unavailable';
  else if (status === 'ready') lastUpdated = formatIssuesRefresh(updatedAt);

  let cards;
  if (status === 'error') {
    cards = (
      <div className="col-span-full bg-white rounded-xl p-8 border border-zinc-100 text-center">
        <p className="text-sm font-bold text-zinc-900 mb-2">Unable to load pre-fetched issues</p>
        <p className="text-sm text-zinc-600 max-w-xl mx-auto">Cached issue data could not be retrieved at this time. Please refresh the page or try again later.</p>
      </div>
    );
  } else if (status === 'ready' && issues.length === 0) {
    cards = (
      <>
        <p className="col-span-full text-sm text-zinc-500">Live pre-fetched issues are still syncing. Browse open Good First Issues for all organizations below.</p>
        {ORGS.filter((o) => typeof o.github === 'string' && o.github.trim()).map((org) => (
          <IssueCard
            key={org.name}
            href={gfiSearchUrl(org.github.trim())}
            title="Browse open Good First Issues"
            repo={org.github}
            badges={[org.name]}
            extra={<span className="text-[10px] px-2 py-0.5 bg-zinc-100 text-zinc-600 rounded">Label: good first issue</span>}
          />
        ))}
      </>
    );
  } else if (status === 'ready') {
    cards = issues.slice(0, 6).map((issue) => (
      <IssueCard
        key={issue.url || issue.title}
        href={sanitizeHrefUrl(issue.url)}
        title={issue.title || ''}
        repo={issue.repo || ''}
        badges={(issue.labels || []).slice(0, 2)}
        extra={<span className="text-[10px] px-2 py-0.5 bg-zinc-100 text-zinc-600 rounded">{issue.comments || 0} comments</span>}
      />
    ));
  } else {
    // loading: same placeholder cards the static HTML shipped with
    cards = STATIC_FALLBACKS.map((repo) => (
      <IssueCard
        key={repo}
        href={gfiSearchUrl(repo)}
        title="Browse open Good First Issues"
        repo={repo}
        badges={['GitHub search']}
        titleClamp={false}
        className=" issue-fallback-card"
        extra={<span className="text-[10px] px-2 py-0.5 bg-zinc-100 text-zinc-600 rounded">Label: good first issue</span>}
      />
    ));
  }

  return (
    <section id="issues" className="py-20 px-6 max-w-7xl mx-auto">
      <div className="mb-12">
        <span className="font-label text-xs font-bold uppercase tracking-[0.2em] text-primary-ink">First Contributions</span>
        <h2 className="text-4xl md:text-5xl font-extrabold font-headline tracking-tighter mt-2">Good First Issues</h2>
        <p className="text-zinc-600 mt-4 max-w-2xl">Pre-fetched orgs from various oss programs — no rate limits, no token required, instant results.</p>
      </div>

      <div
        id="issuesBanner"
        className={`rounded-2xl p-6 mb-8 flex flex-col sm:flex-row items-start sm:items-center gap-4 border ${stale ? 'bg-zinc-50 dark:bg-zinc-800 border-zinc-200 dark:border-zinc-700' : 'bg-green-50 border-green-200'
          }`}
      >
        <div className="flex items-center gap-3">
          <div id="issuesBannerDot" className={`w-3 h-3 rounded-full ${stale ? 'bg-zinc-400' : 'bg-green-500 pulse-dot'}`} />
          <div>
            <p id="issuesBannerTitle" className={`font-bold text-sm ${stale ? 'text-zinc-800 dark:text-zinc-100' : 'text-green-800'}`}>Pre-fetched Issues Ready</p>
            <p id="issuesBannerSubtitle" className={`text-xs ${stale ? 'text-zinc-500 dark:text-zinc-400' : 'text-green-600'}`}>
              {stale ? 'Data is cached. Updates may be infrequent post-selection.' : 'Updated every 6 hours via GitHub Actions — no API rate limits for visitors.'}
            </p>
          </div>
        </div>
        {/* <div className="sm:ml-auto flex flex-col items-start sm:items-end gap-1">
          <span id="issuesLastUpdated" className={`text-xs font-mono ${stale ? 'text-zinc-500 dark:text-zinc-400' : 'text-green-600'}`}>{lastUpdated}</span>
          {stale && (
            <span id="issuesStaleNote" className="text-xs font-medium text-amber-700 bg-amber-50 border border-amber-200 rounded-full px-2 py-0.5">
              ⏸ GSoC selection complete. Data won&apos;t update frequently.
            </span>
          )}
        </div> */}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">{cards}</div>
    </section>
  );
}
