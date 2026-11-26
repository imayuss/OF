import { useEffect } from 'react';
import { useApp } from '../context/AppContext';

/**
 * Keyboard shortcuts from the old help dialog: ? help · A recommender · M mentors · H top · R reset filters.
 * Ignored while typing, when a button has focus, with modifier keys, or while an overlay is open.
 */
export function useGlobalShortcuts({ resetFilters }) {
  const { openHelp, helpOpen, selectedOrg, proposalOrg } = useApp();

  useEffect(() => {
    const onKeyDown = (e) => {
      if (e.ctrlKey || e.metaKey || e.altKey) return;
      const active = document.activeElement;
      if (active && (['INPUT', 'TEXTAREA', 'SELECT', 'BUTTON'].includes(active.tagName))) return;
      if (helpOpen || selectedOrg || proposalOrg) return;

      const key = e.key.toLowerCase();
      if (e.key === '?') {
        e.preventDefault();
        openHelp();
      } else if (key === 'a') {
        e.preventDefault();
        document.getElementById('ai-recommender')?.scrollIntoView({ behavior: 'smooth' });
      } else if (key === 'm') {
        e.preventDefault();
        document.getElementById('mentors')?.scrollIntoView({ behavior: 'smooth' });
      } else if (key === 'h') {
        e.preventDefault();
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else if (key === 'r') {
        e.preventDefault();
        resetFilters();
      }
    };
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [openHelp, helpOpen, selectedOrg, proposalOrg, resetFilters]);
}
