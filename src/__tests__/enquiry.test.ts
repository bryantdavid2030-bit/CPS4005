/**
 * Tests for the enquiry POST helper.
 *
 * Expo's babel preset inlines `process.env.EXPO_PUBLIC_*` at build
 * time, so we can't toggle the endpoint via env vars per test.
 * Instead we exercise `postEnquiry()` directly with an explicit
 * endpoint argument.
 */

import { postEnquiry } from '../services/api';
import type { Enquiry } from '../types';

const ENDPOINT = 'https://example.test/enquiries';

const sample: Enquiry = {
  type: 'individual',
  clientName: 'Test User',
  email: 'test@example.com',
  message: 'This is a test enquiry with enough text for the validator.',
};

describe('postEnquiry', () => {
  const originalFetch = global.fetch;

  afterEach(() => {
    global.fetch = originalFetch;
    jest.restoreAllMocks();
  });

  it('POSTs JSON to the given endpoint and resolves on 200', async () => {
    const fetchMock = jest.fn(
      async (_url: string, _init: RequestInit) =>
        new Response(JSON.stringify({ ok: true }), { status: 200 }),
    );
    global.fetch = fetchMock as unknown as typeof fetch;

    await expect(postEnquiry(ENDPOINT, sample)).resolves.toBeUndefined();

    expect(fetchMock).toHaveBeenCalledTimes(1);
    const call = fetchMock.mock.calls[0];
    expect(call[0]).toBe(ENDPOINT);
    expect(call[1].method).toBe('POST');
    expect(call[1].headers).toEqual({ 'Content-Type': 'application/json' });
    expect(JSON.parse(call[1].body as string)).toEqual(sample);
  });

  it('throws a descriptive error when the endpoint responds non-OK', async () => {
    global.fetch = jest.fn(
      async (_url: string, _init: RequestInit) =>
        new Response(JSON.stringify({ error: 'message required' }), {
          status: 400,
        }),
    ) as unknown as typeof fetch;

    await expect(postEnquiry(ENDPOINT, sample)).rejects.toThrow(
      /message required/,
    );
  });

  it('falls back to a generic message when the error body is not JSON', async () => {
    global.fetch = jest.fn(
      async (_url: string, _init: RequestInit) =>
        new Response('boom', { status: 500 }),
    ) as unknown as typeof fetch;

    await expect(postEnquiry(ENDPOINT, sample)).rejects.toThrow(
      /Enquiry failed \(500\)/,
    );
  });

  it('throws a network-friendly error when fetch itself rejects', async () => {
    global.fetch = jest.fn(async () => {
      throw new Error('network down');
    }) as unknown as typeof fetch;

    await expect(postEnquiry(ENDPOINT, sample)).rejects.toThrow(
      /Could not reach the enquiry service/,
    );
  });
});
