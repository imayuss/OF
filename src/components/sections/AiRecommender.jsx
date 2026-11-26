import { useEffect, useRef, useState } from 'react';
import Icon from '../ui/Icon';
import OrgLogo from '../ui/OrgLogo';
import { analyzeGitHubUser } from '../../lib/githubAnalyzer';
import { extractSkills } from '../../lib/skillExtractor';
import { getRecommendations } from '../../lib/recommender';
import { useApp } from '../../context/AppContext';

const PAGE_SIZE = 6;
const MAX_RESUME_SIZE = 5 * 1024 * 1024; // 5MB

/** GitHub profile + resume text → ranked org list (full list cached, UI pages through it). */
async function analyzeProfile(username, resume, { signal } = {}) {
  let githubProfile = null;
  let skills = [];
  if (username) {
    try {
      githubProfile = await analyzeGitHubUser(username, { signal });
    } catch (err) {
      if (err.name === 'AbortError') throw err;
      console.warn('GitHub Analysis Failed:', err);
      if (!resume) throw err; // only bubble up if there is no alternate data source
    }
  }
  if (resume) skills = extractSkills(resume);
  return getRecommendations(skills, githubProfile, Infinity);
}

export default function AiRecommender() {
  const [username, setUsername] = useState('');
  const [resume, setResume] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [recs, setRecs] = useState([]);
  const [visible, setVisible] = useState(PAGE_SIZE);

  const abortRef = useRef(null);
  const requestId = useRef(0);
  const fileRef = useRef(null);
  const showMoreRef = useRef(null);
  const resultsRef = useRef(null);
  const focusIndex = useRef(null);

  useEffect(() => () => abortRef.current?.abort(), []);

  // After "Show More", move focus to the button (or the first new card) like the original.
  useEffect(() => {
    if (focusIndex.current === null) return;
    const idx = focusIndex.current;
    focusIndex.current = null;
    if (showMoreRef.current) showMoreRef.current.focus();
    else {
      const card = resultsRef.current?.querySelectorAll('article[data-org-name]')[idx];
      (card?.querySelector('button') ?? card)?.focus();
    }
  }, [visible]);

  const onFile = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (file.size > MAX_RESUME_SIZE) {
      setRecs([]);
      setError(`File too large (${(file.size / 1024 / 1024).toFixed(1)}MB). Please upload a file under 5MB.`);
      e.target.value = '';
      return;
    }
    try {
      setResume(await file.text());
    } catch (err) {
      console.error('File Read Error:', err);
      setRecs([]);
      setError("Failed to read file. Please make sure it's a valid text format.");
    }
  };

  const run = async () => {
    const user = username.trim();
    const text = resume.trim();
    if (!user && !text) {
      setRecs([]);
      setError('Please provide either a GitHub username or resume text to get recommendations.');
      return;
    }
    abortRef.current?.abort();
    abortRef.current = new AbortController();
    const id = ++requestId.current;

    setError('');
    setRecs([]);
    setLoading(true);
    try {
      const result = await analyzeProfile(user, text, { signal: abortRef.current.signal });
      if (id !== requestId.current) return;
      if (!result || result.length === 0) {
        setError('Could not find any matching organizations based on your profile.');
      } else {
        setRecs(result);
        setVisible(PAGE_SIZE);
      }
    } catch (err) {
      if (id !== requestId.current || err.name === 'AbortError') return;
      setError(err.message || 'An unexpected error occurred during analysis.');
    } finally {
      if (id === requestId.current) setLoading(false);
    }
  };

  const showMore = () => {
    focusIndex.current = visible;
    setVisible((v) => Math.min(v + PAGE_SIZE, recs.length));
  };

  return (
    <section id="ai-recommender" className="px-6 max-w-7xl mx-auto py-20 border-t border-zinc-100 dark:border-zinc-800">
      <div className="mb-12">
        <span className="font-label text-xs font-bold uppercase tracking-[0.2em] text-primary-ink">AI-Powered</span>
        <h2 className="text-4xl md:text-5xl font-extrabold font-headline tracking-tighter mt-2">Personalized Org Suggestions</h2>
        <p className="text-zinc-600 dark:text-zinc-400 mt-4 max-w-2xl">
          Enter your GitHub username or paste your resume to get deterministic AI-style organization recommendations tailored to your skills and experience.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-4 bg-white dark:bg-[#0D0D0D] p-6 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-sm h-fit">
          <div className="space-y-5">
            <div>
              <label htmlFor="aiGhUsername" className="block text-sm font-bold text-zinc-900 dark:text-zinc-100 mb-1">GitHub Username</label>
              <div className="relative">
                <Icon name="person" className="absolute left-3 top-2.5 text-zinc-400 text-sm" />
                <input
                  type="text"
                  id="aiGhUsername"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="e.g. torvalds"
                  className="w-full pl-9 pr-4 py-2 bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 rounded-xl text-sm focus:ring-2 focus:ring-primary dark:text-white transition-all"
                />
              </div>
              <p className="text-[10px] text-zinc-500 mt-1 ml-1">Used to analyze your repo languages and activity.</p>
            </div>

            <div>
              <label htmlFor="aiResumeText" className="block text-sm font-bold text-zinc-900 dark:text-zinc-100 mb-1">Resume / Skills</label>
              <textarea
                id="aiResumeText"
                rows={4}
                value={resume}
                onChange={(e) => setResume(e.target.value)}
                placeholder="Paste your resume or list your skills here (e.g. Python, React, Machine Learning)..."
                className="w-full p-3 bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 rounded-xl text-sm focus:ring-2 focus:ring-primary dark:text-white transition-all resize-none"
              />
              <div className="mt-2 flex items-center justify-between">
                <label className="text-xs text-primary-ink font-bold cursor-pointer hover:underline flex items-center gap-1">
                  <Icon name="upload_file" className="text-[14px]" /> Upload .txt
                  <input ref={fileRef} type="file" id="aiResumeFile" accept=".txt" className="hidden" onChange={onFile} />
                </label>
              </div>
            </div>

            <button
              id="btnGetRecommendations"
              onClick={run}
              disabled={loading}
              className="w-full py-3 bg-gradient-to-r from-primary to-primary-container text-black rounded-xl font-bold text-sm shadow-md hover:shadow-lg hover:scale-[1.02] transition-all flex items-center justify-center gap-2"
            >
              {loading ? (
                <><Icon name="hourglass_empty" className="pulse-dot" /> Analyzing...</>
              ) : (
                <><Icon name="auto_awesome" className="text-sm" /> Get Recommendations</>
              )}
            </button>
          </div>
        </div>

        <div className="lg:col-span-8">
          {loading && (
            <div id="aiLoadingState" aria-live="polite" className="flex flex-col items-center justify-center py-16 bg-zinc-50 dark:bg-zinc-900/50 rounded-2xl border border-dashed border-zinc-300 dark:border-zinc-700">
              <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin mb-4" />
              <p className="text-zinc-600 dark:text-zinc-400 font-bold animate-pulse">Analyzing profile &amp; calculating matches...</p>
            </div>
          )}

          {error && !loading && (
            <div id="aiErrorState" aria-live="assertive" className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-2xl p-6 text-center block">
              <Icon name="error" className="text-red-500 text-4xl mb-2" />
              <h3 className="text-red-800 dark:text-red-400 font-bold mb-1">Analysis Failed</h3>
              <p id="aiErrorMsg" className="text-red-600 dark:text-red-300 text-sm">{error}</p>
            </div>
          )}

          <div id="aiResultsContainer" ref={resultsRef} className="org-grid w-full">
            {!loading && !error && recs.length === 0 && (
              <div className="flex flex-col items-center justify-center py-20 text-center text-zinc-400 dark:text-zinc-500">
                <Icon name="magic_button" className="text-6xl mb-4 opacity-50" />
                <p className="font-bold">Provide your details to see personalized matches.</p>
              </div>
            )}
            {recs.length > 0 && (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {recs.slice(0, visible).map((rec) => <RecommendationCard key={rec.org.name} rec={rec} />)}
                </div>
                {recs.length > visible && (
                  <div className="flex justify-center mt-6">
                    <button
                      ref={showMoreRef}
                      id="btnShowMoreRecs"
                      onClick={showMore}
                      aria-label="Show more recommendations"
                      className="px-5 py-2 rounded-full border border-zinc-200 dark:border-zinc-700 text-sm font-bold text-zinc-600 dark:text-zinc-300 hover:border-primary hover:text-primary-ink transition-colors"
                    >
                      Show More
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

function RecommendationCard({ rec }) {
  const { bookmarks, compareList, openOrg, toggleBookmark, toggleCompare } = useApp();
  const o = rec.org;
  const inCompare = compareList.includes(o.name);
  const isBookmarked = bookmarks.has(o.name);
  const stop = (fn) => (e) => { e.stopPropagation(); fn(o.name); };

  return (
    <article
      className={`group relative bg-white dark:bg-zinc-900 rounded-2xl p-6 border border-zinc-100 dark:border-zinc-800 transition-all hover:shadow-xl hover:border-primary/20 animate-fade-up cursor-pointer flex flex-col ${inCompare ? 'ring-2 ring-primary/30' : ''}`}
      data-org-name={o.name}
      tabIndex={-1}
      onClick={() => openOrg(o.name)}
      onKeyDown={(e) => {
        if ((e.key === 'Enter' || e.key === ' ') && e.target === e.currentTarget) {
          e.preventDefault();
          openOrg(o.name);
        }
      }}
    >
      <div className="absolute top-0 right-0 bg-neon text-black px-3 py-1.5 rounded-bl-2xl rounded-tr-2xl font-bold text-xs shadow-sm flex items-center gap-1 z-10">
        <Icon name="target" className="text-sm" /> {rec.score}% Match
      </div>
      <div className="flex justify-between items-start mb-4 pt-2">
        <div className="w-14 h-14 rounded-xl bg-surface-container-low dark:bg-zinc-800 flex items-center justify-center p-2 overflow-hidden">
          <OrgLogo org={o} initials="first" className="w-full h-full object-contain rounded-lg" placeholderClassName="font-headline bg-primary/5" />
        </div>
        <div className="flex items-center gap-2 mt-2">
          <button
            className={`bookmark-btn ${isBookmarked ? 'active text-orange-500' : 'text-zinc-300'}`}
            title={isBookmarked ? 'Remove bookmark' : 'Add bookmark'}
            onClick={stop(toggleBookmark)}
          >
            <Icon name="star" className="text-xl" fill={isBookmarked} />
          </button>
        </div>
      </div>
      <div className="flex-1">
        <h3 className="font-headline text-lg font-bold text-zinc-900 dark:text-zinc-100 mb-1 group-hover:text-primary-ink transition-colors">{o.name}</h3>
        <span className="category-tag inline-block mb-3">{(o.cat || 'Other').toUpperCase()}</span>
        <p className="text-zinc-600 dark:text-zinc-400 text-sm leading-relaxed mb-3 line-clamp-2">{o.desc || ''}</p>
        <div className="mt-3 pt-3 border-t border-zinc-100 dark:border-zinc-800">
          <ul className="space-y-1.5 mb-3">
            {rec.reasons.map((r) => (
              <li key={r} className="text-[11px] text-zinc-600 dark:text-zinc-400 flex items-start gap-2">
                <Icon name="check_circle" className="text-xs text-emerald-500 mt-0.5" /> <span className="leading-tight">{r}</span>
              </li>
            ))}
          </ul>
          {rec.matchedSkills.length > 0 && (
            <div className="mt-2 flex flex-wrap gap-1">
              {rec.matchedSkills.slice(0, 4).map((s) => (
                <span key={s} className="px-2 py-0.5 bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-400 rounded text-[9px] font-bold uppercase tracking-wider">{s}</span>
              ))}
            </div>
          )}
        </div>
      </div>
      <div className="flex items-center justify-between pt-4 mt-4 border-t border-zinc-100 dark:border-zinc-800">
        <button
          onClick={stop(toggleCompare)}
          className={`flex items-center gap-1 text-[10px] font-bold uppercase tracking-widest ${inCompare ? 'text-primary-ink' : 'text-zinc-400'} hover:text-primary-ink transition-colors`}
        >
          <Icon name={inCompare ? 'check_circle' : 'compare_arrows'} className="text-sm" /> {inCompare ? 'Comparing' : 'Compare'}
        </button>
        <button className="flex items-center gap-1 text-primary-ink font-bold text-xs uppercase tracking-widest group-hover:gap-2 transition-all">
          View <Icon name="arrow_forward" className="text-sm" />
        </button>
      </div>
    </article>
  );
}
