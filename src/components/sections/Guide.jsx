import { useState } from 'react';

/**
 * "New to GSoC? Start here." roadmap.
 * Markup is converted 1:1 from the original index.html; the accordion that used to be
 * driven by DOM class toggling (is-open / faq-open / inert) is now plain React state.
 * Only one block can be open at a time, and FAQs are reset whenever a block toggles.
 */
export default function Guide() {
  const [openBlock, setOpenBlock] = useState(null);
  const [openFaqs, setOpenFaqs] = useState(() => new Set());

  const toggleBlock = (index) => {
    setOpenFaqs(new Set());
    setOpenBlock((current) => (current === index ? null : index));
  };

  const toggleFaq = (key) => {
    setOpenFaqs((current) => {
      const next = new Set(current);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  };

  return (
    <section id="guide" className="py-20 px-6 max-w-7xl mx-auto">
      <div className="mb-12">
        <span className="font-label text-xs font-bold uppercase tracking-[0.2em] text-primary-ink">GSoC 101</span>
        <h2 className="text-4xl md:text-5xl font-extrabold font-headline tracking-tighter mt-2">New to GSoC? Start here.</h2>
        <p className="text-zinc-600 mt-4 max-w-2xl">An interactive roadmap — from understanding the program to landing your first acceptance. Click any block to expand its guide and FAQs.</p>
      </div>

      <div className="space-y-4" id="gsocRoadmap">

    
        <div className={`roadmap-block${openBlock === 0 ? ' is-open' : ''}`} data-block="0">
          <button className="roadmap-block-header" type="button" aria-expanded={openBlock === 0} aria-controls="roadmap-block-0" onClick={() => toggleBlock(0)}>
            <span className="roadmap-illus" aria-hidden="true" style={{ display: 'block' }}>
              <svg viewBox="0 0 56 56" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                <rect width="56" height="56" rx="16" fill="rgba(240,68,0,0.10)" />
                <rect x="4" y="21" width="14" height="14" rx="4" fill="#F04400" opacity="0.85" />
                <text x="11" y="31" textAnchor="middle" fontSize="6" fontWeight="800" fill="white">G</text>
                <rect x="21" y="21" width="14" height="14" rx="4" fill="#FF6A33" opacity="0.7" />
                <text x="28" y="30" textAnchor="middle" fontSize="5" fontWeight="800" fill="white">Org</text>
                <rect x="38" y="21" width="14" height="14" rx="4" fill="#FF9A6B" opacity="0.7" />
                <text x="45" y="30" textAnchor="middle" fontSize="5" fontWeight="800" fill="#6B1F00">You</text>
                <line x1="18" y1="28" x2="21" y2="28" stroke="#F04400" strokeWidth="1.5" strokeDasharray="2 1" />
                <line x1="35" y1="28" x2="38" y2="28" stroke="#F04400" strokeWidth="1.5" strokeDasharray="2 1" />
                <text x="28" y="46" textAnchor="middle" fontSize="4" fill="#a1a1aa">Stipend Flow</text>
              </svg>
            </span>
            <span className="flex-1 min-w-0" style={{ display: 'block' }}>
              <span className="flex items-center gap-3 mb-1" style={{ display: 'flex' }}>
                <span className="text-xs font-bold font-label uppercase tracking-widest text-primary-ink opacity-60">01</span>
                <span className="text-lg font-extrabold text-zinc-900 font-headline" style={{ display: 'block' }}>What is GSoC &amp; What's an Org?</span>
              </span>
              <span className="text-sm text-zinc-500" style={{ display: 'block' }}>The Google-backed ecosystem connecting contributors to open source foundations.</span>
            </span>
            <span className="material-symbols-outlined roadmap-chevron">expand_more</span>
          </button>
          <div className="roadmap-block-body" id="roadmap-block-0" inert="">
            <div className="roadmap-block-inner pt-6">
              <div className="mb-6">
                <div className="roadmap-step-row">
                  <div className="roadmap-step-num">1</div>
                  <p className="text-sm text-zinc-700 leading-relaxed"><strong>Not an internship at Google.</strong> You write code for independent open source foundations — Apache, Blender, Linux, TensorFlow. Google provides the stipend and the platform.</p>
                </div>
                <div className="roadmap-step-row">
                  <div className="roadmap-step-num">2</div>
                  <p className="text-sm text-zinc-700 leading-relaxed"><strong>Who is it for?</strong> Beginners and intermediate developers (18+) who are new to open source. No university enrollment required since 2022.</p>
                </div>
                <div className="roadmap-step-row">
                  <div className="roadmap-step-num">3</div>
                  <p className="text-sm text-zinc-700 leading-relaxed"><strong>The Mentors.</strong> Experienced community maintainers who volunteer to guide your project, review code, and evaluate your progress at midterm and final.</p>
                </div>
              </div>
              <div className="rounded-2xl bg-orange-50 border border-orange-100 p-4 mb-6 flex items-center justify-center gap-3 text-xs font-semibold text-zinc-600 flex-wrap">
                <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-orange-400 inline-block"></span>Google (Funds)</span>
                <span className="text-orange-300 font-bold">──►</span>
                <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-orange-300 inline-block"></span>Open Source Org (Mentors)</span>
                <span className="text-orange-300 font-bold">◄──►</span>
                <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-orange-200 inline-block"></span>You (Contributor)</span>
              </div>
              <div>
                <p className="text-xs font-bold uppercase tracking-widest text-zinc-400 mb-2">Common Questions</p>
                <div className={`roadmap-faq-item${openFaqs.has('0-0') ? ' faq-open' : ''}`}>
                  <button className="roadmap-faq-trigger" aria-expanded={openFaqs.has('0-0')} onClick={() => toggleFaq('0-0')}><span className="text-xs font-semibold text-zinc-800">Do I have to be an enrolled university student?</span><span className="material-symbols-outlined roadmap-faq-chevron">expand_more</span></button>
                  <div className="roadmap-faq-answer" inert=""><p className="text-xs text-zinc-500 pb-3 leading-relaxed">No. Since 2022, GSoC is open to anyone 18+ who is a newcomer or beginner to open source software development.</p></div>
                </div>
                <div className={`roadmap-faq-item${openFaqs.has('0-1') ? ' faq-open' : ''}`}>
                  <button className="roadmap-faq-trigger" aria-expanded={openFaqs.has('0-1')} onClick={() => toggleFaq('0-1')}><span className="text-xs font-semibold text-zinc-800">Does Google choose which applicants get accepted?</span><span className="material-symbols-outlined roadmap-faq-chevron">expand_more</span></button>
                  <div className="roadmap-faq-answer" inert=""><p className="text-xs text-zinc-500 pb-3 leading-relaxed">No. The participating organizations and their mentors evaluate applications and select contributors based on proposal quality and prior contributions.</p></div>
                </div>
                <div className={`roadmap-faq-item${openFaqs.has('0-2') ? ' faq-open' : ''}`}>
                  <button className="roadmap-faq-trigger" aria-expanded={openFaqs.has('0-2')} onClick={() => toggleFaq('0-2')}><span className="text-xs font-semibold text-zinc-800">Can I apply if I live outside the US?</span><span className="material-symbols-outlined roadmap-faq-chevron">expand_more</span></button>
                  <div className="roadmap-faq-answer" inert=""><p className="text-xs text-zinc-500 pb-3 leading-relaxed">Yes. GSoC is completely global and remote, open to contributors across 100+ eligible countries.</p></div>
                </div>
              </div>
            </div>
          </div>
        </div>

    
        <div className={`roadmap-block${openBlock === 1 ? ' is-open' : ''}`} data-block="1">
          <button className="roadmap-block-header" type="button" aria-expanded={openBlock === 1} aria-controls="roadmap-block-1" onClick={() => toggleBlock(1)}>
            <span className="roadmap-illus" aria-hidden="true" style={{ display: 'block' }}>
              <svg viewBox="0 0 56 56" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                <rect width="56" height="56" rx="16" fill="rgba(59,130,246,0.10)" />
                <rect x="6" y="10" width="18" height="8" rx="4" fill="#3b82f6" opacity="0.75" />
                <text x="15" y="16" textAnchor="middle" fontSize="4.5" fontWeight="700" fill="white">Python</text>
                <rect x="27" y="10" width="23" height="8" rx="4" fill="#60a5fa" opacity="0.65" />
                <text x="38.5" y="16" textAnchor="middle" fontSize="4.5" fontWeight="700" fill="white">Moderate</text>
                <rect x="6" y="23" width="44" height="8" rx="3" fill="#eff6ff" stroke="#bfdbfe" strokeWidth="1" />
                <circle cx="13" cy="27" r="3.5" fill="#3b82f6" opacity="0.5" />
                <rect x="19" y="25" width="15" height="2" rx="1" fill="#93c5fd" />
                <rect x="19" y="28.5" width="9" height="1.5" rx="0.75" fill="#bfdbfe" />
                <rect x="6" y="35" width="44" height="8" rx="3" fill="#eff6ff" stroke="#bfdbfe" strokeWidth="1" />
                <circle cx="13" cy="39" r="3.5" fill="#60a5fa" opacity="0.5" />
                <rect x="19" y="37" width="20" height="2" rx="1" fill="#93c5fd" />
                <rect x="19" y="40.5" width="12" height="1.5" rx="0.75" fill="#bfdbfe" />
              </svg>
            </span>
            <span className="flex-1 min-w-0" style={{ display: 'block' }}>
              <span className="flex items-center gap-3 mb-1" style={{ display: 'flex' }}>
                <span className="text-xs font-bold font-label uppercase tracking-widest text-blue-500 opacity-70">02</span>
                <span className="text-lg font-extrabold text-zinc-900 font-headline" style={{ display: 'block' }}>Explore &amp; Choose Your Match</span>
              </span>
              <span className="text-sm text-zinc-500" style={{ display: 'block' }}>Navigating 180+ orgs to find the highest-probability fit for your skills.</span>
            </span>
            <span className="material-symbols-outlined roadmap-chevron">expand_more</span>
          </button>
          <div className="roadmap-block-body" id="roadmap-block-1" inert="">
            <div className="roadmap-block-inner pt-6">
              <div className="mb-6">
                <div className="roadmap-step-row">
                  <div className="roadmap-step-num" style={{ background: 'rgba(59,130,246,0.12)', color: '#3b82f6' }}>1</div>
                  <p className="text-sm text-zinc-700 leading-relaxed"><strong>The Rule of 2.</strong> Don't spread across 10 orgs. Pick 1–2 and engage deeply. Google allows up to 3 proposals, but focused effort wins every time.</p>
                </div>
                <div className="roadmap-step-row">
                  <div className="roadmap-step-num" style={{ background: 'rgba(59,130,246,0.12)', color: '#3b82f6' }}>2</div>
                  <p className="text-sm text-zinc-700 leading-relaxed"><strong>Competition Check.</strong> Ultra-popular orgs get hundreds of proposals. Exploring "Moderate" or "Newcomer-friendly" orgs drastically increases your acceptance odds.</p>
                </div>
                <div className="roadmap-step-row">
                  <div className="roadmap-step-num" style={{ background: 'rgba(59,130,246,0.12)', color: '#3b82f6' }}>3</div>
                  <p className="text-sm text-zinc-700 leading-relaxed"><strong>Stack Matching.</strong> Use FindMyGSoC's language, domain, and AI Recommender filters to surface orgs that align with what you already know or can quickly ramp up on.</p>
                </div>
              </div>
              <div className="rounded-2xl bg-blue-50 border border-blue-100 p-4 mb-6 flex flex-wrap gap-2">
                <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-blue-100 text-blue-700 text-xs font-semibold"><span className="material-symbols-outlined text-sm">code</span>Python / JS</span>
                <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-blue-100 text-blue-700 text-xs font-semibold"><span className="material-symbols-outlined text-sm">bar_chart</span>Moderate</span>
                <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-blue-100 text-blue-700 text-xs font-semibold"><span className="material-symbols-outlined text-sm">bug_report</span>Good First Issues</span>
              </div>
              <div>
                <p className="text-xs font-bold uppercase tracking-widest text-zinc-400 mb-2">Common Questions</p>
                <div className={`roadmap-faq-item${openFaqs.has('1-0') ? ' faq-open' : ''}`}>
                  <button className="roadmap-faq-trigger" aria-expanded={openFaqs.has('1-0')} onClick={() => toggleFaq('1-0')}><span className="text-xs font-semibold text-zinc-800">How many proposals am I allowed to submit?</span><span className="material-symbols-outlined roadmap-faq-chevron">expand_more</span></button>
                  <div className="roadmap-faq-answer" inert=""><p className="text-xs text-zinc-500 pb-3 leading-relaxed">Google allows up to 3 total proposals across all organizations. Focusing high effort on 1–2 consistently produces better results than spreading thin.</p></div>
                </div>
                <div className={`roadmap-faq-item${openFaqs.has('1-1') ? ' faq-open' : ''}`}>
                  <button className="roadmap-faq-trigger" aria-expanded={openFaqs.has('1-1')} onClick={() => toggleFaq('1-1')}><span className="text-xs font-semibold text-zinc-800">What if an org has been in GSoC for 15+ years?</span><span className="material-symbols-outlined roadmap-faq-chevron">expand_more</span></button>
                  <div className="roadmap-faq-answer" inert=""><p className="text-xs text-zinc-500 pb-3 leading-relaxed">Veteran orgs have structured mentorship but extremely high competition. Newer orgs often have fewer applicants and more personal mentor interaction.</p></div>
                </div>
                <div className={`roadmap-faq-item${openFaqs.has('1-2') ? ' faq-open' : ''}`}>
                  <button className="roadmap-faq-trigger" aria-expanded={openFaqs.has('1-2')} onClick={() => toggleFaq('1-2')}><span className="text-xs font-semibold text-zinc-800">How does the AI Recommender help?</span><span className="material-symbols-outlined roadmap-faq-chevron">expand_more</span></button>
                  <div className="roadmap-faq-answer" inert=""><p className="text-xs text-zinc-500 pb-3 leading-relaxed">It matches your GitHub profile or pasted resume directly against the tech stacks and project history of all 184 orgs in our index to compute a match score.</p></div>
                </div>
              </div>
            </div>
          </div>
        </div>

    
        <div className={`roadmap-block${openBlock === 2 ? ' is-open' : ''}`} data-block="2">
          <button className="roadmap-block-header" type="button" aria-expanded={openBlock === 2} aria-controls="roadmap-block-2" onClick={() => toggleBlock(2)}>
            <span className="roadmap-illus" aria-hidden="true" style={{ display: 'block' }}>
              <svg viewBox="0 0 56 56" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                <rect width="56" height="56" rx="16" fill="rgba(208,240,48,0.10)" />
                <rect x="3" y="23" width="11" height="10" rx="3" fill="#A9CA00" opacity="0.8" />
                <text x="8.5" y="30" textAnchor="middle" fontSize="3.8" fontWeight="700" fill="white">Fork</text>
                <line x1="14" y1="28" x2="18" y2="28" stroke="#A9CA00" strokeWidth="1.5" strokeDasharray="1.5 1" />
                <polygon points="18,26.5 21,28 18,29.5" fill="#A9CA00" />
                <rect x="21" y="23" width="12" height="10" rx="3" fill="#D0F030" opacity="0.75" />
                <text x="27" y="30" textAnchor="middle" fontSize="3.8" fontWeight="700" fill="white">Issue</text>
                <line x1="33" y1="28" x2="37" y2="28" stroke="#A9CA00" strokeWidth="1.5" strokeDasharray="1.5 1" />
                <polygon points="37,26.5 40,28 37,29.5" fill="#A9CA00" />
                <rect x="40" y="23" width="13" height="10" rx="3" fill="#E1F58A" opacity="0.75" />
                <text x="46.5" y="30" textAnchor="middle" fontSize="3.8" fontWeight="700" fill="#283500">PR ✓</text>
                <circle cx="45" cy="12" r="6" fill="#A9CA00" />
                <path d="M42.5 12l2 2 4-4" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </span>
            <span className="flex-1 min-w-0" style={{ display: 'block' }}>
              <span className="flex items-center gap-3 mb-1" style={{ display: 'flex' }}>
                <span className="text-xs font-bold font-label uppercase tracking-widest text-green-600 opacity-70">03</span>
                <span className="text-lg font-extrabold text-zinc-900 font-headline" style={{ display: 'block' }}>How to Contribute</span>
              </span>
              <span className="text-sm text-zinc-500" style={{ display: 'block' }}>From setup to your first merged pull request — with community etiquette.</span>
            </span>
            <span className="material-symbols-outlined roadmap-chevron">expand_more</span>
          </button>
          <div className="roadmap-block-body" id="roadmap-block-2" inert="">
            <div className="roadmap-block-inner pt-6">
              <div className="mb-6">
                <div className="roadmap-step-row">
                  <div className="roadmap-step-num" style={{ background: 'rgba(208,240,48,0.12)', color: '#4A6400' }}>1</div>
                  <p className="text-sm text-zinc-700 leading-relaxed"><strong>Find the Right Task.</strong> Search for <code className="text-xs bg-zinc-100 px-1 py-0.5 rounded font-mono">good first issue</code> or documentation fixes. Always comment on the issue <em>before</em> writing code to claim it.</p>
                </div>
                <div className="roadmap-step-row">
                  <div className="roadmap-step-num" style={{ background: 'rgba(208,240,48,0.12)', color: '#4A6400' }}>2</div>
                  <p className="text-sm text-zinc-700 leading-relaxed"><strong>Public Channels First.</strong> Join the org's Discord, Zulip, Slack, or IRC. Introduce yourself briefly with your tech stack and the issue you're eyeing.</p>
                </div>
                <div className="roadmap-step-row">
                  <div className="roadmap-step-num" style={{ background: 'rgba(208,240,48,0.12)', color: '#4A6400' }}>3</div>
                  <p className="text-sm text-zinc-700 leading-relaxed"><strong>Golden Rule of PRs.</strong> Keep PRs atomic — one fix at a time. Add tests, link the issue, and avoid unsolicited "sir give me task" messages.</p>
                </div>
              </div>
              <div className="rounded-2xl bg-green-50 border border-green-100 p-4 mb-6 flex items-center justify-center gap-2 text-xs font-semibold text-zinc-600 flex-wrap">
                <span>Fork &amp; Clone</span><span className="text-green-500 font-bold">──►</span>
                <span>Issue Discussion</span><span className="text-green-500 font-bold">──►</span>
                <span>Atomic PR</span><span className="text-green-500 font-bold">──►</span>
                <span className="text-green-700">Mentor Review ✓</span>
              </div>
              <div>
                <p className="text-xs font-bold uppercase tracking-widest text-zinc-400 mb-2">Common Questions</p>
                <div className={`roadmap-faq-item${openFaqs.has('2-0') ? ' faq-open' : ''}`}>
                  <button className="roadmap-faq-trigger" aria-expanded={openFaqs.has('2-0')} onClick={() => toggleFaq('2-0')}><span className="text-xs font-semibold text-zinc-800">Do I need contributions before the application opens?</span><span className="material-symbols-outlined roadmap-faq-chevron">expand_more</span></button>
                  <div className="roadmap-faq-answer" inert=""><p className="text-xs text-zinc-500 pb-3 leading-relaxed">Yes. Having 1–3 merged or well-reviewed PRs demonstrates to mentors that you can run the codebase, communicate effectively, and produce working code.</p></div>
                </div>
                <div className={`roadmap-faq-item${openFaqs.has('2-1') ? ' faq-open' : ''}`}>
                  <button className="roadmap-faq-trigger" aria-expanded={openFaqs.has('2-1')} onClick={() => toggleFaq('2-1')}><span className="text-xs font-semibold text-zinc-800">What if mentors take days to review my PR?</span><span className="material-symbols-outlined roadmap-faq-chevron">expand_more</span></button>
                  <div className="roadmap-faq-answer" inert=""><p className="text-xs text-zinc-500 pb-3 leading-relaxed">Mentors are volunteers with day jobs. Wait 3–4 days before leaving a polite follow-up comment in the PR thread on the public channel.</p></div>
                </div>
                <div className={`roadmap-faq-item${openFaqs.has('2-2') ? ' faq-open' : ''}`}>
                  <button className="roadmap-faq-trigger" aria-expanded={openFaqs.has('2-2')} onClick={() => toggleFaq('2-2')}><span className="text-xs font-semibold text-zinc-800">What if another contributor claims the issue I wanted?</span><span className="material-symbols-outlined roadmap-faq-chevron">expand_more</span></button>
                  <div className="roadmap-faq-answer" inert=""><p className="text-xs text-zinc-500 pb-3 leading-relaxed">Always comment first asking to be assigned before writing code. If taken, browse alternative unassigned issues — orgs usually have many open good-first-issues.</p></div>
                </div>
              </div>
            </div>
          </div>
        </div>

    
        <div className={`roadmap-block${openBlock === 3 ? ' is-open' : ''}`} data-block="3">
          <button className="roadmap-block-header" type="button" aria-expanded={openBlock === 3} aria-controls="roadmap-block-3" onClick={() => toggleBlock(3)}>
            <span className="roadmap-illus" aria-hidden="true" style={{ display: 'block' }}>
              <svg viewBox="0 0 56 56" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                <rect width="56" height="56" rx="16" fill="rgba(168,85,247,0.10)" />
                <circle cx="17" cy="19" r="2.5" fill="#a855f7" opacity="0.8" />
                <path d="M15.8 19l1 1 2-2" stroke="white" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" />
                <rect x="21" y="18" width="13" height="2" rx="1" fill="#e9d5ff" />
                <circle cx="17" cy="27" r="2.5" fill="#a855f7" opacity="0.8" />
                <path d="M15.8 27l1 1 2-2" stroke="white" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" />
                <rect x="21" y="26" width="10" height="2" rx="1" fill="#e9d5ff" />
                <circle cx="17" cy="35" r="2.5" fill="#d8b4fe" opacity="0.5" />
                <rect x="21" y="34" width="15" height="2" rx="1" fill="#f3e8ff" />
                <circle cx="43" cy="13" r="7" fill="#a855f7" />
                <text x="43" y="17" textAnchor="middle" fontSize="10" fill="white">★</text>
              </svg>
            </span>
            <span className="flex-1 min-w-0" style={{ display: 'block' }}>
              <span className="flex items-center gap-3 mb-1" style={{ display: 'flex' }}>
                <span className="text-xs font-bold font-label uppercase tracking-widest text-purple-500 opacity-70">04</span>
                <span className="text-lg font-extrabold text-zinc-900 font-headline" style={{ display: 'block' }}>Crafting a Winning Proposal</span>
              </span>
              <span className="text-sm text-zinc-500" style={{ display: 'block' }}>Structuring your project plan, deliverables, and timeline to convince mentors.</span>
            </span>
            <span className="material-symbols-outlined roadmap-chevron">expand_more</span>
          </button>
          <div className="roadmap-block-body" id="roadmap-block-3" inert="">
            <div className="roadmap-block-inner pt-6">
              <div className="mb-6">
                <div className="roadmap-step-row">
                  <div className="roadmap-step-num" style={{ background: 'rgba(168,85,247,0.12)', color: '#9333ea' }}>1</div>
                  <p className="text-sm text-zinc-700 leading-relaxed"><strong>4 Core Elements.</strong> Problem Scope, Technical Approach, weekly Milestone Timeline with explicit deliverables, and your Profile with relevant prior PRs in that org.</p>
                </div>
                <div className="roadmap-step-row">
                  <div className="roadmap-step-num" style={{ background: 'rgba(168,85,247,0.12)', color: '#9333ea' }}>2</div>
                  <p className="text-sm text-zinc-700 leading-relaxed"><strong>Build in Buffers.</strong> Budget 1–2 weeks for exams, unexpected bugs, and documentation. Mentors trust realistic timelines over overly ambitious ones.</p>
                </div>
                <div className="roadmap-step-row">
                  <div className="roadmap-step-num" style={{ background: 'rgba(168,85,247,0.12)', color: '#9333ea' }}>3</div>
                  <p className="text-sm text-zinc-700 leading-relaxed"><strong>Pre-submission Review.</strong> Share a draft with your mentor at least 1–2 weeks before Google's deadline to get early, constructive feedback.</p>
                </div>
              </div>
              <div className="rounded-2xl bg-purple-50 border border-purple-100 p-4 mb-6 grid grid-cols-2 gap-2 text-xs font-semibold text-zinc-600">
                <span className="flex items-center gap-1.5"><span className="text-purple-500 material-symbols-outlined text-sm">check_circle</span>Problem Scope</span>
                <span className="flex items-center gap-1.5"><span className="text-purple-500 material-symbols-outlined text-sm">check_circle</span>Weekly Milestones</span>
                <span className="flex items-center gap-1.5"><span className="text-purple-500 material-symbols-outlined text-sm">check_circle</span>1-Week Buffer</span>
                <span className="flex items-center gap-1.5"><span className="text-purple-500 material-symbols-outlined text-sm">check_circle</span>Proof of Setup</span>
              </div>
              <div>
                <p className="text-xs font-bold uppercase tracking-widest text-zinc-400 mb-2">Common Questions</p>
                <div className={`roadmap-faq-item${openFaqs.has('3-0') ? ' faq-open' : ''}`}>
                  <button className="roadmap-faq-trigger" aria-expanded={openFaqs.has('3-0')} onClick={() => toggleFaq('3-0')}><span className="text-xs font-semibold text-zinc-800">Where do I draft my proposal?</span><span className="material-symbols-outlined roadmap-faq-chevron">expand_more</span></button>
                  <div className="roadmap-faq-answer" inert=""><p className="text-xs text-zinc-500 pb-3 leading-relaxed">Use FindMyGSoC's built-in Markdown Editor to draft, preview, and export your proposal to PDF or Markdown — all stored locally in your browser.</p></div>
                </div>
                <div className={`roadmap-faq-item${openFaqs.has('3-1') ? ' faq-open' : ''}`}>
                  <button className="roadmap-faq-trigger" aria-expanded={openFaqs.has('3-1')} onClick={() => toggleFaq('3-1')}><span className="text-xs font-semibold text-zinc-800">Can I propose a brand new idea not on the org's ideas list?</span><span className="material-symbols-outlined roadmap-faq-chevron">expand_more</span></button>
                  <div className="roadmap-faq-answer" inert=""><p className="text-xs text-zinc-500 pb-3 leading-relaxed">Yes, but validate it with mentors first. Org-listed ideas typically have higher mentor availability and clearer evaluation criteria.</p></div>
                </div>
                <div className={`roadmap-faq-item${openFaqs.has('3-2') ? ' faq-open' : ''}`}>
                  <button className="roadmap-faq-trigger" aria-expanded={openFaqs.has('3-2')} onClick={() => toggleFaq('3-2')}><span className="text-xs font-semibold text-zinc-800">Can mentors guarantee my acceptance?</span><span className="material-symbols-outlined roadmap-faq-chevron">expand_more</span></button>
                  <div className="roadmap-faq-answer" inert=""><p className="text-xs text-zinc-500 pb-3 leading-relaxed">No. Final selections depend on the number of contributor slots Google grants to each org — mentor enthusiasm alone doesn't guarantee a slot.</p></div>
                </div>
              </div>
            </div>
          </div>
        </div>

    
        <div className={`roadmap-block${openBlock === 4 ? ' is-open' : ''}`} data-block="4">
          <button className="roadmap-block-header" type="button" aria-expanded={openBlock === 4} aria-controls="roadmap-block-4" onClick={() => toggleBlock(4)}>
            <span className="roadmap-illus" aria-hidden="true" style={{ display: 'block' }}>
              <svg viewBox="0 0 56 56" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                <rect width="56" height="56" rx="16" fill="rgba(255,217,26,0.10)" />
                <rect x="6" y="26" width="44" height="6" rx="3" fill="#FFF6B8" />
                <rect x="6" y="26" width="20" height="6" rx="3" fill="#FFD91A" opacity="0.85" />
                <rect x="26" y="26" width="24" height="6" rx="3" fill="#FFD91A" opacity="0.5" />
                <line x1="26" y1="20" x2="26" y2="34" stroke="#A88400" strokeWidth="1" strokeDasharray="2 1" />
                <text x="26" y="18" textAnchor="middle" fontSize="4.5" fontWeight="700" fill="#A88400">45%</text>
                <circle cx="50" cy="29" r="5" fill="#FFD91A" />
                <text x="50" y="31.5" textAnchor="middle" fontSize="5.5" fontWeight="800" fill="white">$</text>
                <text x="8" y="41" fontSize="4" fill="#a1a1aa">Midterm</text>
                <text x="33" y="41" fontSize="4" fill="#a1a1aa">Final Eval</text>
              </svg>
            </span>
            <span className="flex-1 min-w-0" style={{ display: 'block' }}>
              <span className="flex items-center gap-3 mb-1" style={{ display: 'flex' }}>
                <span className="text-xs font-bold font-label uppercase tracking-widest text-yellow-600 opacity-70">05</span>
                <span className="text-lg font-extrabold text-zinc-900 font-headline" style={{ display: 'block' }}>Stipends, Timeline &amp; Coding Period</span>
              </span>
              <span className="text-sm text-zinc-500" style={{ display: 'block' }}>Payout tiers, milestone evaluations, and completing your summer project.</span>
            </span>
            <span className="material-symbols-outlined roadmap-chevron">expand_more</span>
          </button>
          <div className="roadmap-block-body" id="roadmap-block-4" inert="">
            <div className="roadmap-block-inner pt-6">
              <div className="mb-6">
                <div className="roadmap-step-row">
                  <div className="roadmap-step-num" style={{ background: 'rgba(255,217,26,0.15)', color: '#A88400' }}>1</div>
                  <p className="text-sm text-zinc-700 leading-relaxed"><strong>Project Sizes.</strong> Small (~90 hrs / 8 wks), Medium (~175 hrs / 12 wks), Large (~350 hrs / 22 wks). Pick the size that honestly fits your weekly schedule.</p>
                </div>
                <div className="roadmap-step-row">
                  <div className="roadmap-step-num" style={{ background: 'rgba(255,217,26,0.15)', color: '#A88400' }}>2</div>
                  <p className="text-sm text-zinc-700 leading-relaxed"><strong>Stipend Range.</strong> $1,500–$6,600 USD, adjusted by Google's Purchasing Power Parity (PPP) formula for your country. Paid in two phases via Payoneer.</p>
                </div>
                <div className="roadmap-step-row">
                  <div className="roadmap-step-num" style={{ background: 'rgba(255,217,26,0.15)', color: '#A88400' }}>3</div>
                  <p className="text-sm text-zinc-700 leading-relaxed"><strong>Evaluations.</strong> Two checkpoints — Midterm and Final. Pass both to receive your stipend. Mentors evaluate code quality, progress, and communication.</p>
                </div>
              </div>
              <div className="rounded-2xl bg-yellow-50 border border-yellow-100 p-4 mb-6 space-y-3">
                <p className="text-xs font-semibold text-zinc-500">Stipend disbursement</p>
                <div className="flex items-center gap-3">
                  <div className="w-16 flex-none text-xs font-bold text-yellow-700">Midterm</div>
                  <div className="flex-1 h-4 rounded-full bg-yellow-100 overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-yellow-400 to-yellow-500 rounded-full" style={{ width: '45%' }}></div>
                  </div>
                  <div className="w-8 flex-none text-xs font-bold text-yellow-700 text-right">45%</div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-16 flex-none text-xs font-bold text-yellow-700">Final</div>
                  <div className="flex-1 h-4 rounded-full bg-yellow-100 overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-yellow-500 to-orange-400 rounded-full" style={{ width: '55%' }}></div>
                  </div>
                  <div className="w-8 flex-none text-xs font-bold text-yellow-700 text-right">55%</div>
                </div>
              </div>
              <div>
                <p className="text-xs font-bold uppercase tracking-widest text-zinc-400 mb-2">Common Questions</p>
                <div className={`roadmap-faq-item${openFaqs.has('4-0') ? ' faq-open' : ''}`}>
                  <button className="roadmap-faq-trigger" aria-expanded={openFaqs.has('4-0')} onClick={() => toggleFaq('4-0')}><span className="text-xs font-semibold text-zinc-800">When and how do I receive the stipend?</span><span className="material-symbols-outlined roadmap-faq-chevron">expand_more</span></button>
                  <div className="roadmap-faq-answer" inert=""><p className="text-xs text-zinc-500 pb-3 leading-relaxed">Payments are processed through Payoneer: 45% after passing the midterm, and 55% after passing the final evaluation.</p></div>
                </div>
                <div className={`roadmap-faq-item${openFaqs.has('4-1') ? ' faq-open' : ''}`}>
                  <button className="roadmap-faq-trigger" aria-expanded={openFaqs.has('4-1')} onClick={() => toggleFaq('4-1')}><span className="text-xs font-semibold text-zinc-800">Can I do GSoC while taking college classes?</span><span className="material-symbols-outlined roadmap-faq-chevron">expand_more</span></button>
                  <div className="roadmap-faq-answer" inert=""><p className="text-xs text-zinc-500 pb-3 leading-relaxed">Yes. Many contributors manage both. Choose a Small (90h) or Medium (175h) project if your academic workload is high to avoid burnout.</p></div>
                </div>
                <div className={`roadmap-faq-item${openFaqs.has('4-2') ? ' faq-open' : ''}`}>
                  <button className="roadmap-faq-trigger" aria-expanded={openFaqs.has('4-2')} onClick={() => toggleFaq('4-2')}><span className="text-xs font-semibold text-zinc-800">What happens if I fail the midterm evaluation?</span><span className="material-symbols-outlined roadmap-faq-chevron">expand_more</span></button>
                  <div className="roadmap-faq-answer" inert=""><p className="text-xs text-zinc-500 pb-3 leading-relaxed">The project stops and the remaining 55% stipend is not disbursed. You retain the experience and any prior community recognition from your work.</p></div>
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>

  
      <div className="mt-10 pt-8 border-t border-zinc-100">
        <p className="text-xs font-bold uppercase tracking-widest text-zinc-400 mb-4">Useful Resources</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 text-sm">
          <a href="https://opensource.guide/how-to-contribute/" target="_blank" rel="noopener noreferrer" className="block p-4 rounded-2xl border border-zinc-200 hover:border-primary hover:bg-orange-50 transition-colors">
            <p className="font-bold mb-1 text-zinc-900">Open Source Guide</p>
            <p className="text-zinc-500 text-xs">Practical guide for first-time and returning contributors.</p>
          </a>
          <a href="https://docs.github.com/en/get-started/exploring-projects-on-github/contributing-to-a-project" target="_blank" rel="noopener noreferrer" className="block p-4 rounded-2xl border border-zinc-200 hover:border-primary hover:bg-orange-50 transition-colors">
            <p className="font-bold mb-1 text-zinc-900">GitHub Contribution Flow</p>
            <p className="text-zinc-500 text-xs">Official docs for forking, cloning, and opening pull requests.</p>
          </a>
          <a href="https://developers.google.com/open-source/gsoc/resources/guide" target="_blank" rel="noopener noreferrer" className="block p-4 rounded-2xl border border-zinc-200 hover:border-primary hover:bg-orange-50 transition-colors">
            <p className="font-bold mb-1 text-zinc-900">GSoC Contributor/Student Guide</p>
            <p className="text-zinc-500 text-xs">Official program timeline and best practices for applicants.</p>
          </a>
          <a href="https://developers.google.com/open-source/gsoc/help/student-advice" target="_blank" rel="noopener noreferrer" className="block p-4 rounded-2xl border border-zinc-200 hover:border-primary hover:bg-orange-50 transition-colors">
            <p className="font-bold mb-1 text-zinc-900">Student Advice</p>
            <p className="text-zinc-500 text-xs">Official guidance for choosing orgs, communicating well, and writing proposals.</p>
          </a>
          <a href="https://firstcontributions.github.io/" target="_blank" rel="noopener noreferrer" className="block p-4 rounded-2xl border border-zinc-200 hover:border-primary hover:bg-orange-50 transition-colors">
            <p className="font-bold mb-1 text-zinc-900">First Contributions</p>
            <p className="text-zinc-500 text-xs">Hands-on tutorial to practice your first fork, commit, and pull request.</p>
          </a>
        </div>
      </div>
    </section>

  );
}
