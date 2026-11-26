/**
 * Shared helpers & constants ported from the inline <script> in the original index.html.
 * Everything here is framework-free so it can be unit-tested with plain Vitest.
 */

export const ITEMS_PER_PAGE = 9;

// ── URL / GitHub helpers ────────────────────────────────────────────────────

/** Only allow absolute http(s) URLs. Returns the normalised URL or null. */
export function sanitizeHrefUrl(url) {
  if (!url || !String(url).trim()) return null;
  try {
    const u = new URL(String(url).trim());
    if (u.protocol === 'http:' || u.protocol === 'https:') return u.toString();
  } catch {
    // invalid URL
  }
  return null;
}

function trimGitHubPathSlashes(path) {
  let start = 0;
  let end = path.length;
  while (start < end && path[start] === '/') start += 1;
  while (end > start && path[end - 1] === '/') end -= 1;
  return path.slice(start, end);
}

export function githubPathFromValue(value) {
  const github = String(value || '').trim();
  if (!github) return '';
  try {
    const url = new URL(github);
    const hostname = url.hostname.toLowerCase();
    if (hostname !== 'github.com' && hostname !== 'www.github.com') return '';
    return trimGitHubPathSlashes(url.pathname);
  } catch {
    return trimGitHubPathSlashes(github);
  }
}

export function githubOwnerFromValue(value) {
  return githubPathFromValue(value).split('/')[0] || '';
}

export function githubUrlFromValue(value) {
  const path = githubPathFromValue(value);
  return path ? `https://github.com/${path}` : null;
}

export function logoUrlFor(org) {
  const owner = githubOwnerFromValue(org.github);
  return owner ? `https://github.com/${owner}.png?size=80` : '';
}

export function orgInitials(name) {
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .substring(0, 2)
    .toUpperCase();
}

// ── Storage ─────────────────────────────────────────────────────────────────

export function parseStoredBookmarks() {
  try {
    const parsed = JSON.parse(localStorage.getItem('bookmarks') || '[]');
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

// ── Categories ──────────────────────────────────────────────────────────────

export const CATEGORY_META = {
  science: { className: 'bg-blue-100 text-blue-700', label: 'Science' },
  programming: { className: 'bg-violet-100 text-violet-700', label: 'Programming' },
  data: { className: 'bg-cyan-100 text-cyan-700', label: 'Data' },
  web: { className: 'bg-green-100 text-green-700', label: 'Web' },
  os: { className: 'bg-orange-100 text-orange-700', label: 'OS / Systems' },
  security: { className: 'bg-red-100 text-red-700', label: 'Security' },
  media: { className: 'bg-pink-100 text-pink-700', label: 'Media' },
  infra: { className: 'bg-yellow-100 text-yellow-700', label: 'Infrastructure' },
  ai: { className: 'bg-purple-100 text-purple-700', label: 'AI / ML' },
  dev: { className: 'bg-teal-100 text-teal-700', label: 'Dev Tools' },
  other: { className: 'bg-zinc-100 text-zinc-600', label: 'Other' },
};

export function getCategoryMeta(category) {
  return CATEGORY_META[category] || CATEGORY_META.other;
}

// ── Mentor channels ─────────────────────────────────────────────────────────

export const CHANNEL_ICONS = {
  Slack: '💬',
  Zulip: '💬',
  Discord: '🎮',
  Matrix: '🔗',
  IRC: '🖥️',
  'Mailing list': '📧',
};

export function formatRelativeRefresh(isoString) {
  if (!isoString) return 'Last updated: unavailable';
  const timestamp = new Date(isoString).getTime();
  if (Number.isNaN(timestamp)) return 'Last updated: unavailable';
  const minutes = Math.max(1, Math.floor((Date.now() - timestamp) / 60000));
  if (minutes < 60) return `Last updated: ${minutes} min ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 48) return `Last updated: ${hours} hour${hours === 1 ? '' : 's'} ago`;
  const days = Math.floor(hours / 24);
  return `Last updated: ${days} day${days === 1 ? '' : 's'} ago`;
}

/** Relative time used by the Good First Issues banner. */
export function formatIssuesRefresh(isoString) {
  if (!isoString) return 'Last updated: unavailable';
  const mins = Math.max(1, Math.floor((Date.now() - new Date(isoString).getTime()) / 60000));
  const hours = Math.floor(mins / 60);
  const days = Math.floor(hours / 24);
  let relative;
  if (mins < 60) relative = `${mins} min ago`;
  else if (hours < 24) relative = `${hours} ${hours === 1 ? 'hour' : 'hours'} ago`;
  else relative = `${days} ${days === 1 ? 'day' : 'days'} ago`;
  return `Last updated: ${relative}`;
}

// ── Languages ───────────────────────────────────────────────────────────────

export const LANGUAGE_PILLS = [
  'Python', 'JavaScript', 'TypeScript', 'C/C++', 'Java', 'Rust',
  'Go', 'Ruby', 'Haskell', 'Scala', 'ML/AI', 'Robotics',
];

export const LANGUAGE_ALIASES = {
  python: ['python'],
  javascript: ['javascript', 'js'],
  typescript: ['typescript', 'ts'],
  'c/c++': ['c', 'c++', 'cpp'],
  java: ['java'],
  rust: ['rust'],
  go: ['go', 'golang'],
  ruby: ['ruby'],
  haskell: ['haskell'],
  scala: ['scala'],
  'ml/ai': ['ml', 'ai', 'machine learning', 'artificial intelligence'],
  robotics: ['robotics', 'robot', 'ros'],
};

/**
 * Exact token matching so "Go" does not match "django".
 * Tags are split on whitespace, commas, slashes and plus signs before comparing.
 */
export function languageMatchesSelection(tags, lang) {
  const langKey = lang.toLowerCase();
  const aliases = LANGUAGE_ALIASES[langKey] || [langKey];
  return aliases.some((alias) => {
    const a = alias.toLowerCase();
    return tags.some((tag) => tag.toLowerCase().split(/[\s,/+]+/).includes(a));
  });
}

// ── Timeline ────────────────────────────────────────────────────────────────

/** GSoC contributor selection completion date (Accepted Projects Announced). */
export const GSOC_SELECTION_DATE = new Date('2026-04-30T23:59:59Z');

export function isPostSelection() {
  return Date.now() > GSOC_SELECTION_DATE.getTime();
}

export const MILESTONES = [
  { date: new Date('2026-02-19T00:00:00Z'), label: 'Accepted Orgs Announced', note: null },
  { date: new Date('2026-03-16T00:00:00Z'), label: 'Contributor Proposals Open', note: null },
  { date: new Date('2026-03-31T23:30:00+05:30'), label: 'Proposal Submission Deadline', note: 'Submit your project proposals by 11:30 PM!' },
  { date: GSOC_SELECTION_DATE, label: 'Accepted Projects Announced', note: null },
  { date: new Date('2026-05-25T00:00:00Z'), label: 'Coding Officially Begins', note: 'Start working on your GSoC project!' },
  { date: new Date('2026-07-06T18:00:00Z'), label: 'Midterm Evaluations Begin', note: 'Mentors and contributors submit midterm evaluations.' },
  { date: new Date('2026-07-10T18:00:00Z'), label: 'Midterm Evaluation Deadline', note: null },
  { date: new Date('2026-08-17T00:00:00Z'), label: 'Final Submissions Begin', note: 'Submit your final work product and evaluation.' },
  { date: new Date('2026-08-24T18:00:00Z'), label: 'Final Submission Deadline (Standard)', note: 'Standard 12-week projects: submit final work product and evaluation.' },
  { date: new Date('2026-08-31T18:00:00Z'), label: 'Mentor Final Evaluations Due (Standard)', note: null },
  { date: new Date('2026-11-02T18:00:00Z'), label: 'Extended Timeline Final Deadline', note: 'Last date for all contributors on extended timelines to submit final work.' },
  { date: new Date('2026-11-09T18:00:00Z'), label: 'Extended Mentor Evaluations Due', note: 'Final date for mentors to submit evaluations for extended projects.' },
].filter((m) => !Number.isNaN(m.date.getTime()));

/** Index of the "current" milestone (first one still in the future, else the last). */
export function getActiveMilestoneIndex(now = new Date()) {
  const idx = MILESTONES.findIndex((m) => m.date > now);
  return idx === -1 ? MILESTONES.length - 1 : idx;
}

export function formatMilestoneDate(date) {
  try {
    return date
      .toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
      .toUpperCase();
  } catch {
    return date.toISOString().slice(0, 10);
  }
}

/** Countdown to the next milestone. Returns null when every milestone is in the past. */
export function getCountdown(now = new Date()) {
  const next = MILESTONES.find((m) => m.date > now);
  if (!next) return null;
  const diff = next.date - now;
  const d = Math.floor(diff / 864e5);
  const h = Math.floor((diff % 864e5) / 36e5);
  const m = Math.floor((diff % 36e5) / 6e4);
  return { label: next.label, text: `${d}d ${h}h ${m}m` };
}

/** Static deadline cards shown in the Watchlist sidebar; hidden once their date has passed (UTC). */
export const UPCOMING_DEADLINES = [
  { date: '2026-03-31', label: 'MAR 31, 2026', title: 'Proposal Submission Deadline', body: 'Ensure your final proposals are submitted by 18:00 UTC.' },
  { date: '2026-04-21', label: 'APR 21, 2026', title: 'Review Period Starts', body: 'Mentors begin ranking of proposals.' },
];

export function getActiveDeadlines(now = new Date()) {
  const todayUTC = Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate());
  return UPCOMING_DEADLINES.filter((d) => {
    const [y, m, day] = d.date.split('-').map(Number);
    if ([y, m, day].some(Number.isNaN)) return false;
    return Date.UTC(y, m - 1, day) >= todayUTC;
  });
}

/** Smooth-scrolls the window so the top of a directory grid sits just below the header. */
export function scrollDirectoryToTop(el) {
  if (!el) return;
  el.scrollTop = 0;
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const header = document.querySelector('nav') || document.querySelector('header');
  const headerHeight = header ? header.getBoundingClientRect().height : 80;
  const SCROLL_OFFSET = 16;
  const gridTop = el.getBoundingClientRect().top + window.scrollY - headerHeight - SCROLL_OFFSET;
  window.scrollTo({ top: gridTop, behavior: prefersReduced ? 'auto' : 'smooth' });
}
