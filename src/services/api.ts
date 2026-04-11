import type { Coach, Enquiry } from '@/types';
import { coaches as localCoaches } from '@/data/coaches';

/**
 * API client.
 *
 * In development and during offline use this resolves against the
 * bundled seed data in src/data/coaches.ts. In production it should
 * hit the Humn Sprt CMS / backend — swap the fetch calls in below.
 */

const API_BASE = process.env.EXPO_PUBLIC_API_BASE ?? '';

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

export async function submitEnquiry(enquiry: Enquiry): Promise<void> {
  if (!API_BASE) {
    // Local fallback: log and succeed after a short delay.
    await new Promise((r) => setTimeout(r, 700));
    if (__DEV__) console.log('[enquiry]', enquiry);
    return;
  }
  const res = await fetch(`${API_BASE}/enquiries`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(enquiry),
  });
  if (!res.ok) throw new Error(`Enquiry failed (${res.status})`);
}
