import { listCoaches, getCoach, submitEnquiry } from '../services/api';
import { coaches } from '../data/coaches';

describe('api service', () => {
  const originalFetch = global.fetch;
  afterEach(() => {
    global.fetch = originalFetch;
  });

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

  it('submitEnquiry posts to the baked-in default endpoint and resolves', async () => {
    const fetchMock = jest.fn(
      async (_url: string, _init: RequestInit) =>
        new Response(JSON.stringify({ ok: true }), { status: 200 }),
    );
    global.fetch = fetchMock as unknown as typeof fetch;

    await expect(
      submitEnquiry({
        coachId: 'c-001',
        type: 'individual',
        clientName: 'Test User',
        email: 'test@example.com',
        message: 'This is a test enquiry with enough text.',
      }),
    ).resolves.toBeUndefined();

    expect(fetchMock).toHaveBeenCalledTimes(1);
    const url = fetchMock.mock.calls[0][0];
    expect(url).toMatch(/workers\.dev\/enquiries$/);
  });
});
