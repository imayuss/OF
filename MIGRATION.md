# index.html → React (Vite) migration notes

## Run
```bash
npm install
npm run dev        # http://localhost:5173/app
npm test           # vitest (unit + jsdom integration)
npm run build      # → dist/
```

## Where things went
| Old | New |
|---|---|
| `index.html` head (meta, JSON-LD, fonts, theme script) | `index.html` (Vite root; CDN scripts removed) |
| inline `tailwind.config` | `tailwind.config.js` (Tailwind **3.4**, same tokens/plugins) |
| `src/styles.css` + inline `<style>` | `src/styles/base.css`, `src/styles/inline.css` (imported before Tailwind, like the Play CDN did) |
| `agent/scripts/orgs.js` (`ORGS`) | `src/data/orgs.js` (`export const ORGS`) |
| inline `<script>` (≈2,950 lines) | `src/context/AppContext.jsx`, `src/hooks/*`, `src/lib/*`, components |
| `src/js/badges-mvp.js` | `src/lib/badges.js` (+ `<BadgeToastHost/>` listens to `badgeUnlocked`) |
| `src/js/githubAnalyzer.js`, `skillExtractor.js`, `recommender.js` | `src/lib/*` (ES modules, logic unchanged) |
| `src/js/recommendation-ui.js` | `src/components/sections/AiRecommender.jsx` |
| `src/components/footer.html` + `footer.js` | `src/components/layout/Footer.jsx` |
| `agent/scripts/speed-insights.js` | `src/main.jsx` (`@vercel/speed-insights`) |
| `sw.js`, `manifest.json`, icons | `public/` (precache list updated for the build) |
| `data/issues.json`, `data/mentors.json` | `public/data/` |
| `vercel.json` | `vercel.json` (SPA rewrite, `/api` + `/data` headers kept) |

`src/js/app.js` was **not** used: it has diverged from the inline script that `index.html` actually runs.

## Behaviour changes (intentional, small)
- Analytics modal: Searches / Org Views / Filters Used now read the badge counters (they were hard-coded 0).
- Esc now also closes the keyboard-shortcuts dialog.
- Toggling Compare no longer jumps the directory back to page 1.
- Org modal stats reset when you open a different org.
- Static "Good First Issues" placeholders are real links while data loads.
- `?q=` keeps the text as typed (was lowercased).

## Known gaps / follow-ups
- `/` (landing), `/privacy` and the 404 page are **placeholders** — landing.html, privacy.html, 404.html (and `src/landing.css`) were not provided.
- GitHub Actions that write `data/*.json` must now write to `public/data/`.
- "Fetch Live Stats" in the org modal is still the original simulation (random numbers). `api/github.js` is ready to back it.
- Legacy CSS (`.dark .bg-white { … !important }` etc.) is kept for visual parity; replace with `dark:` variants gradually, then run `npx @tailwindcss/upgrade` for Tailwind v4.
- Not checked in a real browser (no browser in the build sandbox): verified by `vite build` + 25 tests.

## Theme
Palette: fiery orange `#F04400`, sunshine yellow `#FFD91A`, jet black `#000000`, neon green `#D0F030`.
- Tokens live in `tailwind.config.js` (incl. `orange`/`yellow`/`green` scale overrides), `src/styles/theme.css` and the `:root` / `.dark` blocks of `src/styles/base.css`.
- Text on any orange / yellow / neon fill is jet black (white on `#F04400` is only 3.8:1). Small orange *text* on light surfaces uses `text-primary-ink` (`#C13400`, 5.6:1; `#FF5A1F` in dark mode).
- Dark mode is jet black with `#0D0D0D` cards; the neon green is the dark-mode CTA/accent colour.
