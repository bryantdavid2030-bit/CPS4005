import { listCoaches, getCoach, submitEnquiry } from '../services/api';
import { coaches } from '../data/coaches';

describe('api service (offline mode)', () => {
  it('listCoaches returns the full seed dataset when no API_BASE is set', async () => {
    const result = await listCoaches();
    expect(result).toEqual(coaches);
    expect(result.length).toBeGreaterThan(0);
  });

  it('getCoach returns a matching coach by ID', async () => {
    const coach = await getCoach('c-001');
    expect(coach).not.toBeNull();
    expect(coach!.id).toBe('c-001');
  });

  it('getCoach returns null for an unknown ID', async () => {
    const coach = await getCoach('nonexistent');
    expect(coach).toBeNull();
  });

  it('submitEnquiry resolves without error in offline mode', async () => {
    await expect(
      submitEnquiry({
        coachId: 'c-001',
        type: 'individual',
        clientName: 'Test User',
        email: 'test@example.com',
        message: 'This is a test enquiry with enough text.',
      }),
    ).resolves.toBeUndefined();
  });
});
