import { languageMatchesSelection } from './utils';

/** Quick-filter chips (desktop row + mobile dropdown share this list). */
export const CHIPS = [
  { key: 'veterans', label: 'Veterans Only', icon: 'military_tech', tooltip: 'Organizations that participated in GSoC for many years' },
  { key: 'newcomers', label: 'Newcomers', icon: 'fiber_new', tooltip: 'Good for first-time contributors and beginners' },
  { key: 'high-competition', label: 'High Competition', icon: 'local_fire_department', tooltip: 'Highly competitive organizations with many applicants' },
  { key: 'low-competition', label: 'Low Competition', icon: 'sentiment_satisfied', tooltip: 'Organizations with relatively fewer applicants' },
  { key: 'active', label: 'Actively Maintained', icon: 'bolt', tooltip: 'Organizations with recent GitHub activity' },
  { key: 'bookmarked', label: 'Bookmarked', icon: 'star', filled: true, tooltip: 'Organizations you saved for later' },
];

export const PROGRAM_OPTIONS = [
  ['all', 'Programs: All'],
  ['gsoc', 'GSoC'],
  ['gssoc', 'GSSoC'],
  ['nsoc', 'NSoC'],
];

export const CATEGORY_OPTIONS = [
  ['all', 'Categories: All'], ['web', 'Web'], ['programming', 'Programming'], ['science', 'Science'],
  ['os', 'OS'], ['infra', 'Infra'], ['security', 'Security'], ['data', 'Data'], ['media', 'Media'], ['other', 'Other'],
];

export const COMPLEXITY_OPTIONS = [
  ['all', 'Complexity: All'], ['beginner', 'Beginner'], ['intermediate', 'Intermediate'], ['advanced', 'Advanced'],
];

export const SORT_OPTIONS = [
  ['alpha', 'Sort: A-Z'], ['years-desc', 'Years (High-Low)'], ['years-asc', 'Years (Low-High)'],
  ['comp-low', 'Competition (Chill First)'], ['stars', 'GitHub Stars'], ['gfi', 'Good First Issues'],
];

const COMPETITION_ORDER = ['chill', 'moderate', 'hot'];

function getOrgProgram(org) {
  if (org.program) return String(org.program).toLowerCase();
  const tags = (org.tags || []).map((t) => String(t).toLowerCase());
  if (tags.includes('gssoc') || tags.includes('gssoc26') || tags.includes('girlscriptsummerofcode')) return 'gssoc';
  if (tags.includes('nsoc') || tags.includes('nsoc26')) return 'nsoc';
  return 'gsoc';
}

export function applySecondarySort(a, b, sortType) {
  if (sortType === 'years-desc') return b.years - a.years;
  if (sortType === 'years-asc') return a.years - b.years;
  if (sortType === 'comp-low') return COMPETITION_ORDER.indexOf(a.competition) - COMPETITION_ORDER.indexOf(b.competition);
  if (sortType === 'stars') return (b._gh?.stars || 0) - (a._gh?.stars || 0);
  if (sortType === 'gfi') return (b._gh?.gfi || 0) - (a._gh?.gfi || 0);
  return a.name.localeCompare(b.name);
}

/**
- All conditions are additive: program + chip + language pills + search + dropdowns compose.
- Pure function — no DOM access.
 */
export function filterOrgs(orgs, filters, bookmarked) {
  const query = (filters.query || '').trim().toLowerCase();
  const program = !filters.program || filters.program === 'all' ? '' : String(filters.program).toLowerCase();
  const cat = !filters.category || filters.category === 'all' ? '' : filters.category;
  const comp = filters.complexity || 'all';
  const sort = filters.sort || 'alpha';
  const languages = filters.languages || [];

  const result = orgs.filter((o) => {
    const matchProgram = !program || getOrgProgram(o) === program;
    const matchSearch = o.name.toLowerCase().includes(query);
    const matchCat = !cat || o.cat === cat;
    const matchComp = comp === 'all' || o.codebase === comp;
    const tags = (o.tags || []).map((t) => String(t).toLowerCase());
    const matchLang =
      languages.length === 0 ||
      (filters.matchAll
        ? languages.every((lang) => languageMatchesSelection(tags, lang))
        : languages.some((lang) => languageMatchesSelection(tags, lang)));

    let matchChip = true;
    if (filters.chip === 'bookmarked') matchChip = bookmarked.has(o.name);
    else if (filters.chip === 'veterans') matchChip = o.years >= 10;
    else if (filters.chip === 'newcomers') matchChip = o.years <= 3;
    else if (filters.chip === 'low-competition') matchChip = o.competition === 'chill';
    else if (filters.chip === 'high-competition') matchChip = o.competition === 'hot';

    return matchProgram && matchSearch && matchCat && matchComp && matchLang && matchChip;
  });

  if (query) {
    result.sort((a, b) => {
      const nameA = a.name.toLowerCase();
      const nameB = b.name.toLowerCase();
      if (nameA === query && nameB !== query) return -1;
      if (nameB === query && nameA !== query) return 1;
      if (nameA.startsWith(query) && !nameB.startsWith(query)) return -1;
      if (nameB.startsWith(query) && !nameA.startsWith(query)) return 1;
      return applySecondarySort(a, b, sort);
    });
  } else {
    result.sort((a, b) => applySecondarySort(a, b, sort));
  }
  return result;
}

/** Page buttons with ellipsis markers, e.g. [1, '…', 4, 5, 6, '…', 20]. */
export function getPageItems(totalPages, currentPage, wing = 2) {
  const pages = [];
  const add = (p) => {
    if (!pages.includes(p) && p >= 1 && p <= totalPages) pages.push(p);
  };
  add(1);
  add(totalPages);
  for (let i = currentPage - wing; i <= currentPage + wing; i++) add(i);
  pages.sort((a, b) => a - b);

  const items = [];
  pages.forEach((p, i) => {
    if (i > 0 && p - pages[i - 1] > 1) items.push('…');
    items.push(p);
  });
  return items;
}
