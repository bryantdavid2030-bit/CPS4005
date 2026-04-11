# Store submission checklist

## Pre-flight (both stores)

- [ ] Update `version` in `app.config.ts` (semver).
- [ ] Bump `ios.buildNumber` and `android.versionCode`.
- [ ] Run `yarn lint && yarn typecheck && yarn test`.
- [ ] Smoke test on a physical iOS device and a physical Android device.
- [ ] Verify splash intro plays correctly on a cold launch.
- [ ] Verify Reduce Motion path on iOS Settings > Accessibility.
- [ ] Regenerate screenshots: `bundle exec fastlane ios screenshots`
      and `bundle exec fastlane android screenshots`.
- [ ] Confirm the correct Sentry DSN in `.env` / CI secrets.

## Apple App Store

### Signing placeholders

Replace in `app.config.ts` and `eas.json`:

- `ios.bundleIdentifier` → `com.humnsprt.app` (already set)
- Apple Team ID → `REPLACE_ME_TEAM_ID` in `eas.json` and `fastlane/Appfile`
- App Store Connect App ID → `REPLACE_ME_ASC_APP_ID` in `eas.json`
- `apple_id` → a real App Store Connect user email

### Steps

1. Create the app in App Store Connect
   (Apps > New App, bundle id `com.humnsprt.app`).
2. In EAS:
   ```bash
   eas credentials
   ```
   Let EAS manage the distribution certificate and provisioning
   profile, or supply your own via `match`.
3. Build:
   ```bash
   yarn build:ios
   ```
4. Submit:
   ```bash
   yarn submit:ios
   ```
5. Fill in App Store Connect metadata from
   `store/app-store/metadata.md`.
6. Fill in **App Privacy** from
   `store/app-store/privacy-nutrition-label.md`.
7. Upload screenshots from `store/screenshots/ios` or let Fastlane
   `deliver` handle it.
8. Submit for review.

### Review notes
- Include the demo account from `store/app-store/metadata.md`.
- Mention the intro screen is skippable by tap.

## Google Play

### Signing placeholders

- `android.package` → `com.humnsprt.app` (already set)
- Upload key → supply via `eas credentials` or `android/app/upload-key.jks`
- Service account JSON → `./secrets/play-service-account.json`
  (referenced from `eas.json` and `fastlane/Appfile`)

### Target SDK & compliance

Expo SDK 51 targets Android 14 (API level 34), which satisfies the
Play Store policy as of the next submission window. If Google raises
the minimum, bump Expo and run `yarn prebuild`.

### Steps

1. Create the app in Play Console (Internal app sharing fine for first
   build).
2. Generate upload key and configure signing:
   ```bash
   eas credentials
   ```
3. Build:
   ```bash
   yarn build:android
   ```
4. Upload the AAB to the internal track:
   ```bash
   yarn submit:android
   ```
5. Fill in Play Console listing from
   `store/play-store/metadata.md`.
6. Fill in **Data safety** from `store/play-store/data-safety.md`.
7. Upload screenshots + feature graphic from
   `store/screenshots/android` / `assets/store/feature-graphic.png`.
8. Promote from internal → closed → open → production as needed.

## Placeholders to replace before first release

Search the repo for `REPLACE_ME` and fill each site in:

- `app.config.ts` (`updates.url`, `extra.eas.projectId`)
- `eas.json` (`submit.production.ios.*`)
- `fastlane/Appfile`
- `fastlane/Matchfile`
- `.env`

## Privacy policy & terms

Placeholders live at `docs/legal/PRIVACY.md` and `docs/legal/TERMS.md`.
The in-app Account screen links to the hosted versions at
`https://humnsprt.com/privacy` and `/terms`. Keep both in sync.
