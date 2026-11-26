import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { act, cleanup, fireEvent, render, screen, waitFor, within } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import Home from './routes/Home';
import { ORGS } from './data/orgs';

function mockFetch() {
  globalThis.fetch = vi.fn(async (url) => {
    const u = String(url);
    const body = u.includes('mentors')
      ? { [ORGS[0].name]: { org: ORGS[0].name, ideasUrl: ORGS[0].ideas, channels: [{ type: 'Slack', label: 'Slack', url: 'https://example.com/slack' }], mentors: [{ name: 'Ada', github: 'ada', githubUrl: 'https://github.com/ada' }], mailingLists: [], tip: 'Say hi!', status: 'ok', lastFetched: new Date().toISOString() } }
      : { updated_at: new Date().toISOString(), issues: [{ title: 'Fix typo', url: 'https://github.com/a/b/issues/1', repo: 'a/b', labels: ['good first issue'], comments: 2 }] };
    return { ok: true, status: 200, json: async () => body };
  });
}

// Renders and lets the mocked /data fetches settle so no state updates land outside act().
async function renderApp(route = '/app') {
  const result = render(
    <MemoryRouter initialEntries={[route]} future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <AppProvider><Home /></AppProvider>
    </MemoryRouter>,
  );
  await act(async () => { await new Promise((r) => setTimeout(r, 0)); });
  return result;
}

beforeEach(() => { localStorage.clear(); document.documentElement.className = ''; mockFetch(); });
afterEach(() => { cleanup(); vi.restoreAllMocks(); });

describe('<Home />', () => {
  it('renders the directory with pagination (9 per page)', async () => {
    await renderApp();
    expect(document.querySelectorAll('#orgGrid article')).toHaveLength(9);
    expect(screen.getByText(String(ORGS.length), { selector: '#orgCount' })).toBeTruthy();
    expect(document.querySelectorAll('#orgPagination button').length).toBeGreaterThan(4);
  });

  it('restores filters from the URL and clears them', async () => {
    await renderApp('/app?q=python');
    const count = Number(document.getElementById('orgCount').textContent);
    expect(count).toBeGreaterThan(0);
    expect(count).toBeLessThan(ORGS.length);
    expect(document.getElementById('hero-search').value).toBe('python');
    fireEvent.click(document.getElementById('clearFiltersBtn'));
    expect(Number(document.getElementById('orgCount').textContent)).toBe(ORGS.length);
    expect(document.getElementById('hero-search').value).toBe('');
  });

  it('language pills toggle, show a strip and filter', async () => {
    await renderApp();
    const rust = document.querySelector('.pill[data-lang="Rust"]');
    fireEvent.click(rust);
    expect(rust.className).toContain('active');
    expect(document.querySelector('#selectedLangsStrip .selected-lang-badge').textContent).toContain('Rust');
    expect(Number(document.getElementById('orgCount').textContent)).toBeLessThan(ORGS.length);
    fireEvent.click(document.querySelector('#selectedLangsStrip .clear-all-langs-btn'));
    expect(Number(document.getElementById('orgCount').textContent)).toBe(ORGS.length);
  });

  it('opens the org modal, tracks recently viewed, and closes on Escape', async () => {
    await renderApp();
    const card = document.querySelector('#orgGrid article');
    const name = card.dataset.org;
    fireEvent.click(card);
    const modal = document.getElementById('orgModal');
    expect(modal.className).toContain('open');
    expect(within(modal).getByText(name, { selector: 'h2' })).toBeTruthy();
    expect(JSON.parse(localStorage.getItem('recentlyViewedOrgs'))).toContain(name);
    await waitFor(() => expect(document.getElementById('recentlyViewedContainer')).toBeTruthy());
    fireEvent.keyDown(document, { key: 'Escape' });
    expect(modal.className).not.toContain('open');
  });

  it('bookmarks into the watchlist and persists', async () => {
    await renderApp();
    const card = document.querySelector('#orgGrid article');
    fireEvent.click(card.querySelector('.bookmark-btn'));
    expect(JSON.parse(localStorage.getItem('bookmarks'))).toEqual([card.dataset.org]);
    const items = [...document.querySelectorAll('[data-watchlist-org]')];
    expect(items.map((i) => i.dataset.watchlistOrg)).toEqual([card.dataset.org]);
    expect(document.getElementById('aiInsightText').textContent).toContain('Based on 1 saved org');
  });

  it('limits compare to 3 and shows a toast', async () => {
    await renderApp();
    const cards = [...document.querySelectorAll('#orgGrid article')];
    const compareBtn = (c) => [...c.querySelectorAll('button')].find((b) => /Compar/.test(b.textContent));
    cards.slice(0, 4).forEach((c) => fireEvent.click(compareBtn(c)));
    expect(document.querySelector('.compare-toast').textContent).toMatch(/up to 3/);
    expect(document.querySelectorAll('#compare .grid > div .truncate')).toHaveLength(3);
  });

  it('compare modal needs two orgs, then renders a table', async () => {
    await renderApp();
    const cards = [...document.querySelectorAll('#orgGrid article')];
    const compareBtn = (c) => [...c.querySelectorAll('button')].find((b) => /Compar/.test(b.textContent));
    fireEvent.click(compareBtn(cards[0]));
    fireEvent.click(screen.getByText('Open Comparison Tool'));
    expect(document.getElementById('compareModalBody').textContent).toMatch(/at least 2/);
    fireEvent.keyDown(document, { key: 'Escape' });
    fireEvent.click(compareBtn(cards[1]));
    fireEvent.click(screen.getByText('Open Comparison Tool'));
    expect(document.querySelectorAll('#compareModalBody tbody tr')).toHaveLength(8);
  });

  it('toggles the theme class and persists it', async () => {
    await renderApp();
    fireEvent.click(document.getElementById('themeToggleBtn'));
    expect(document.documentElement.classList.contains('dark')).toBe(true);
    expect(localStorage.getItem('theme')).toBe('dark');
  });

  it('proposal builder loads the template, sanitises the preview and autosaves', async () => {
    vi.useFakeTimers({ shouldAdvanceTime: true });
    await renderApp();
    const card = document.querySelector('#orgGrid article');
    const name = card.dataset.org;
    fireEvent.click(card);
    fireEvent.click(document.getElementById('mDraftBtn'));
    const editor = document.getElementById('pwEditor');
    expect(editor.value).toContain(`**Organization:** ${name}`);
    fireEvent.click(document.getElementById('pwAutosaveToggle'));
    fireEvent.change(editor, { target: { value: '# Hi\n\n<img src=x onerror=alert(1)> <script>alert(1)</script>' } });
    act(() => { vi.advanceTimersByTime(400); });
    expect(localStorage.getItem(`gaf_proposal_${name}`)).toContain('# Hi');
    const preview = document.getElementById('pwPreview');
    expect(preview.querySelector('h1').textContent).toBe('Hi');
    expect(preview.querySelector('script')).toBeNull();
    expect(preview.innerHTML).not.toContain('onerror');
    vi.useRealTimers();
  });

  it('loads mentor + issue data from /data', async () => {
    await renderApp();
    await waitFor(() => expect(document.querySelectorAll('#mentorGrid article').length).toBeGreaterThan(0));
    await waitFor(() => expect(document.getElementById('issuesLastUpdated').textContent).toMatch(/Last updated: \d/));
    expect(screen.getByText('Fix typo')).toBeTruthy();
  });

  it('keyboard shortcut ? opens help, Escape closes it', async () => {
    await renderApp();
    fireEvent.keyDown(document, { key: '?' });
    expect(document.getElementById('helpModal').className).toContain('open');
    fireEvent.keyDown(document, { key: 'Escape' });
    expect(document.getElementById('helpModal').className).not.toContain('open');
  });

  it('guide accordion opens one block at a time', async () => {
    await renderApp();
    const headers = document.querySelectorAll('.roadmap-block-header');
    expect(headers.length).toBe(5);
    fireEvent.click(headers[0]);
    expect(headers[0].closest('.roadmap-block').className).toContain('is-open');
    fireEvent.click(headers[1]);
    expect(headers[0].closest('.roadmap-block').className).not.toContain('is-open');
    expect(headers[1].closest('.roadmap-block').className).toContain('is-open');
  });
});
