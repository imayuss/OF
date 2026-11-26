import { getPageItems } from '../../lib/filters';
import { ITEMS_PER_PAGE } from '../../lib/utils';

const BASE = 'inline-flex items-center justify-center min-w-[32px] h-8 px-2 rounded-full border text-xs font-bold transition-all select-none';
const NORMAL = 'bg-white text-zinc-600 border-zinc-200 hover:border-primary hover:text-primary-ink cursor-pointer';
const ACTIVE = 'bg-primary text-black border-primary cursor-default';
const DISABLED = 'bg-white text-zinc-300 border-zinc-100 cursor-not-allowed pointer-events-none';
const ELLIPSIS = 'inline-flex items-center justify-center min-w-[24px] h-8 text-xs text-zinc-400 border-none bg-transparent cursor-default select-none';

/** « ‹ 1 … 4 5 6 … 20 › » pager shared by the org directory and mentor finder. */
export default function Pagination({ id, total, page, onPageChange, ariaLabel, className = '' }) {
  const totalPages = Math.ceil(total / ITEMS_PER_PAGE);
  if (totalPages <= 1) return <div id={id} className={className} style={{ display: 'none' }} aria-label={ariaLabel} />;

  const go = (p) => {
    if (Number.isNaN(p) || p < 1 || p > totalPages || p === page) return;
    onPageChange(p);
  };
  const nav = (label, target, disabled, aria) => (
    <button
      type="button"
      className={`${BASE} ${disabled ? DISABLED : NORMAL} whitespace-nowrap px-3`}
      disabled={disabled}
      aria-label={aria}
      onClick={() => go(target)}
    >
      {label}
    </button>
  );

  return (
    <div id={id} className={className} style={{ display: 'flex' }} aria-label={ariaLabel}>
      {nav('«', 1, page === 1, 'First page')}
      {nav('‹', page - 1, page === 1, 'Previous page')}
      {getPageItems(totalPages, page).map((item, i) =>
        item === '…' ? (
          <span key={`e${i}`} className={ELLIPSIS}>…</span>
        ) : (
          <button
            key={item}
            type="button"
            className={`${BASE} ${item === page ? ACTIVE : NORMAL}`}
            aria-label={`Go to page ${item}`}
            aria-current={item === page ? 'page' : undefined}
            onClick={() => go(item)}
          >
            {item}
          </button>
        ),
      )}
      {nav('›', page + 1, page === totalPages, 'Next page')}
      {nav('»', totalPages, page === totalPages, 'Last page')}
    </div>
  );
}
