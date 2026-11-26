import { useCallback, useEffect, useRef, useState } from 'react';
import Icon from '../ui/Icon';
import { CHIPS } from '../../lib/filters';

const CHIP_IDS = {
  veterans: 'chip-veteran', newcomers: 'chip-newcomer', 'high-competition': 'chip-hot',
  'low-competition': 'chip-chill', active: 'chip-active', bookmarked: 'chip-bookmarked',
};

/** Desktop quick-filter chips + the shared hover/focus tooltip that used to be a global #tooltip div. */
export default function FilterChips({ activeChip, onToggle }) {
  const [tip, setTip] = useState(null); // { text, left, top }
  const anchorRef = useRef(null);
  const hoverCapable = useRef(typeof window !== 'undefined' && window.matchMedia?.('(hover: hover)').matches);
  const hideTimer = useRef(null);

  const place = useCallback((el) => {
    const rect = el.getBoundingClientRect();
    const width = Math.min(220, window.innerWidth - 24);
    const left = Math.min(Math.max(rect.left + rect.width / 2 - width / 2, 12), window.innerWidth - width - 12);
    return { width, left, top: rect.bottom + 10 };
  }, []);

  const show = useCallback((el, text) => {
    anchorRef.current = el;
    setTip({ text, ...place(el) });
  }, [place]);
  const hide = useCallback(() => { anchorRef.current = null; setTip(null); }, []);

  // Reposition on scroll/resize, hide on outside click.
  useEffect(() => {
    const reposition = () => { if (anchorRef.current) setTip((t) => (t ? { ...t, ...place(anchorRef.current) } : t)); };
    const onDocClick = (e) => { if (!e.target.closest('.filter-chip')) hide(); };
    window.addEventListener('scroll', reposition, { passive: true });
    window.addEventListener('resize', reposition, { passive: true });
    document.addEventListener('click', onDocClick);
    return () => {
      window.removeEventListener('scroll', reposition);
      window.removeEventListener('resize', reposition);
      document.removeEventListener('click', onDocClick);
      clearTimeout(hideTimer.current);
    };
  }, [place, hide]);

  return (
    <>
      <div className="flex flex-wrap gap-2 mb-4">
        {CHIPS.map((chip) => {
          const active = activeChip === chip.key;
          return (
            <button
              key={chip.key}
              id={CHIP_IDS[chip.key]}
              data-tooltip={chip.tooltip}
              onMouseEnter={(e) => show(e.currentTarget, chip.tooltip)}
              onMouseLeave={hide}
              onFocus={(e) => show(e.currentTarget, chip.tooltip)}
              onBlur={hide}
              onClick={(e) => {
                onToggle(chip.key);
                if (!hoverCapable.current) {
                  e.stopPropagation();
                  clearTimeout(hideTimer.current);
                  show(e.currentTarget, chip.tooltip);
                  hideTimer.current = setTimeout(hide, 3000);
                }
              }}
              className={`filter-chip px-4 py-2 rounded-full text-xs font-medium hover:bg-primary hover:text-black transition-colors flex items-center gap-1 ${
                active ? 'bg-primary text-black' : 'bg-surface-container-highest'
              }`}
            >
              <Icon name={chip.icon} fill={chip.filled} className="text-sm" style={chip.filled ? { color: '#F04400' } : undefined} /> {chip.label}
            </button>
          );
        })}
      </div>
      <div
        id="tooltip"
        className={`tooltip${tip ? ' show' : ''}`}
        style={tip ? { width: `${tip.width}px`, left: `${tip.left}px`, top: `${tip.top}px` } : undefined}
      >
        {tip?.text}
      </div>
    </>
  );
}
