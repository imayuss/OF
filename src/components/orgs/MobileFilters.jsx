import { useEffect, useRef, useState } from 'react';
import Icon from '../ui/Icon';
import { SelectedLangsStrip } from './LanguageFilters';
import { CHIPS } from '../../lib/filters';
import { LANGUAGE_PILLS } from '../../lib/utils';

/** Mobile replacement for the chip row and the language pills (two dropdowns + selected strip). */
export default function MobileFilters({ activeChip, onToggleChip, languages, onToggleLanguage, onRemoveLanguage, onClearLanguages, matchAll, onMatchAll }) {
  const [open, setOpen] = useState(null); // 'filters' | 'langs' | null
  const filterWrap = useRef(null);
  const langWrap = useRef(null);

  // Close dropdowns when clicking outside of them.
  useEffect(() => {
    const onDocClick = (e) => {
      if (open === 'filters' && filterWrap.current && !filterWrap.current.contains(e.target)) setOpen(null);
      if (open === 'langs' && langWrap.current && !langWrap.current.contains(e.target)) setOpen(null);
    };
    document.addEventListener('click', onDocClick);
    return () => document.removeEventListener('click', onDocClick);
  }, [open]);

  const toggle = (name) => setOpen((cur) => (cur === name ? null : name));

  return (
    <div className="mb-4 md:hidden fade-up" style={{ animationDelay: '.3s' }}>
      <div className="flex gap-2 mb-3">
        {/* Filters dropdown */}
        <div className="relative flex-1" id="mobileFilterDropdownWrap" ref={filterWrap}>
          <button
            id="mobileFilterBtn"
            onClick={() => toggle('filters')}
            className="w-full flex items-center justify-between px-3 py-2.5 bg-surface-container-highest rounded-xl text-xs font-bold text-on-surface border border-transparent hover:border-primary transition-colors"
          >
            <span className="flex items-center gap-1.5">
              <Icon name="tune" className="text-sm text-primary-ink" />
              <span id="mobileFilterLabel">{activeChip ? 'Filters (1)' : 'Filters'}</span>
            </span>
            <Icon name="expand_more" className="text-sm transition-transform" style={{ transform: open === 'filters' ? 'rotate(180deg)' : '' }} />
          </button>
          <div
            id="mobileFilterPanel"
            className={`${open === 'filters' ? '' : 'hidden '}absolute left-0 top-full mt-1 bg-white dark:bg-zinc-800 rounded-xl shadow-lg border border-zinc-100 dark:border-zinc-700 z-30 p-2 flex flex-col gap-1`}
            style={{ minWidth: 180 }}
          >
            {CHIPS.map((chip) => (
              <button
                key={chip.key}
                onClick={() => onToggleChip(chip.key)}
                className={`mobile-filter-option flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium hover:bg-surface-container-low transition-colors text-left${activeChip === chip.key ? ' bg-primary text-black' : ''}`}
              >
                <Icon name={chip.icon} fill={chip.filled} className="text-sm" style={chip.filled ? { color: '#F04400' } : undefined} /> {chip.label}
              </button>
            ))}
          </div>
        </div>

        {/* Languages dropdown */}
        <div className="relative flex-1" id="mobileLangDropdownWrap" ref={langWrap}>
          <button
            id="mobileLangBtn"
            onClick={() => toggle('langs')}
            className="w-full flex items-center justify-between px-3 py-2.5 bg-surface-container-highest rounded-xl text-xs font-bold text-on-surface border border-transparent hover:border-primary transition-colors"
          >
            <span className="flex items-center gap-1.5">
              <Icon name="code" className="text-sm text-primary-ink" />
              <span id="mobileLangLabel">{languages.length > 0 ? `Languages (${languages.length})` : 'Languages'}</span>
            </span>
            <Icon name="expand_more" className="text-sm transition-transform" style={{ transform: open === 'langs' ? 'rotate(180deg)' : '' }} />
          </button>
          <div
            id="mobileLangPanel"
            className={`${open === 'langs' ? '' : 'hidden '}absolute right-0 top-full mt-1 bg-white dark:bg-zinc-800 rounded-xl shadow-lg border border-zinc-100 dark:border-zinc-700 z-30 p-2`}
            style={{ minWidth: 240 }}
          >
            <div className="flex flex-wrap gap-1.5 p-1">
              {LANGUAGE_PILLS.map((lang) => {
                const active = languages.includes(lang);
                return (
                  <button
                    key={lang}
                    data-lang={lang}
                    onClick={() => onToggleLanguage(lang)}
                    className={`mobile-lang-pill px-3 py-1.5 rounded-full bg-surface-container-high border border-zinc-200 text-xs font-medium hover:border-primary hover:text-primary-ink transition-colors${active ? ' active' : ''}`}
                    style={active ? { borderColor: '#C13400', color: '#C13400', background: '#FFF1EA' } : undefined}
                  >
                    {lang}
                  </button>
                );
              })}
            </div>
            <div className="mt-2 px-1 flex items-center gap-2 border-t border-zinc-100 dark:border-zinc-700 pt-2">
              <label className="inline-flex items-center gap-2 cursor-pointer select-none">
                <input
                  id="matchAllLanguagesToggleMobile"
                  type="checkbox"
                  checked={matchAll}
                  onChange={(e) => onMatchAll(e.target.checked)}
                  className="rounded border-zinc-300 text-primary-ink focus:ring-primary"
                />
                <span className="text-xs text-zinc-600 font-medium">Match all</span>
              </label>
            </div>
          </div>
        </div>
      </div>

      <SelectedLangsStrip id="selectedLangsStripMobile" languages={languages} onRemove={onRemoveLanguage} onClear={onClearLanguages} minHeight="min-h-[28px]" topMargin="" />
    </div>
  );
}
