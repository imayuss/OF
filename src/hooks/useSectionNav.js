import { useCallback, useEffect, useRef, useState } from 'react';

export const SECTION_IDS = ['timeline', 'orgs', 'ai-recommender', 'watchlist', 'issues', 'mentors', 'guide', 'contact'];
export const SECTION_LABELS = {
  timeline: 'Timeline',
  orgs: 'Organizations',
  'ai-recommender': 'AI Recommender',
  watchlist: 'Watchlist',
  issues: 'Issues',
  mentors: 'Mentors',
  guide: 'Guide',
  contact: 'Contact',
};

/**
 * Scroll-spy + smooth-scroll navigation between page sections.
 * Ported from the IIFE at the bottom of the old index.html.
 */
export function useSectionNav() {
  const [current, setCurrent] = useState(0);
  const currentRef = useRef(0);
  const navClicking = useRef(false);
  const navTimer = useRef(null);

  const update = useCallback((index) => {
    currentRef.current = index;
    setCurrent(index);
  }, []);

  const getSections = () => SECTION_IDS.map((id) => document.getElementById(id)).filter(Boolean);

  const detect = useCallback(() => {
    if (navClicking.current) return;
    const sections = getSections();
    if (!sections.length) return;

    if (window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 50) {
      update(sections.length - 1);
      return;
    }
    const header = document.querySelector('header.fixed.top-0');
    const viewportTop = header?.clientHeight || 0;
    const viewportBottom = window.innerHeight;
    let maxVisible = 0;
    let found = 0;
    sections.forEach((section, index) => {
      const rect = section.getBoundingClientRect();
      const visible = Math.min(rect.bottom, viewportBottom) - Math.max(rect.top, viewportTop);
      if (visible > maxVisible) {
        maxVisible = visible;
        found = index;
      }
    });
    update(found);
  }, [update]);

  const scrollToIndex = useCallback(
    (index) => {
      const target = getSections()[index];
      if (!target) return;
      navClicking.current = true;
      update(index);
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      clearTimeout(navTimer.current);
      navTimer.current = setTimeout(() => {
        navClicking.current = false;
        detect();
      }, 150);
    },
    [detect, update],
  );

  const scrollToId = useCallback(
    (id) => {
      const index = getSections().findIndex((s) => s.id === id);
      if (index !== -1) scrollToIndex(index);
    },
    [scrollToIndex],
  );

  useEffect(() => {
    let rafPending = false;
    const onScroll = () => {
      if (navClicking.current) {
        clearTimeout(navTimer.current);
        navTimer.current = setTimeout(() => {
          navClicking.current = false;
          detect();
        }, 100);
        return;
      }
      if (!rafPending) {
        rafPending = true;
        window.requestAnimationFrame(() => {
          detect();
          rafPending = false;
        });
      }
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', detect);
    detect();
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', detect);
      clearTimeout(navTimer.current);
    };
  }, [detect]);

  return {
    current,
    activeId: SECTION_IDS[current],
    total: SECTION_IDS.length,
    scrollToId,
    next: () => { if (currentRef.current < SECTION_IDS.length - 1) scrollToIndex(currentRef.current + 1); },
    prev: () => { if (currentRef.current > 0) scrollToIndex(currentRef.current - 1); },
    first: () => scrollToIndex(0),
  };
}
