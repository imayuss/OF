import {
  createContext, useCallback, useContext, useEffect, useMemo, useState,
} from 'react';
import { ORGS } from '../data/orgs';
import { BadgeSystem } from '../lib/badges';
import { parseStoredBookmarks } from '../lib/utils';
import { useMentorData } from '../hooks/useMentorData';
import { useBodyScrollLock } from '../hooks/useBodyScrollLock';

const AppContext = createContext(null);

const RECENTLY_VIEWED_KEY = 'recentlyViewedOrgs';
export const RECENTLY_VIEWED_LIMIT = 8;
export const MAX_COMPARE = 3;

function loadRecentlyViewed() {
  try {
    const parsed = JSON.parse(localStorage.getItem(RECENTLY_VIEWED_KEY) || '[]');
    if (!Array.isArray(parsed)) return [];
    const orgNames = new Set(ORGS.map((org) => org.name));
    const seen = new Set();
    return parsed.filter((name) => {
      if (typeof name !== 'string' || !orgNames.has(name) || seen.has(name)) return false;
      seen.add(name);
      return true;
    });
  } catch {
    return [];
  }
}

/**
 * Single store for everything that used to be module-level `let`s and `globalThis.*`
 * in the old inline script: bookmarks, compare list, recently viewed, and which overlay is open.
 */
export function AppProvider({ children }) {
  // ── Bookmarks (Watchlist) ────────────────────────────────────────────────
  const [bookmarks, setBookmarks] = useState(() => new Set(parseStoredBookmarks()));
  useEffect(() => {
    try {
      localStorage.setItem('bookmarks', JSON.stringify([...bookmarks]));
    } catch {
      /* storage unavailable */
    }
  }, [bookmarks]);

  const toggleBookmark = useCallback((name) => {
    if (!name) return;
    setBookmarks((prev) => {
      const next = new Set(prev);
      if (next.has(name)) next.delete(name);
      else next.add(name);
      return next;
    });
  }, []);
  const addBookmark = useCallback((name) => {
    setBookmarks((prev) => new Set(prev).add(name));
  }, []);
  const clearBookmarks = useCallback(() => {
    setBookmarks((prev) => {
      if (!prev.size) return prev;
      if (!confirm(`Remove all ${prev.size} bookmarked organization(s)? This cannot be undone.`)) return prev;
      return new Set();
    });
  }, []);

  // ── Toast ────────────────────────────────────────────────────────────────
  const [toast, setToast] = useState(null);
  const showToast = useCallback((message) => setToast({ message, id: Date.now() }), []);

  // ── Compare list (max 3) ─────────────────────────────────────────────────
  const [compareList, setCompareList] = useState([]);
  const toggleCompare = useCallback(
    (name) => {
      if (compareList.includes(name)) {
        setCompareList(compareList.filter((n) => n !== name));
      } else if (compareList.length >= MAX_COMPARE) {
        showToast('You can only compare up to 3 organizations at a time.');
      } else {
        setCompareList([...compareList, name]);
      }
    },
    [compareList, showToast],
  );
  const setCompareSlot = useCallback((slot, name) => {
    setCompareList((prev) => {
      const next = [...prev];
      next[slot] = name;
      return next.filter(Boolean);
    });
  }, []);

  // ── Recently viewed ──────────────────────────────────────────────────────
  const [recentlyViewed, setRecentlyViewed] = useState(loadRecentlyViewed);
  useEffect(() => {
    try {
      localStorage.setItem(RECENTLY_VIEWED_KEY, JSON.stringify(recentlyViewed));
    } catch (error) {
      console.warn('Recently viewed persistence failed:', error);
    }
  }, [recentlyViewed]);
  const addRecentlyViewed = useCallback((name) => {
    if (!name) return;
    setRecentlyViewed((prev) => [name, ...prev.filter((n) => n !== name)]);
  }, []);
  const removeRecentlyViewed = useCallback(
    (name) => setRecentlyViewed((prev) => prev.filter((n) => n !== name)), []);
  const clearRecentlyViewed = useCallback(() => setRecentlyViewed([]), []);

  // ── Overlays ─────────────────────────────────────────────────────────────
  const mentors = useMentorData();
  const [selectedOrg, setSelectedOrg] = useState(null);
  const [proposalOrg, setProposalOrg] = useState(null);
  const [compareOpen, setCompareOpen] = useState(false);
  const [analyticsOpen, setAnalyticsOpen] = useState(false);
  const [helpOpen, setHelpOpen] = useState(false);
  const [picker, setPicker] = useState({ open: false, mode: 'compare', slot: null });

  const openOrg = useCallback(
    (name) => {
      if (!ORGS.some((o) => o.name === name)) return;
      addRecentlyViewed(name);
      BadgeSystem.trackOrgView();
      setSelectedOrg(name);
    },
    [addRecentlyViewed],
  );
  const closeOrg = useCallback(() => setSelectedOrg(null), []);
  const openProposal = useCallback((name) => setProposalOrg(name), []);
  const closeProposal = useCallback(() => setProposalOrg(null), []);
  const openCompare = useCallback(() => {
    if (compareList.length >= 2) BadgeSystem.trackComparison();
    setCompareOpen(true);
  }, [compareList.length]);
  const closeCompare = useCallback(() => setCompareOpen(false), []);
  const openAnalytics = useCallback(() => setAnalyticsOpen(true), []);
  const closeAnalytics = useCallback(() => setAnalyticsOpen(false), []);
  const openHelp = useCallback(() => setHelpOpen(true), []);
  const closeHelp = useCallback(() => setHelpOpen(false), []);
  const openPicker = useCallback((modeOrSlot) => {
    if (modeOrSlot === 'watchlist') setPicker({ open: true, mode: 'watchlist', slot: null });
    else setPicker({ open: true, mode: 'compare', slot: modeOrSlot });
  }, []);
  const closePicker = useCallback(() => setPicker({ open: false, mode: 'compare', slot: null }), []);

  useBodyScrollLock(compareOpen || analyticsOpen || picker.open);
  useBodyScrollLock(!!selectedOrg || !!proposalOrg, { modalClass: true });

  // Escape closes the top-most overlay: proposal → compare → org → analytics → picker → help.
  useEffect(() => {
    const onKeyDown = (e) => {
      if (e.key !== 'Escape') return;
      if (proposalOrg) closeProposal();
      else if (compareOpen) closeCompare();
      else if (selectedOrg) closeOrg();
      else if (analyticsOpen) closeAnalytics();
      else if (picker.open) closePicker();
      else if (helpOpen) closeHelp();
    };
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [proposalOrg, compareOpen, selectedOrg, analyticsOpen, picker.open, helpOpen,
    closeProposal, closeCompare, closeOrg, closeAnalytics, closePicker, closeHelp]);

  const value = useMemo(
    () => ({
      bookmarks, toggleBookmark, addBookmark, clearBookmarks,
      compareList, toggleCompare, setCompareSlot,
      recentlyViewed, removeRecentlyViewed, clearRecentlyViewed,
      mentors, toast, showToast,
      selectedOrg, openOrg, closeOrg,
      proposalOrg, openProposal, closeProposal,
      compareOpen, openCompare, closeCompare,
      analyticsOpen, openAnalytics, closeAnalytics,
      helpOpen, openHelp, closeHelp,
      picker, openPicker, closePicker,
    }),
    [bookmarks, toggleBookmark, addBookmark, clearBookmarks, compareList, toggleCompare, setCompareSlot,
      recentlyViewed, removeRecentlyViewed, clearRecentlyViewed, mentors, toast, showToast,
      selectedOrg, openOrg, closeOrg, proposalOrg, openProposal, closeProposal,
      compareOpen, openCompare, closeCompare, analyticsOpen, openAnalytics, closeAnalytics,
      helpOpen, openHelp, closeHelp, picker, openPicker, closePicker],
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used inside <AppProvider>');
  return ctx;
}
