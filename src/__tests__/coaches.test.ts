import { coaches, disciplines, locations } from '../data/coaches';

describe('coach seed data', () => {
  it('ships exactly one dummy profile until the CMS feed is wired', () => {
    expect(coaches).toHaveLength(1);
    expect(coaches[0].id).toBe('c-001');
  });

  it('has unique ids', () => {
    const ids = coaches.map((c) => c.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it('derives a non-empty list of disciplines', () => {
    expect(disciplines.length).toBeGreaterThan(0);
  });

  it('derives a non-empty list of locations', () => {
    expect(locations.length).toBeGreaterThan(0);
  });

  it('every coach declares at least one specialty and language', () => {
    for (const c of coaches) {
      expect(c.specialties.length).toBeGreaterThan(0);
      expect(c.languages.length).toBeGreaterThan(0);
    }
  });

  it('every coach uses an allowed availability value', () => {
    const allowed = new Set(['Available', 'Limited', 'Waitlist']);
    for (const c of coaches) {
      expect(allowed.has(c.availability)).toBe(true);
    }
  });

  it('the dummy coach is featured so the home screen is not empty', () => {
    expect(coaches.some((c) => c.featured)).toBe(true);
  });
});
