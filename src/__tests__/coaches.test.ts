import { coaches, disciplines, locations } from '../data/coaches';

describe('coach seed data', () => {
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
});
