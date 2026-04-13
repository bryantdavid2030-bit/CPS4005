import type { Coach } from '@/types';

/**
 * Seed coach listing — dummy profile.
 *
 * The app is designed to fetch the real roster from the Humn Sprt
 * CMS / API (see src/services/api.ts). For development and offline
 * use we ship a single representative dummy profile so every screen
 * (Home, Roster, Detail, Enquiry) has something to render.
 *
 * Replace this file once the live CMS feed is wired up.
 */
export const coaches: Coach[] = [
  {
    id: 'c-001',
    name: 'Anouk Vermeer',
    discipline: 'Performance Strength',
    location: 'London · Monaco',
    headline: 'Strength architect for founders and athletes',
    bio: 'Former Dutch national rowing squad physiotherapist. Builds long-horizon strength and resilience programmes for principals who measure outcomes in decades, not weeks.',
    languages: ['English', 'Dutch', 'French'],
    specialties: ['Olympic lifting', 'Tendon resilience', 'Back rehabilitation'],
    baseRate: 'From £420 / session',
    availability: 'Limited',
    featured: true,
  },
];

export const disciplines = Array.from(
  new Set(coaches.map((c) => c.discipline)),
).sort();

export const locations = Array.from(
  new Set(coaches.flatMap((c) => c.location.split(' · '))),
).sort();
