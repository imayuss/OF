import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { ORGS } from '../../data/orgs';

/** Footer (was src/components/footer.html, fetched at runtime by src/js/footer.js). */
export default function Footer() {
  const counts = useMemo(
    () => ({
      total: ORGS.length,
      veterans: ORGS.filter((o) => o.years >= 10).length,
      newcomers: ORGS.filter((o) => o.years <= 3).length,
    }),
    [],
  );

  return (
    <footer className="w-full premium-footer pt-12 px-6 sm:px-8">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 mb-12">

        <div className="lg:col-span-2 flex flex-col gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-primary-container flex items-center justify-center shadow-lg shadow-orange-500/20">
              <span className="text-black font-extrabold text-xl font-headline">OF</span>
            </div>
            <span className="text-2xl font-extrabold font-headline tracking-tight text-zinc-900 dark:text-zinc-50">OrgFinder</span>
          </div>
          <p className="text-sm text-zinc-500 dark:text-zinc-400 leading-relaxed max-w-sm">
            Discover various oss programs organizations, search beginner-friendly issues and compare programs in real
            time.
          </p>
          <p className="text-xs text-zinc-400 dark:text-zinc-500 italic max-w-sm">
            Built by developers, for developers, to empower the next generation of open source contributors.
          </p>
        </div>


        <div>
          <h3 className="text-xs font-bold uppercase tracking-widest text-zinc-900 dark:text-zinc-100 mb-4 font-headline">Quick
            Links</h3>
          <nav className="flex flex-col gap-3" aria-label="Footer navigation">
            <a className="footer-link text-sm text-zinc-600 hover:text-primary-ink dark:text-zinc-300 dark:hover:text-primary-ink transition-all flex items-center gap-1.5" href="#orgs">
              <span className="material-symbols-outlined text-base">groups</span> Organizations
            </a>
            <a className="footer-link text-sm text-zinc-600 hover:text-primary-ink dark:text-zinc-300 dark:hover:text-primary-ink transition-all flex items-center gap-1.5" href="#timeline">
              <span className="material-symbols-outlined text-base">schedule</span> Timeline
            </a>
            <a className="footer-link text-sm text-zinc-600 hover:text-primary-ink dark:text-zinc-300 dark:hover:text-primary-ink transition-all flex items-center gap-1.5" href="https://github.com/S3DFX-CYBER/GSoC-Org-Finder-">
              <span className="material-symbols-outlined text-base">menu_book</span> Resources
            </a>
            <a className="footer-link text-sm text-zinc-600 hover:text-primary-ink dark:text-zinc-300 dark:hover:text-primary-ink transition-all flex items-center gap-1.5" href="https://github.com/S3DFX-CYBER/GSoC-Org-Finder-/blob/main/CONTRIBUTING.md">
              <span className="material-symbols-outlined text-base">volunteer_activism</span> Contributing
            </a>
            <a className="footer-link text-sm text-zinc-600 hover:text-primary-ink dark:text-zinc-300 dark:hover:text-primary-ink transition-all flex items-center gap-1.5" href="https://discord.gg/jYrbHKtn8t" target="_blank" rel="noopener noreferrer">
              <span className="material-symbols-outlined text-base">forum</span> Community
            </a>
          </nav>
        </div>


        <div>
          <h3 className="text-xs font-bold uppercase tracking-widest text-zinc-900 dark:text-zinc-100 mb-4 font-headline">
            Programs</h3>
          <nav className="flex flex-col gap-3" aria-label="Open source programs navigation">
            <a className="footer-link text-sm text-zinc-600 hover:text-primary-ink dark:text-zinc-300 dark:hover:text-primary-ink transition-all" href="https://summerofcode.withgoogle.com/" target="_blank" rel="noopener noreferrer">GSoC</a>
            <a className="footer-link text-sm text-zinc-600 hover:text-primary-ink dark:text-zinc-300 dark:hover:text-primary-ink transition-all" href="https://www.outreachy.org/" target="_blank" rel="noopener noreferrer">Outreachy</a>
            <a className="footer-link text-sm text-zinc-600 hover:text-primary-ink dark:text-zinc-300 dark:hover:text-primary-ink transition-all" href="https://lfx.linuxfoundation.org" target="_blank" rel="noopener noreferrer">LFX Mentorship</a>
            <a className="footer-link text-sm text-zinc-600 hover:text-primary-ink dark:text-zinc-300 dark:hover:text-primary-ink transition-all" href="https://www.summerofbitcoin.org/" target="_blank" rel="noopener noreferrer">Summer of Bitcoin</a>
            <a className="footer-link text-sm text-zinc-600 hover:text-primary-ink dark:text-zinc-300 dark:hover:text-primary-ink transition-all" href="https://gssoc.girlscript.org/" target="_blank" rel="noopener noreferrer">GSSoC</a>
            <a className="footer-link text-sm text-zinc-600 hover:text-primary-ink dark:text-zinc-300 dark:hover:text-primary-ink transition-all" href="https://gssoc.girlscript.org/" target="_blank" rel="noopener noreferrer">NSoC</a>
          </nav>
        </div>


        <div>
          <h3 className="text-xs font-bold uppercase tracking-widest text-zinc-900 dark:text-zinc-100 mb-4 font-headline">
            Platform Stats</h3>
          <div className="flex flex-col gap-3">
            <div className="footer-stat-card px-4 py-3 rounded-2xl flex items-center gap-3">
              <span className="material-symbols-outlined text-primary-ink text-xl">groups</span>
              <div>
                <p className="text-[10px] uppercase tracking-wider text-zinc-400 font-bold">Total Orgs</p>
                <p className="font-bold text-sm text-zinc-900 dark:text-zinc-50 font-mono" id="footerOrgCount">{counts.total}</p>
              </div>
            </div>
            <div className="footer-stat-card px-4 py-3 rounded-2xl flex items-center gap-3">
              <span className="material-symbols-outlined text-secondary text-xl">military_tech</span>
              <div>
                <p className="text-[10px] uppercase tracking-wider text-zinc-400 font-bold">Veterans</p>
                <p className="font-bold text-sm text-zinc-900 dark:text-zinc-50 font-mono" id="footerVeteranOrgCount">{counts.veterans}</p>
              </div>
            </div>
            <div className="footer-stat-card px-4 py-3 rounded-2xl flex items-center gap-3">
              <span className="material-symbols-outlined text-primary-container text-xl">fiber_new</span>
              <div>
                <p className="text-[10px] uppercase tracking-wider text-zinc-400 font-bold">Newcomers</p>
                <p className="font-bold text-sm text-zinc-900 dark:text-zinc-50 font-mono" id="footerNewcomerOrgCount">{counts.newcomers}</p>
              </div>
            </div>
          </div>
        </div>
      </div>



      <div className="footer-legal-row max-w-7xl mx-auto pt-8 border-t border-zinc-200/50 dark:border-zinc-800/50 flex flex-col sm:flex-row justify-between items-center gap-6">



        <div className="flex items-center gap-3 sm:gap-4 flex-wrap justify-center footer-social-row">
          <Link className="footer-link text-xs font-bold uppercase tracking-widest text-zinc-600 hover:text-primary-ink dark:text-zinc-300 transition-colors mr-2" to="/privacy">Privacy Policy</Link>
          <a className="social-link github" href="https://github.com/imayuss/OF" target="_blank" rel="noopener noreferrer" aria-label="GitHub Repository">
            <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
              <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
            </svg>
          </a>


        </div>
      </div>
    </footer>
  );
}
