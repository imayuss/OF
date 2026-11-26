import { Link } from 'react-router-dom';

/**
 * Stand-in for pages that have not been migrated from static HTML yet
 * (landing.html, privacy.html, 404.html). Replace the pages that use it
 * once those files are converted.
 */
export default function Placeholder({ title, children }) {
  return (
    <main className="min-h-screen flex items-center justify-center px-6">
      <div className="max-w-xl text-center">
        <h1 className="text-4xl font-extrabold font-headline tracking-tight mb-4">{title}</h1>
        <p className="text-zinc-600 mb-8">{children}</p>
        <Link to="/app" className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-black rounded-xl font-bold hover:bg-orange-600 transition-colors">
          Open the Org Finder
        </Link>
      </div>
    </main>
  );
}
