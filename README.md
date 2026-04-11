# Humn Sprt — mobile

Cross-platform React Native / Expo app for Humn Sprt, a curated
coaching listing platform for individuals, hotel concierges and
corporate clients. Targets iOS and Android from a single codebase.

> Premise: scan humnsprt.com and rebuild it as a premium mobile app.
> At build time the sandbox blocked outbound requests to humnsprt.com,
> so content was modelled from the brief. Swap `src/data/coaches.ts`
> and the hero copy in `src/screens/HomeScreen.tsx` for the real CMS
> output as soon as the site is reachable — no other changes required.

## Stack

- Expo SDK 51, React Native 0.74, TypeScript (strict)
- React Navigation (native stack + tabs)
- react-native-reanimated v3 for the intro and screen transitions
- Sentry for crash / performance monitoring
- Expo Updates (EAS Update) for OTA delivery
- GitHub Actions + Fastlane + EAS for CI/CD and store submissions
- Dependabot for weekly dependency updates

See `docs/ARCHITECTURE.md` for the reasoning behind each choice.

## Quick start

```bash
# 1. Install
yarn install

# 2. Copy env
cp .env.example .env
# fill in EXPO_PUBLIC_API_BASE and SENTRY_DSN if you have them

# 3. Drop font files into assets/fonts (see docs/FONTS.md)

# 4. Run
yarn start           # Metro
yarn ios             # iOS simulator (requires Xcode)
yarn android         # Android emulator (requires Android Studio)
```

The app is fully functional without a backend — `src/services/api.ts`
falls back to the seed data in `src/data/coaches.ts` when no API
base URL is set.

## Key commands

| Command               | What it does                                  |
|-----------------------|-----------------------------------------------|
| `yarn start`          | Start Metro / Expo dev server                 |
| `yarn ios`            | Run on an iOS simulator                       |
| `yarn android`        | Run on an Android emulator                    |
| `yarn lint`           | ESLint                                        |
| `yarn typecheck`      | `tsc --noEmit`                                |
| `yarn test`           | Jest                                          |
| `yarn prebuild`       | Generate native iOS / Android projects        |
| `yarn build:ios`      | EAS build (production iOS)                    |
| `yarn build:android`  | EAS build (production Android)                |
| `yarn submit:ios`     | Upload latest iOS build to App Store Connect  |
| `yarn submit:android` | Upload latest Android build to Play Console   |
| `yarn ota`            | Publish an OTA update to the production channel |

## Folder layout

```
src/
  components/     Button, Screen, TextField, CoachCard, FilterChip, Logo
  data/           Local seed data (coaches.ts)
  hooks/          useAppFonts
  navigation/     RootNavigator (splash overlay + tabs + stack)
  screens/        Splash, Auth, Home, Coaches, CoachDetail, Enquiry, Account
  services/       auth, api
  theme/          colors, typography, spacing, shadow, durations
  types/          Coach, Enquiry, User
assets/
  fonts/          Playfair Display + Inter (see docs/FONTS.md)
  icons/          App icons (generated via scripts/generate-brand-assets.mjs)
  splash/         Splash PNGs
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
```

## The splash intro

- Logo centred on the brand obsidian background
- 1.5s ease-in fade + scale 0.85 → 1.0
- 1s hold
- 1.5s ease-out fade + scale 1.0 → 1.05
- Cross-fades (not a hard cut) into the next screen
- Plays on every cold launch, skippable by tap
- No spinners, no progress bars, no copy

Implementation: `src/screens/SplashScreen.tsx`. It overlays the root
navigator — the next screen mounts beneath it and the splash fades
out over the top for a seamless transition. Respects
`AccessibilityInfo.isReduceMotionEnabled()`.

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

## Accessibility

- All interactive elements declare role + label.
- Text scales with system font size.
- Splash respects Reduce Motion.
- Minimum 44×44pt hit targets.
- WCAG AA contrast on light and dark themes.

## License

© Humn Sprt Ltd. All rights reserved.
