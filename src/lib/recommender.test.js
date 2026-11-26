import { describe, expect, it } from 'vitest';
import { extractSkills } from './skillExtractor';
import { getRecommendations } from './recommender';

describe('recommender', () => {
  it('extracts skills from free text and scores orgs deterministically', () => {
    const skills = extractSkills('I write Python and TypeScript, with some machine learning experience.');
    expect(skills.length).toBeGreaterThan(0);
    const a = getRecommendations(skills, null, 5);
    const b = getRecommendations(skills, null, 5);
    expect(a.length).toBeGreaterThan(0);
    expect(a.map((r) => r.org.name)).toEqual(b.map((r) => r.org.name));
    expect(a[0].score).toBeGreaterThanOrEqual(a[a.length - 1].score);
  });
});
