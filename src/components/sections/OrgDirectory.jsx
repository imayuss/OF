import { useRef } from 'react';
import Icon from '../ui/Icon';
import Pagination from '../ui/Pagination';
import OrgCard from '../orgs/OrgCard';
import FilterChips from '../orgs/FilterChips';
import LanguageFilters from '../orgs/LanguageFilters';
import MobileFilters from '../orgs/MobileFilters';
import { ORGS } from '../../data/orgs';
import { CATEGORY_OPTIONS, COMPLEXITY_OPTIONS, SORT_OPTIONS } from '../../lib/filters';
import { ITEMS_PER_PAGE, scrollDirectoryToTop } from '../../lib/utils';
import { useApp } from '../../context/AppContext';

const SELECT_CLASS =
  'flex-1 md:flex-none bg-surface-container-low border-none rounded-xl text-xs font-bold focus:ring-2 focus:ring-zinc-500 focus:outline-none cursor-pointer text-zinc-600 px-2 py-2';

function FilterSelect({ id, label, value, options, onChange }) {
  return (
    <select id={id} aria-label={label} value={value} onChange={(e) => onChange(e.target.value)} className={SELECT_CLASS}>
      {options.map(([val, text]) => <option key={val} value={val}>{text}</option>)}
    </select>
  );
}

/** Organizations section: chips, language filters, dropdowns, paginated card grid. */
export default function OrgDirectory({ filters }) {
  const { bookmarks, compareList, openOrg, toggleBookmark, toggleCompare } = useApp();
  const gridRef = useRef(null);
  const { filtered, page } = filters;

  const totalPages = Math.max(1, Math.ceil(filtered.length / ITEMS_PER_PAGE));
  const currentPage = Math.min(page, totalPages);
  const slice = filtered.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

  const changePage = (p) => {
    filters.setPage(p);
    // wait for the new page to render before scrolling
    requestAnimationFrame(() => scrollDirectoryToTop(gridRef.current));
  };

  return (
    <section id="orgs" className="px-6 max-w-7xl mx-auto pb-20">
      <div className="mb-12">
        <span className="font-label text-xs font-bold uppercase tracking-[0.2em] text-primary-ink">Find projects that fit you</span>
        <h2 className="text-4xl md:text-5xl font-extrabold font-headline tracking-tighter mt-2">Organizations</h2>
        <p className="text-zinc-600 dark:text-zinc-400 mt-4 max-w-2xl">
          Browse and filter GSoC 2026 organizations by tech stack, difficulty level, and interests to discover projects that match your skills and goals.
        </p>
      </div>

      {/* Desktop: chips + language pills */}
      <div className="mb-6 fade-up hidden md:block" style={{ animationDelay: '.3s' }}>
        <FilterChips activeChip={filters.chip} onToggle={filters.toggleChip} />
        <LanguageFilters
          languages={filters.languages}
          matchAll={filters.matchAll}
          onToggle={filters.toggleLanguage}
          onRemove={filters.removeLanguage}
          onClear={filters.clearLanguages}
          onMatchAll={filters.setMatchAll}
        />
      </div>

      {/* Mobile: dropdown replacements */}
      <MobileFilters
        activeChip={filters.chip}
        onToggleChip={filters.toggleChip}
        languages={filters.languages}
        onToggleLanguage={filters.toggleLanguage}
        onRemoveLanguage={filters.removeLanguage}
        onClearLanguages={filters.clearLanguages}
        matchAll={filters.matchAll}
        onMatchAll={filters.setMatchAll}
      />

      <div className="flex flex-wrap items-center justify-between gap-3 mb-8">
        <p className="font-label text-xs uppercase tracking-widest text-zinc-500">
          Showing <strong id="orgCount">{filtered.length}</strong> of <span>{ORGS.length}</span> organizations
        </p>
        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
          <FilterSelect id="categoryFilter" label="Filter by category" value={filters.category} options={CATEGORY_OPTIONS} onChange={filters.setCategory} />
          <FilterSelect id="complexityFilter" label="Filter by complexity" value={filters.complexity} options={COMPLEXITY_OPTIONS} onChange={filters.setComplexity} />
          <FilterSelect id="sortSelect" label="Sort organizations" value={filters.sort} options={SORT_OPTIONS} onChange={filters.setSort} />
          <button
            id="clearFiltersBtn"
            onClick={filters.clearAll}
            className="px-3 py-2 bg-red-50 text-red-600 border border-red-100 rounded-xl text-xs font-bold hover:bg-red-100 transition-colors flex items-center gap-1"
            title="Clear all search and filters"
          >
            <Icon name="filter_alt_off" className="text-sm" />
            <span className="hidden sm:inline">Clear Filters</span>
          </button>
        </div>
      </div>

      {filtered.length === 0 ? (
        <div id="emptyState" className="py-20 text-center animate-fade-up">
          <div className="text-6xl mb-4">🔍</div>
          <h3 className="text-2xl font-bold text-zinc-900 dark:text-white mb-2">No organizations match your current filters.</h3>
          <p className="text-zinc-500 dark:text-zinc-400 mb-8">Try adjusting your search or clearing some filters.</p>
          <button onClick={filters.clearAll} className="px-8 py-3 bg-primary text-black rounded-xl font-bold hover:bg-orange-600 transition-colors shadow-lg shadow-primary/20">
            Clear All Filters
          </button>
        </div>
      ) : (
        <>
          <div ref={gridRef} id="orgGrid" className="org-grid grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 scrollable-directory org-directory">
            {slice.map((org) => (
              <OrgCard
                key={org.name}
                org={org}
                isBookmarked={bookmarks.has(org.name)}
                isComparing={compareList.includes(org.name)}
                onOpen={openOrg}
                onToggleBookmark={toggleBookmark}
                onToggleCompare={toggleCompare}
              />
            ))}
          </div>
          <Pagination
            id="orgPagination"
            className="mt-12 flex-nowrap items-center justify-center gap-1 overflow-x-auto no-scrollbar"
            ariaLabel="Organizations pagination"
            total={filtered.length}
            page={currentPage}
            onPageChange={changePage}
          />
        </>
      )}
    </section>
  );
}
