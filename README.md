# Humn Sprt — mobile

Cross-platform React Native / Expo app for Humn Sprt, a curated
coaching listing platform for individuals, hotel concierges and
corporate clients. Targets iOS and Android from a single codebase.

> Premise: scan humnsprt.com and rebuild it as a premium mobile app.
> At build time the sandbox blocked outbound requests to humnsprt.com,
> so content was modelled from the brief. `src/data/coaches.ts` ships
> a single dummy profile so every screen has something to render —
> swap it (and the hero copy in `src/screens/HomeScreen.tsx`) for the
> real CMS output as soon as the site is reachable. No other code
> changes required.

## Stack

- Expo SDK 51, React Native 0.74, TypeScript (strict)
- React Navigation (native stack + bottom tabs)
- react-native-reanimated v3 for the intro and screen transitions
- Sentry for crash / performance monitoring
- Expo Updates (EAS Update) for OTA delivery
- GitHub Actions + Fastlane + EAS for CI/CD and store submissions
- Dependabot for weekly dependency updates
- Cloudflare Worker + Resend for the enquiry backend (`worker/`)

See `docs/ARCHITECTURE.md` for the reasoning behind each choice.

## Quick start

```bash
# 1. Install
yarn install

# 2. Copy env
cp .env.example .env
# fill in EXPO_PUBLIC_API_BASE and SENTRY_DSN if you have them

# 3. Run
yarn start           # Metro
yarn ios             # iOS simulator (requires Xcode)
yarn android         # Android emulator (requires Android Studio)
```

Font files (Inter + Playfair Display) are bundled in `assets/fonts/`.
Both are free for commercial use under the SIL Open Font License —
see `docs/FONTS.md` for details.

The app is fully functional without a backend — `src/services/api.ts`
falls back to the seed data in `src/data/coaches.ts` when no API
base URL is set, and `submitEnquiry` falls back to a console log
when no enquiry endpoint is set.

## Enquiry backend (Cloudflare Worker → Resend)

Production enquiries are POSTed to a small Cloudflare Worker that
forwards them to `hello@humnsprt.com` via [Resend](https://resend.com).
The Resend API key lives as a Worker secret so it never reaches the
mobile bundle.

```bash
cd worker
npm install
wrangler login
wrangler secret put RESEND_API_KEY    # paste your Resend key
npm run deploy
```

Wrangler prints the live URL — copy it into your root `.env`:

```env
EXPO_PUBLIC_ENQUIRY_ENDPOINT=https://humnsprt-enquiries.<account>.workers.dev/enquiries
```

Full setup, custom-domain binding, and local dev instructions are in
`worker/README.md`. Free tier covers 100k Worker requests/day and
3,000 Resend emails/month.

## Key commands

| Command               | What it does                                  |
|-----------------------|-----------------------------------------------|
| `yarn start`          | Start Metro / Expo dev server                 |
| `yarn ios`            | Run on an iOS simulator                       |
| `yarn android`        | Run on an Android emulator                    |
| `yarn lint`           | ESLint                                        |
| `yarn typecheck`      | `tsc --noEmit`                                |
| `yarn test`           | Jest (mobile suites)                          |
| `yarn prebuild`       | Generate native iOS / Android projects        |
| `yarn build:ios`      | EAS build (production iOS)                    |
| `yarn build:android`  | EAS build (production Android)                |
| `yarn submit:ios`     | Upload latest iOS build to App Store Connect  |
| `yarn submit:android` | Upload latest Android build to Play Console   |
| `yarn ota`            | Publish an OTA update to the production channel |
| `yarn brand:assets`   | Regenerate icons, splash & feature graphic    |

## Folder layout

```
src/
  __tests__/      Unit / integration tests
  components/     Button, Screen, TextField, CoachCard, FilterChip, Logo, FavouriteButton
  data/           Local seed data (coaches.ts)
  hooks/          useAppFonts, useFavourites
  navigation/     RootNavigator (splash overlay + tabs + stack + deep linking)
  screens/        Splash, Auth, Home, Coaches, CoachDetail, Enquiry, EnquirySuccess, About, Account
  services/       auth, api
  theme/          colors, typography, spacing, shadow, durations
  types/          Coach, Enquiry, User
assets/
  fonts/          Playfair Display + Inter (real TTF files bundled)
  icons/          App icons (generated via scripts/generate-brand-assets.mjs)
  splash/         Splash PNGs (iOS + Android adaptive)
  store/          Feature graphic for Google Play (1024x500)
  _sources/       SVG source files for brand asset generation
store/
  app-store/      iOS metadata + privacy nutrition label
  play-store/     Android metadata + data safety form
  screenshots/    Fastlane outputs (gitignored)
fastlane/         Fastfile, Appfile, Matchfile, Snapfile, Screengrabfile
.github/
  workflows/      ci, eas-build, ota
  dependabot.yml
docs/
  ARCHITECTURE.md     Design decisions
  CONTENT.md          How to update coach listings and copy
  STORE_SUBMISSION.md Apple + Google submission checklist
  FONTS.md            Where to get the brand typefaces
  legal/              Privacy + terms placeholders
scripts/
  generate-brand-assets.mjs   SVG -> PNG asset pipeline
  screenshots.ts              Screenshot scene manifest for Fastlane
worker/
  src/index.ts    Cloudflare Worker that forwards enquiries to Resend
  wrangler.toml   Worker config (sender, recipient, allowed origins)
  README.md       Deploy steps + local dev
```

## Features

### Splash intro
- Logo centred on the brand obsidian background
- 1.5s ease-in fade + scale 0.85 -> 1.0
- 1s hold
- 1.5s ease-out fade + scale 1.0 -> 1.05
- Cross-fades (not a hard cut) into the next screen
- Plays on every cold launch, skippable by tap
- No spinners, no progress bars, no copy
- Respects `AccessibilityInfo.isReduceMotionEnabled()`

### Coach roster
- Search by name, discipline, or specialty
- Filter by discipline and location chips
- Pull-to-refresh against the API (offline fallback to seed data)
- Staggered entrance animations

### Coach detail
- Full-bleed portrait image with back, share, and favourite buttons
- Availability badge (Available / Limited / Waitlist)
- Specialties, languages, rate, and bio
- Share profile via native share sheet
- "Enquire about availability" CTA

### Favourites
- Heart toggle on coach cards and detail screens
- Persisted to AsyncStorage across sessions
- Count shown on Account screen

### Enquiry flow
- Three enquiry types: Individual, Hotel/Concierge, Corporate
- Conditional organisation field for non-individual enquiries
- Success screen with haptic feedback
- POSTs to a Cloudflare Worker (`worker/`) that emails via Resend
- Honeypot field + Worker-side validation; offline fallback when
  `EXPO_PUBLIC_ENQUIRY_ENDPOINT` is unset

### Deep linking
- `humnsprt://` scheme with routes for Home, Roster, About, Account,
  Coach Detail, and Enquiry

### About screen
- Brand story, mission, how it works, and design philosophy
- Legal links (privacy policy, terms of service)

### Account
- User info, saved coaches count, app version
- Sign out, legal links

## OTA updates

```bash
yarn ota
# or trigger the "OTA Update" GitHub Action with a custom release note
```

An update is published to the `production` EAS channel and picked up
by users on the next cold launch. See `docs/ARCHITECTURE.md` for
guidance on when to ship OTA vs a native build.

## Store submission

Full checklist in `docs/STORE_SUBMISSION.md`. Metadata and privacy
answers are tracked in `store/app-store/` and `store/play-store/`.

## Quality gates

All three pass in CI and locally:

```bash
yarn lint        # ESLint — 0 warnings
yarn typecheck   # TypeScript strict — 0 errors
yarn test        # Jest — all suites passing
```

## Accessibility

- All interactive elements declare role + label.
- Text scales with system font size.
- Splash respects Reduce Motion.
- Minimum 44x44pt hit targets.
- WCAG AA contrast on light and dark themes.

## License

All rights reserved.
