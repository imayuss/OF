import { useCallback, useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import Icon from '../ui/Icon';
import { useTheme } from '../../hooks/useTheme';
import { SECTION_LABELS, useSectionNav } from '../../hooks/useSectionNav';
import { useApp } from '../../context/AppContext';

const NAV_ITEMS = [
  { id: 'timeline', label: 'Timeline', icon: 'schedule' },
  { id: 'orgs', label: 'Organizations', icon: 'business' },
  { id: 'ai-recommender', label: 'Recommender', icon: 'auto_awesome', nowrap: true },
  { id: 'watchlist', label: 'Watchlist', icon: 'bookmark' },
  { id: 'issues', label: 'Issues', icon: 'bug_report' },
  { id: 'mentors', label: 'Mentors', icon: 'group' },
  { id: 'guide', label: 'Guide', icon: 'menu_book' },
];

const REPO_URL = 'https://github.com/imayuss/OF';

/** Fixed header, slide-in mobile menu and the floating prev/next section buttons. */
export default function Navigation() {
  const { dark, toggleTheme } = useTheme();
  const { openAnalytics, openHelp } = useApp();
  const nav = useSectionNav();

  // ── Mobile menu: `mounted` controls display, `shown` drives the slide transition ──
  const [mounted, setMounted] = useState(false);
  const [shown, setShown] = useState(false);
  const closeTimer = useRef(null);

  const openMenu = useCallback(() => {
    clearTimeout(closeTimer.current);
    setMounted(true);
    setTimeout(() => setShown(true), 10);
  }, []);
  const closeMenu = useCallback((immediate = false) => {
    clearTimeout(closeTimer.current);
    setShown(false);
    if (immediate) setMounted(false);
    else closeTimer.current = setTimeout(() => setMounted(false), 300);
  }, []);
  const toggleMenu = () => (mounted ? closeMenu() : openMenu());

  useEffect(() => {
    const mq = window.matchMedia('(min-width: 1024px)');
    const onChange = (e) => { if (e.matches) closeMenu(true); };
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, [closeMenu]);

  useEffect(() => {
    if (!mounted) return undefined;
    const onKey = (e) => { if (e.key === 'Escape') closeMenu(); };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [mounted, closeMenu]);

  const go = (id) => (e) => {
    e.preventDefault();
    nav.scrollToId(id);
  };

  return (
    <>
      <div id="sectionScrollIndicator" className="section-scroll-indicator border border-red-500" aria-live="polite" aria-atomic="true">
        <span className="section-scroll-indicator-dot" aria-hidden="true" />
        <span>Section:</span>
        <span id="sectionScrollIndicatorValue" className="section-scroll-indicator-value">
          {SECTION_LABELS[nav.activeId] || 'Timeline'}
        </span>
      </div>
      <ScrollButton direction="up" label="Previous Section" icon="keyboard_arrow_up" disabled={nav.current === 0} onClick={nav.prev} />
      <ScrollButton direction="down" label="Next Section" icon="keyboard_arrow_down" disabled={nav.current === nav.total - 1} onClick={nav.next} />

      <header className="fixed top-0 w-full z-50 bg-white/80 glass shadow-sm">
        <div className="flex items-center justify-between px-4 sm:px-6 py-3 max-w-7xl mx-auto w-full">
          <div className="flex items-center gap-1.5 sm:gap-4 xl:gap-8">
            <button
              id="menuBtn"
              onClick={toggleMenu}
              className="inline-flex lg:hidden shrink-0 items-center justify-center p-2 hover:bg-zinc-100/50 rounded-lg transition-colors"
              aria-label={mounted ? 'Close menu' : 'Open menu'}
              aria-expanded={mounted}
              aria-controls="mobileMenu"
            >
              <Icon name="menu" className="text-zinc-600" />
            </button>

            <Link
              to="/"
              className="inline-flex shrink-0 items-center gap-1 px-1.5 sm:px-2 py-2 hover:bg-zinc-100/50 rounded-lg transition-colors text-zinc-600 hover:text-zinc-900"
              aria-label="Go to home page"
              title="Home"
            >
              <Icon name="home" className="text-lg" />
              <span className="hidden xs:inline text-sm font-medium whitespace-nowrap">Home</span>
            </Link>

            <a href="#timeline" className="flex items-center gap-2" id="logoLink" onClick={go('timeline')}>
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-primary-container flex items-center justify-center flex-shrink-0">
                <span className="text-black font-bold text-sm">G</span>
              </div>
              <span className="text-base sm:text-lg font-extrabold tracking-tight text-zinc-900 font-headline whitespace-nowrap">
                <span className="hidden sm:inline">GSoC 2026 </span>
                <span className="text-primary-ink italic">Org Finder</span>
              </span>
            </a>

            <nav className="hidden lg:flex items-center gap-4 xl:gap-6 text-sm font-medium">
              {NAV_ITEMS.map((item) => (
                <a
                  key={item.id}
                  href={`#${item.id}`}
                  data-section={item.id}
                  onClick={go(item.id)}
                  className={`desktop-nav-link transition-colors${item.nowrap ? ' whitespace-nowrap' : ''} ${nav.activeId === item.id
                    ? 'text-orange-600 font-bold border-b-2 border-orange-600'
                    : 'text-zinc-600 hover:text-zinc-900'
                    }`}
                >
                  {item.label}
                </a>
              ))}
            </nav>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            <button
              id="themeToggleBtn"
              onClick={toggleTheme}
              className="inline-flex shrink-0 items-center justify-center p-2 hover:bg-zinc-100/50 rounded-full transition-colors"
              aria-label={dark ? 'Switch to light theme' : 'Switch to dark theme'}
              aria-pressed={dark}
              title={dark ? 'Switch to light theme' : 'Switch to dark theme'}
            >
              <Icon name={dark ? 'light_mode' : 'dark_mode'} className="text-zinc-600" />
            </button>

            <button
              id="analyticsBtn"
              onClick={openAnalytics}
              className="inline-flex shrink-0 items-center justify-center p-2 hover:bg-zinc-100/50 rounded-full transition-colors"
              title="View Analytics & Badges"
              aria-label="View Analytics and Badges"
            >
              <Icon name="analytics" className="text-zinc-600" />
            </button>

            <button
              id="helpBtn"
              onClick={openHelp}
              className="inline-flex shrink-0 items-center justify-center p-2 hover:bg-zinc-100/50 rounded-full transition-colors"
              title="Keyboard shortcuts (?)"
            >
              <Icon name="help" className="text-zinc-600" />
            </button>

            <a
              href={REPO_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="hidden sm:flex items-center gap-2 px-3 xl:px-4 py-2 rounded-full bg-black text-white text-xs font-bold hover:bg-primary hover:text-black dark:bg-neon dark:text-black dark:hover:bg-primary transition-colors whitespace-nowrap"
            >
              <Icon name="star" className="text-sm" />
              <span className="lg:hidden xl:inline">Star &amp; Contribute</span>
              <span className="hidden lg:inline xl:hidden">Star</span>
            </a>
          </div>
        </div>
      </header>

      {/* Mobile menu overlay */}
      <div id="mobileMenu" className={`fixed inset-0 z-50 lg:hidden${mounted ? '' : ' hidden'}`} style={{ zIndex: 60 }} role="dialog" aria-modal="true" aria-label="Navigation menu">
        <div
          className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          onClick={() => closeMenu()}
          onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') closeMenu(); }}
          tabIndex={0}
          role="button"
          aria-label="Close menu"
        />
        <nav
          id="menuPanel"
          aria-label="Main navigation"
          className="absolute top-0 left-0 bottom-0 w-72 bg-white shadow-2xl transform transition-transform duration-300 ease-out -translate-x-full"
          style={{ transform: shown ? 'translateX(0)' : 'translateX(-100%)' }}
        >
          <div className="flex items-center justify-between p-6 border-b border-zinc-100">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-primary-container flex items-center justify-center">
                <span className="text-black font-bold text-sm">G</span>
              </div>
              <span className="font-extrabold tracking-tight text-zinc-900">Menu</span>
            </div>
            <button onClick={() => closeMenu()} className="p-2 hover:bg-zinc-100 rounded-lg transition-colors" aria-label="Close menu">
              <Icon name="close" className="text-zinc-600" />
            </button>
          </div>

          <div className="p-4 space-y-1">
            {NAV_ITEMS.map((item) => (
              <a
                key={item.id}
                href={`#${item.id}`}
                data-section={item.id}
                onClick={(e) => { go(item.id)(e); closeMenu(); }}
                className={`mobile-menu-link flex items-center gap-3 px-4 py-3 rounded-lg text-sm transition-colors ${nav.activeId === item.id
                  ? 'text-orange-600 bg-orange-50 font-bold'
                  : 'text-zinc-700 hover:bg-zinc-100 font-medium'
                  }`}
              >
                <Icon name={item.icon} className="text-lg" />
                {item.label}
              </a>
            ))}
          </div>

          <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-zinc-100">
            <a href={REPO_URL} target="_blank" rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 w-full px-4 py-3 rounded-lg bg-black text-white text-sm font-bold hover:bg-primary hover:text-black dark:bg-neon dark:text-black dark:hover:bg-primary transition-colors">
              <Icon name="star" className="text-base" /> Star &amp; Contiiiribute.....
            </a>
          </div>
        </nav>
      </div>
    </>
  );
}

/** Floating prev/next button with the bounce + ripple click feedback of the original. */
function ScrollButton({ direction, label, icon, disabled, onClick }) {
  const [bounce, setBounce] = useState(false);
  const [ripples, setRipples] = useState([]);
  const reduced = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const handleClick = (e) => {
    if (!reduced()) {
      setBounce(true);
      const rect = e.currentTarget.getBoundingClientRect();
      const size = Math.max(rect.width, rect.height);
      const keyboard = e.detail === 0;
      const x = !keyboard ? e.clientX - rect.left - size / 2 : rect.width / 2 - size / 2;
      const y = !keyboard ? e.clientY - rect.top - size / 2 : rect.height / 2 - size / 2;
      setRipples((r) => [...r, { id: Date.now() + Math.random(), size, x, y }]);
    }
    onClick();
  };

  const animClass = direction === 'up' ? 'bounce-up-active' : 'bounce-down-active';
  return (
    <button
      id={direction === 'up' ? 'prevSectionBtn' : 'nextSectionBtn'}
      className={`section-scroll-btn${bounce ? ` ${animClass}` : ''}`}
      aria-label={label}
      disabled={disabled}
      onClick={handleClick}
      onAnimationEnd={(e) => {
        if (e.animationName === 'bounce-up' || e.animationName === 'bounce-down') setBounce(false);
      }}
    >
      <Icon name={icon} />
      {ripples.map((r) => (
        <span
          key={r.id}
          className="click-ripple"
          style={{ width: r.size, height: r.size, left: r.x, top: r.y }}
          onAnimationEnd={() => setRipples((list) => list.filter((x) => x.id !== r.id))}
        />
      ))}
    </button>
  );
}
