import { useCallback, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { ORGS } from '../data/orgs';
import { filterOrgs } from '../lib/filters';
import { BadgeSystem } from '../lib/badges';

/**
 * Directory filter state. Search/category/complexity/sort/languages/chip live in the URL
 * (?q=&cat=&comp=&sort=&lang=&chip=) so they survive refresh — same params as the old app.
 * "Match all languages" and the current page are local state, as before.
 */
export function useOrgFilters(bookmarked) {
  const [searchParams, setSearchParams] = useSearchParams();
  const [matchAll, setMatchAllState] = useState(false);
  const [page, setPage] = useState(1);

  const query = searchParams.get('q') || '';
  const category = searchParams.get('cat') || 'all';
  const complexity = searchParams.get('comp') || 'all';
  const sort = searchParams.get('sort') || 'alpha';
  const chip = searchParams.get('chip') || null;
  const languages = useMemo(
    () => (searchParams.get('lang') || '').split(',').map((s) => s.trim()).filter(Boolean),
    [searchParams],
  );

  const patch = useCallback(
    (changes) => {
      setSearchParams(
        (prev) => {
          const next = new URLSearchParams(prev);
          Object.entries(changes).forEach(([key, value]) => {
            const empty =
              value === null || value === undefined || value === '' ||
              (key === 'cat' && value === 'all') ||
              (key === 'comp' && value === 'all') ||
              (key === 'sort' && value === 'alpha');
            if (empty) next.delete(key);
            else next.set(key, value);
          });
          return next;
        },
        { replace: true },
      );
      setPage(1);
    },
    [setSearchParams],
  );

  const setQuery = useCallback((q) => patch({ q }), [patch]);
  const setCategory = useCallback((cat) => { BadgeSystem.trackFilter(); patch({ cat }); }, [patch]);
  const setComplexity = useCallback((comp) => { BadgeSystem.trackFilter(); patch({ comp }); }, [patch]);
  const setSort = useCallback((value) => patch({ sort: value }), [patch]);
  const setMatchAll = useCallback((value) => { setMatchAllState(value); setPage(1); }, []);

  const toggleLanguage = useCallback(
    (lang) => {
      BadgeSystem.trackFilter();
      const next = languages.includes(lang) ? languages.filter((l) => l !== lang) : [...languages, lang];
      patch({ lang: next.join(',') });
    },
    [languages, patch],
  );
  const removeLanguage = useCallback(
    (lang) => patch({ lang: languages.filter((l) => l !== lang).join(',') }),
    [languages, patch],
  );
  const clearLanguages = useCallback(() => patch({ lang: '' }), [patch]);

  /** Chips are mutually exclusive; clicking the active one clears it. */
  const toggleChip = useCallback((key) => patch({ chip: chip === key ? null : key }), [chip, patch]);

  const clearAll = useCallback(() => {
    setMatchAllState(false);
    setSearchParams({}, { replace: true });
    setPage(1);
  }, [setSearchParams]);

  const filtered = useMemo(
    () => filterOrgs(ORGS, { query, category, complexity, sort, languages, matchAll, chip }, bookmarked),
    [query, category, complexity, sort, languages, matchAll, chip, bookmarked],
  );

  return {
    query, category, complexity, sort, chip, languages, matchAll, page, filtered,
    setQuery, setCategory, setComplexity, setSort, setMatchAll, setPage,
    toggleLanguage, removeLanguage, clearLanguages, toggleChip, clearAll,
  };
}
