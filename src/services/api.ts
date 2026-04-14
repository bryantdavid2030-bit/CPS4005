import type { Coach, Enquiry } from '@/types';
import { coaches as localCoaches } from '@/data/coaches';

/**
 * API client.
 *
 * Coach data is read from the bundled seed in src/data/coaches.ts
 * (offline-first). When EXPO_PUBLIC_API_BASE is set, the same calls
 * hit a real CMS instead.
 *
 * Enquiries are POSTed to a Cloudflare Worker (see worker/) which
 * forwards them to hello@humnsprt.com via Resend. The Worker URL
 * lives in EXPO_PUBLIC_ENQUIRY_ENDPOINT. When unset, submitEnquiry
 * falls back to a local log-only stub so dev still works offline.
 *
 * Note: Expo inlines `process.env.EXPO_PUBLIC_*` at babel-transform
 * time, so the constants below are baked into the bundle. Tests
 * exercise `postEnquiry()` directly with an explicit endpoint.
 */

const API_BASE = process.env.EXPO_PUBLIC_API_BASE ?? '';

/**
 * Default enquiry endpoint — the live Humn Sprt Cloudflare Worker.
 * Not a secret (it's a public URL), so it's safe to ship in the
 * bundle. Override by setting EXPO_PUBLIC_ENQUIRY_ENDPOINT in .env
 * if you want to point at a staging Worker.
 */
const DEFAULT_ENQUIRY_ENDPOINT =
  'https://humnsprt-enquiries.shy-sun-d665.workers.dev/enquiries';
const ENQUIRY_ENDPOINT =
  process.env.EXPO_PUBLIC_ENQUIRY_ENDPOINT || DEFAULT_ENQUIRY_ENDPOINT;

export async function listCoaches(): Promise<Coach[]> {
  if (!API_BASE) return localCoaches;
  const res = await fetch(`${API_BASE}/coaches`);
  if (!res.ok) throw new Error(`Failed to load coaches (${res.status})`);
  return (await res.json()) as Coach[];
}

export async function getCoach(id: string): Promise<Coach | null> {
  if (!API_BASE) return localCoaches.find((c) => c.id === id) ?? null;
  const res = await fetch(`${API_BASE}/coaches/${id}`);
  if (res.status === 404) return null;
  if (!res.ok) throw new Error(`Failed to load coach ${id}`);
  return (await res.json()) as Coach;
}

/**
 * Pure POST helper. Exported so tests can drive it without depending
 * on the build-time inlined env var. Throws on network failure or
 * non-OK response.
 */
export async function postEnquiry(
  endpoint: string,
  enquiry: Enquiry,
): Promise<void> {
  let res: Response;
  try {
    res = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(enquiry),
    });
  } catch {
    throw new Error(
      'Could not reach the enquiry service. Check your connection and try again.',
    );
  }

  if (!res.ok) {
    let detail = '';
    try {
      const body = (await res.json()) as { error?: string };
      detail = body.error ?? '';
    } catch {
      // ignore parse errors — fall through to generic message
    }
    throw new Error(
      detail
        ? `Enquiry failed: ${detail}`
        : `Enquiry failed (${res.status}). Please try again shortly.`,
    );
  }
}

export async function submitEnquiry(enquiry: Enquiry): Promise<void> {
  if (!ENQUIRY_ENDPOINT) {
    // Local fallback: log and succeed after a short delay so the
    // success screen still works in offline / pre-deploy dev.
    await new Promise((r) => setTimeout(r, 700));
    if (__DEV__) console.log('[enquiry]', enquiry);
    return;
  }
  return postEnquiry(ENQUIRY_ENDPOINT, enquiry);
}
