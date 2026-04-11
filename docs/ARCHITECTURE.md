# Architecture

## Stack

| Layer          | Choice                            | Why                                                             |
|----------------|-----------------------------------|-----------------------------------------------------------------|
| Runtime        | Expo SDK 51, React Native 0.74    | OTA updates, unified iOS + Android toolchain, managed workflow. |
| Language       | TypeScript (strict)               | Safety and documentation at the type level.                    |
| Navigation     | React Navigation (native stack + tabs) | Native-feel transitions, mature ecosystem, platform conventions. |
| State          | React hooks + Context             | No global store needed at this size; easy to scale later.      |
| Data fetching  | Plain `fetch` with a tiny service layer | Zero dependency lock-in; swap for React Query when the API lands. |
| Animation      | react-native-reanimated (v3)      | 60+ fps animations on the UI thread, required for the splash intro. |
| Styling        | StyleSheet + theme tokens         | Deterministic, no runtime cost.                                |
| Monitoring     | Sentry (native + JS)              | Crashes, performance, source-mapped stack traces.              |
| Updates        | Expo Updates (EAS Update)         | OTA for content and UI fixes without a store round-trip.       |
| CI/CD          | GitHub Actions + EAS + Fastlane   | GitHub for orchestration, EAS for cloud builds, Fastlane for store mechanics. |

## Folder layout

```
src/
  components/   Reusable presentational primitives (Button, Screen, ...)
  data/         Seed / offline content (coaches.ts)
  hooks/        Reusable logic (useAppFonts)
  navigation/   RootNavigator, stacks and tabs
  screens/      One file per top-level screen
  services/     auth, api — anything that talks to the outside world
  theme/        Design tokens: colors, typography, spacing
  types/        Shared TypeScript interfaces
```

## Key decisions

### 1. Custom animated splash on top of the native splash
The native Expo splash is used as a crash-safe fallback while the JS
bundle loads. As soon as fonts are loaded, a **React-based** splash
component takes over and plays the fade + scale sequence described in
the brief. This lets us cross-fade straight into the next screen —
the auth screen mounts beneath the splash, and the splash fades out
over the top for a seamless transition with no hard cut.

See: `src/screens/SplashScreen.tsx` and the overlay in
`src/navigation/RootNavigator.tsx`.

### 2. Theme is a hook, not a context
`useTheme()` reads `Appearance` directly. There's no provider to wire
up, no re-renders on unrelated state changes, and dark mode responds
immediately to system changes. Tokens are fully typed.

### 3. Offline-first data layer
`src/services/api.ts` falls back to the bundled `src/data/coaches.ts`
if no `EXPO_PUBLIC_API_BASE` is set. This means the app is always
demonstrable without a backend — useful for App Store review,
storefront screenshots, and Fastlane screenshot runs.

### 4. Accessibility
- All interactive elements declare `accessibilityRole` and a meaningful
  `accessibilityLabel`.
- Text scales with system font size (no hard-coded `allowFontScaling={false}`).
- The splash intro respects `AccessibilityInfo.isReduceMotionEnabled()`
  and collapses to a short fade.
- Minimum hit target of 44×44pt on all buttons.
- Contrast ratios on text meet WCAG AA against both themes.

### 5. Motion
Animations use reanimated's worklet runtime so they don't drop frames
under JS load. Timings come from `theme.durations` so they stay
consistent across the app. The brief's fade + scale numbers
(1.5s / 1s / 1.5s, 0.85→1.0→1.05) live as typed constants in
`src/theme/spacing.ts`.

### 6. No single-use abstractions
Button, Screen and TextField are the only presentational primitives.
Each screen composes them directly. We deliberately don't layer a
"design system" of screens on top — the screens are the design system.

## Environments

| Env         | Backend                            | Sentry project      | EAS channel    |
|-------------|------------------------------------|---------------------|----------------|
| development | mock / local                       | humnsprt-mobile-dev | `development`  |
| preview     | staging.humnsprt.com               | humnsprt-mobile     | `preview`      |
| production  | api.humnsprt.com                   | humnsprt-mobile     | `production`   |

## OTA vs native builds

Ship an OTA update (`yarn ota`) for:
- Copy changes
- Non-native bug fixes
- Content updates
- JS-only feature flags

Ship a native build (`yarn build:ios` / `yarn build:android`) for:
- Native module upgrades
- SDK version bumps
- App icon / splash / entitlement changes
- Anything that changes `app.config.ts` keys that require rebuilds
