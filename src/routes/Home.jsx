import { useCallback } from 'react';
import Navigation from '../components/layout/Navigation';
import Footer from '../components/layout/Footer';
import Hero from '../components/sections/Hero';
import OrgDirectory from '../components/sections/OrgDirectory';
import AiRecommender from '../components/sections/AiRecommender';
import Watchlist from '../components/sections/Watchlist';
import Issues from '../components/sections/Issues';
import Mentors from '../components/sections/Mentors';
import Guide from '../components/sections/Guide';
import CompareSection from '../components/sections/CompareSection';
import Contact from '../components/sections/Contact';
import OrgModal from '../components/modals/OrgModal';
import ProposalBuilder from '../components/modals/ProposalBuilder';
import CompareModal from '../components/modals/CompareModal';
import AnalyticsModal from '../components/modals/AnalyticsModal';
import HelpModal from '../components/modals/HelpModal';
import OrgPicker from '../components/modals/OrgPicker';
import { BadgeToastHost, CompareToast } from '../components/ui/Toasts';
import { ORGS } from '../data/orgs';
import { useApp } from '../context/AppContext';
import { useOrgFilters } from '../hooks/useOrgFilters';
import { useGlobalShortcuts } from '../hooks/useGlobalShortcuts';

/** The GSoC org finder (everything that lived in the old index.html). */
export default function Home() {
  const { bookmarks, openOrg } = useApp();
  const filters = useOrgFilters(bookmarks);
  const { filtered, clearAll } = filters;

  useGlobalShortcuts({ resetFilters: clearAll });

  // "Surprise me": random org from the current results (falls back to everything).
  const surprise = useCallback(() => {
    const pool = filtered.length > 0 ? filtered : ORGS;
    openOrg(pool[Math.floor(Math.random() * pool.length)].name);
  }, [filtered, openOrg]);

  return (
    <>
      <Navigation />
      <main>
        <Hero query={filters.query} onQueryChange={filters.setQuery} onSurprise={surprise} />
        <OrgDirectory filters={filters} />
        <AiRecommender />
        <Watchlist />
        <Issues />
        <Mentors />
        <Guide />
        <CompareSection />
        <Contact />
      </main>
      <Footer />

      <OrgModal />
      <ProposalBuilder />
      <CompareModal />
      <AnalyticsModal />
      <HelpModal />
      <OrgPicker />
      <CompareToast />
      <BadgeToastHost />
    </>
  );
}
