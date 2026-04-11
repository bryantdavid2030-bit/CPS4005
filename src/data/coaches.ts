import type { Coach } from '@/types';

/**
 * Seed coach listings.
 *
 * In production these are fetched from the Humn Sprt CMS / API
 * (see src/services/api.ts). This static list powers local development
 * and offline mode, and is what the splash/onboarding previews use.
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
  {
    id: 'c-002',
    name: 'Marcus Abe',
    discipline: 'Mobility & Movement',
    location: 'Los Angeles',
    headline: 'Movement coach to film talent and touring musicians',
    bio: 'Fifteen years on set and on tour. Travels with a small roster of clients, delivering daily mobility, breathwork and recovery protocols through production cycles.',
    languages: ['English', 'Japanese'],
    specialties: ['Breathwork', 'Touring recovery', 'On-set conditioning'],
    baseRate: 'Day rate on request',
    availability: 'Waitlist',
    featured: true,
  },
  {
    id: 'c-003',
    name: 'Sofia Bertrand',
    discipline: 'Tennis',
    location: 'Paris · St Tropez',
    headline: 'Private tennis coaching across Europe',
    bio: 'WTA tour veteran. Offers one-to-one coaching at private clubs and residences across France, Monaco and the Côte d’Azur. Hotel concierge bookings welcome.',
    languages: ['French', 'English', 'Italian'],
    specialties: ['Junior development', 'Match play', 'Technical refinement'],
    baseRate: 'From €380 / hour',
    availability: 'Available',
  },
  {
    id: 'c-004',
    name: 'Dr. Idris Oyelaran',
    discipline: 'Performance Psychology',
    location: 'New York',
    headline: 'Executive performance psychologist',
    bio: 'PhD in sport psychology. Works with C-suite leaders and professional athletes on the overlap between elite performance, sleep and decision-making under pressure.',
    languages: ['English', 'Yoruba'],
    specialties: ['Stress physiology', 'Sleep', 'Decision-making'],
    baseRate: 'From $650 / session',
    availability: 'Limited',
    featured: true,
  },
  {
    id: 'c-005',
    name: 'Elena Russo',
    discipline: 'Pilates & Rehabilitation',
    location: 'Milan · Lake Como',
    headline: 'Clinical pilates for post-injury return',
    bio: 'MSc in musculoskeletal rehabilitation. Known for returning principals to riding, sailing and skiing after significant injury with unusually low recurrence rates.',
    languages: ['Italian', 'English'],
    specialties: ['Post-surgical', 'Equestrian', 'Sailing'],
    baseRate: 'From €260 / session',
    availability: 'Available',
  },
  {
    id: 'c-006',
    name: 'Hakim Larsen',
    discipline: 'Golf Performance',
    location: 'Dubai · London',
    headline: 'Biomechanics-led golf coaching',
    bio: 'Blends TPI-certified biomechanics with strength and mobility programming. Frequently engaged by hotel residences and private members clubs.',
    languages: ['English', 'Swedish', 'Arabic'],
    specialties: ['Swing biomechanics', 'On-course strategy', 'Off-season strength'],
    baseRate: 'From $520 / session',
    availability: 'Limited',
  },
  {
    id: 'c-007',
    name: 'Priya Ananth',
    discipline: 'Yoga & Breathwork',
    location: 'Mumbai · Ibiza',
    headline: 'Private yoga for discerning travellers',
    bio: 'Twenty years of Ashtanga and pranayama practice. Retained by hotel groups and family offices for in-residence programming and retreats.',
    languages: ['English', 'Hindi', 'Spanish'],
    specialties: ['Ashtanga', 'Pranayama', 'Retreats'],
    baseRate: 'From €300 / session',
    availability: 'Available',
  },
  {
    id: 'c-008',
    name: 'Jonas Weiß',
    discipline: 'Alpine & Ski Conditioning',
    location: 'Zurich · St Moritz',
    headline: 'Pre-season preparation and on-mountain coaching',
    bio: 'Former Swiss ski team conditioning lead. Builds 10-week pre-season programmes and coaches on-mountain through the winter.',
    languages: ['German', 'English', 'French'],
    specialties: ['Pre-season strength', 'On-piste technique', 'Touring'],
    baseRate: 'From CHF 480 / session',
    availability: 'Waitlist',
  },
];

export const disciplines = Array.from(
  new Set(coaches.map((c) => c.discipline)),
).sort();

export const locations = Array.from(
  new Set(coaches.flatMap((c) => c.location.split(' · '))),
).sort();
