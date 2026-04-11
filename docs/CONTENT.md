# Updating coach listings & content

## Source of truth

During development and for offline demos, coach listings come from
`src/data/coaches.ts`. In production they should come from the Humn
Sprt CMS or backend via `src/services/api.ts`.

## Coach schema

```ts
interface Coach {
  id: string;                // stable slug, e.g. "anouk-vermeer"
  name: string;
  discipline: string;        // e.g. "Performance Strength"
  location: string;          // "London · Monaco" — bullet-separated cities
  headline: string;          // one sentence, sentence case
  bio: string;               // 2-4 sentences
  portrait?: string;         // absolute HTTPS URL
  languages: string[];
  specialties: string[];
  baseRate?: string;         // free-form string: "From £420 / session"
  availability: 'Available' | 'Limited' | 'Waitlist';
  featured?: boolean;        // surfaces on the Home screen
}
```

## Adding a coach (local / offline)

1. Open `src/data/coaches.ts`.
2. Append a new object with a unique `id`.
3. Use an absolute HTTPS URL for the portrait (the `expo-image` loader
   will cache it on first view).
4. Run `yarn typecheck` and visually verify in the simulator.

## Adding a coach (via CMS)

1. Create the record in the Humn Sprt CMS.
2. Ensure the portrait is exported at 1600×2000 JPEG, ~85% quality
   (the card uses ~4:5 aspect ratio).
3. No app rebuild is required — the next launch fetches the roster
   via `listCoaches()` in `src/services/api.ts`.

## Editing home copy

Home hero copy lives in `src/screens/HomeScreen.tsx`. For
copy-only changes, ship with an OTA update:

```bash
yarn ota
```

This publishes a new JS bundle to users immediately on next launch —
no App Store or Play review required.

## Images

- **Portraits**: 1600×2000, 4:5, editorial composition, neutral
  backgrounds or environmental.
- **Hero**: full-bleed only when used behind the splash sequence;
  otherwise prefer typography over imagery on the Home screen.
- **File sizes**: keep under 250 KB per portrait. Use `mozjpeg` or
  `squoosh` for export.
- Never ship client photography without a signed release on file.
