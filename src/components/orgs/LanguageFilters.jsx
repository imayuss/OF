import { LANGUAGE_PILLS } from '../../lib/utils';

const HINT_AND = 'Multiple language chips use AND (must match all selected).';
const HINT_OR = 'Multiple language chips use OR (any selected).';

/** Strip showing the selected languages with remove buttons (desktop + mobile share it). */
export function SelectedLangsStrip({ id, languages, onRemove, onClear, minHeight = 'min-h-[32px]', topMargin = 'mt-3' }) {
  return (
    <div id={id} className={`${topMargin} flex flex-wrap items-center gap-2 ${minHeight}`}>
      {languages.length === 0 ? (
        <span className="empty-state">No languages selected</span>
      ) : (
        <>
          {languages.map((lang) => (
            <span key={lang} className="selected-lang-badge" data-lang={lang}>
              {lang}
              <button className="unselect-lang-btn" onClick={() => onRemove(lang)} aria-label={`Remove ${lang}`}>×</button>
            </span>
          ))}
          <button className="clear-all-langs-btn" onClick={onClear}>Clear all</button>
        </>
      )}
    </div>
  );
}

/** Desktop language pills + AND/OR toggle. */
export default function LanguageFilters({ languages, matchAll, onToggle, onRemove, onClear, onMatchAll }) {
  return (
    <>
      <div className="flex flex-wrap gap-2">
        {LANGUAGE_PILLS.map((lang) => {
          const active = languages.includes(lang);
          return (
            <button
              key={lang}
              data-lang={lang}
              aria-pressed={active}
              onClick={() => onToggle(lang)}
              className={`pill px-3 py-1.5 rounded-full bg-surface-container-high border-zinc-200 text-xs font-medium hover:border-primary hover:text-primary-ink transition-colors${active ? ' active' : ''}`}
            >
              {lang}
            </button>
          );
        })}
      </div>
      <SelectedLangsStrip id="selectedLangsStrip" languages={languages} onRemove={onRemove} onClear={onClear} />
      <div className="mt-2 flex items-center gap-2">
        <label className="inline-flex items-center gap-2 cursor-pointer select-none">
          <input
            id="matchAllLanguagesToggle"
            type="checkbox"
            checked={matchAll}
            onChange={(e) => onMatchAll(e.target.checked)}
            className="rounded border-zinc-300 text-primary-ink focus:ring-primary"
            aria-describedby="languageLogicHint"
          />
          <span className="text-xs text-zinc-600 font-medium">Match all selected languages </span>
        </label>
        <span id="languageLogicHint" className="text-xs text-primary-ink font-medium italic">{matchAll ? HINT_AND : HINT_OR}</span>
      </div>
    </>
  );
}
