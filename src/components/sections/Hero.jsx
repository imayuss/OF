import Icon from '../ui/Icon';
import Timeline from './Timeline';
import { ORGS } from '../../data/orgs';
import { BadgeSystem } from '../../lib/badges';

const STATS = [
  { icon: 'groups', iconClass: 'text-primary-ink', label: 'Total Orgs', value: ORGS.length },
  { icon: 'code', iconClass: 'text-secondary dark:text-neon', label: 'Languages', value: '30+' },
  { icon: 'category', iconClass: 'text-black dark:text-primary-container', label: 'Domains', value: '15+' },
];

export default function Hero({ query, onQueryChange, onSurprise }) {
  const submit = () => {
    if (query.trim().length > 0) BadgeSystem.trackSearch();
    document.getElementById('orgs')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="pt-20 sm:pt-28 pb-12 sm:pb-20 px-4 sm:px-6 max-w-7xl mx-auto fade-up">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16 items-stretch">
        <div className="lg:col-span-7">

          <h1 className="text-4xl sm:text-5xl md:text-7xl font-extrabold font-headline tracking-tighter text-zinc-900 mb-4 sm:mb-6 leading-[0.95]">
            Find Your<br /><span className="text-primary italic">Perfect Org</span>
          </h1>
          <p className="text-base sm:text-lg text-zinc-600 max-w-xl mb-8 sm:mb-10 leading-relaxed">
            Browse all <strong>{ORGS.length}</strong> organizations. Filter by language, domain, competition, and live GitHub activity. Land your summer internship.
          </p>

          <div className="relative max-w-xl mb-6 sm:mb-8 search-bar-container">
            <div className="relative rounded-2xl p-[1.5px] bg-zinc-200 dark:bg-zinc-800 transition-all duration-300 search-border-outer">
              <svg className="timeline-border-svg" fill="none">
                <rect className="timeline-border-rect" rx="16" ry="16" pathLength="100" />
              </svg>
              <div className="relative z-10 bg-white dark:bg-[#0D0D0D] rounded-[calc(1rem-1.5px)] w-full search-border-inner flex items-center gap-2 transition-all duration-300">
                <Icon name="search" className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400" />
                <input
                  id="hero-search"
                  type="text"
                  value={query}
                  onChange={(e) => onQueryChange(e.target.value)}
                  onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); submit(); } }}
                  placeholder="Search organization names..."
                  aria-label="Search GSoC 2026 organizations"
                  className="flex-1 bg-transparent border-0 rounded-2xl py-3 sm:py-4 pl-12 pr-4 text-sm font-medium focus:ring-0 focus:outline-none transition-all text-zinc-900 dark:text-zinc-100"
                />
                <button
                  id="hero-search-submit"
                  type="button"
                  onClick={submit}
                  className="mr-2 inline-flex items-center justify-center rounded-xl bg-primary px-4 py-2 text-xs sm:text-sm font-bold text-black transition-colors hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-primary/30"
                >
                  Search
                </button>
              </div>
            </div>
          </div>

          <div className="mb-8 sm:mb-10">
            <button
              id="surpriseBtn"
              onClick={onSurprise}
              className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-primary to-primary-container text-black rounded-full text-sm font-bold hover:shadow-lg hover:scale-105 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:ring-offset-2"
            >
              Random!
            </button>
          </div>

          <div className="flex flex-wrap gap-3 sm:gap-4">
            {STATS.map((s) => (
              <div key={s.label} className="flex items-center gap-2 px-3 sm:px-4 py-2 bg-white rounded-xl border border-zinc-100 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md">
                <Icon name={s.icon} className={`${s.iconClass} text-lg`} />
                <div>
                  <p className="text-xs sm:text-sm text-zinc-500">{s.label}</p>
                  <p className="font-bold text-lg">{s.value}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <Timeline />
      </div>
    </section>
  );
}
