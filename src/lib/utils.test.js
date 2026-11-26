import { describe, expect, it } from 'vitest';
import {
  getActiveDeadlines, getActiveMilestoneIndex, githubOwnerFromValue, githubUrlFromValue,
  languageMatchesSelection, MILESTONES, sanitizeHrefUrl,
} from './utils';

describe('sanitizeHrefUrl', () => {
  it('accepts http(s) and rejects everything else', () => {
    expect(sanitizeHrefUrl('https://example.com/a')).toBe('https://example.com/a');
    expect(sanitizeHrefUrl('javascript:alert(1)')).toBeNull();
    expect(sanitizeHrefUrl('data:text/html,hi')).toBeNull();
    expect(sanitizeHrefUrl('')).toBeNull();
    expect(sanitizeHrefUrl(undefined)).toBeNull();
  });
});

describe('github helpers', () => {
  it('handles URLs and owner/repo slugs', () => {
    expect(githubOwnerFromValue('https://github.com/rust-lang/rust')).toBe('rust-lang');
    expect(githubOwnerFromValue('django/django')).toBe('django');
    expect(githubUrlFromValue('django/django')).toBe('https://github.com/django/django');
    expect(githubUrlFromValue('https://gitlab.com/x/y')).toBeNull();
  });
});

describe('languageMatchesSelection', () => {
  it('uses aliases', () => {
    expect(languageMatchesSelection(['c++'], 'C/C++')).toBe(true);
    expect(languageMatchesSelection(['machine learning'], 'ML/AI')).toBe(false); // tokenised: "machine", "learning"
    expect(languageMatchesSelection(['ml'], 'ML/AI')).toBe(true);
  });
});

describe('timeline helpers', () => {
  it('picks the first future milestone, else the last', () => {
    expect(getActiveMilestoneIndex(new Date('2026-01-01'))).toBe(0);
    expect(getActiveMilestoneIndex(new Date('2030-01-01'))).toBe(MILESTONES.length - 1);
  });
  it('drops deadlines that already passed (UTC)', () => {
    expect(getActiveDeadlines(new Date('2026-03-31T10:00:00Z'))).toHaveLength(2);
    expect(getActiveDeadlines(new Date('2026-04-01T00:00:00Z'))).toHaveLength(1);
    expect(getActiveDeadlines(new Date('2026-11-08T00:00:00Z'))).toHaveLength(0);
  });
});
