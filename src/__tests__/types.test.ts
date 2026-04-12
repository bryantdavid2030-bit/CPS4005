import type { Coach, Enquiry, User } from '../types';

describe('type contracts', () => {
  it('Coach interface matches the seed data shape', () => {
    const coach: Coach = {
      id: 'test-1',
      name: 'Test Coach',
      discipline: 'Strength',
      location: 'London',
      headline: 'Test headline',
      bio: 'Test bio text.',
      languages: ['English'],
      specialties: ['Testing'],
      availability: 'Available',
    };
    expect(coach.id).toBe('test-1');
    expect(coach.featured).toBeUndefined();
    expect(coach.portrait).toBeUndefined();
    expect(coach.baseRate).toBeUndefined();
  });

  it('Enquiry accepts all three type variants', () => {
    const types: Enquiry['type'][] = ['individual', 'concierge', 'corporate'];
    expect(types).toHaveLength(3);
  });

  it('User accepts all four role variants', () => {
    const roles: User['role'][] = [
      'client',
      'concierge',
      'corporate',
      'practitioner',
    ];
    expect(roles).toHaveLength(4);
  });
});
