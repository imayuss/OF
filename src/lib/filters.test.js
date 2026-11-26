import { describe, expect, it } from 'vitest';
import { ORGS } from '../data/orgs';
import { filterOrgs, getPageItems } from './filters';

const base = { query: '', category: 'all', complexity: 'all', sort: 'alpha', languages: [], matchAll: false, chip: null };
const none = new Set();

describe('filterOrgs', () => {
  it('returns every org alphabetically with no filters', () => {
    const result = filterOrgs(ORGS, base, none);
    expect(result).toHaveLength(ORGS.length);
    const names = result.map((o) => o.name);
    expect(names).toEqual([...names].sort((a, b) => a.localeCompare(b)));
  });

  it('ranks exact then prefix matches first when searching', () => {
    const result = filterOrgs(ORGS, { ...base, query: 'python' }, none);
    expect(result.length).toBeGreaterThan(0);
    expect(result[0].name.toLowerCase().startsWith('python')).toBe(true);
  });

  it('matches languages as whole tokens ("Go" must not match "django")', () => {
    const fake = [
      { name: 'A', cat: 'web', years: 1, competition: 'chill', codebase: 'beginner', tags: ['Django'], fit: [] },
      { name: 'B', cat: 'web', years: 1, competition: 'chill', codebase: 'beginner', tags: ['Go'], fit: [] },
    ];
    const result = filterOrgs(fake, { ...base, languages: ['Go'] }, none);
    expect(result.map((o) => o.name)).toEqual(['B']);
  });

  it('AND vs OR language matching', () => {
    const fake = [
      { name: 'A', cat: 'x', years: 1, competition: 'chill', codebase: 'beginner', tags: ['Python'], fit: [] },
      { name: 'B', cat: 'x', years: 1, competition: 'chill', codebase: 'beginner', tags: ['Python', 'Rust'], fit: [] },
    ];
    expect(filterOrgs(fake, { ...base, languages: ['Python', 'Rust'] }, none)).toHaveLength(2);
    expect(filterOrgs(fake, { ...base, languages: ['Python', 'Rust'], matchAll: true }, none).map((o) => o.name)).toEqual(['B']);
  });

  it('applies chips', () => {
    const veterans = filterOrgs(ORGS, { ...base, chip: 'veterans' }, none);
    expect(veterans.every((o) => o.years >= 10)).toBe(true);
    const newcomers = filterOrgs(ORGS, { ...base, chip: 'newcomers' }, none);
    expect(newcomers.every((o) => o.years <= 3)).toBe(true);
    const marked = new Set([ORGS[0].name]);
    expect(filterOrgs(ORGS, { ...base, chip: 'bookmarked' }, marked).map((o) => o.name)).toEqual([ORGS[0].name]);
  });

  it('combines category, complexity and years sort', () => {
    const result = filterOrgs(ORGS, { ...base, category: 'web', complexity: 'beginner', sort: 'years-desc' }, none);
    expect(result.every((o) => o.cat === 'web' && o.codebase === 'beginner')).toBe(true);
    for (let i = 1; i < result.length; i++) expect(result[i - 1].years).toBeGreaterThanOrEqual(result[i].years);
  });
});

describe('getPageItems', () => {
  it('collapses long ranges with ellipses', () => {
    expect(getPageItems(20, 10)).toEqual([1, '…', 8, 9, 10, 11, 12, '…', 20]);
    expect(getPageItems(3, 1)).toEqual([1, 2, 3]);
  });
});
