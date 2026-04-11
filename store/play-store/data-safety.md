# Google Play Data Safety form — Humn Sprt

Use these answers in Play Console > App content > Data safety.

## Does your app collect or share any of the required user data types?
**Yes** — collects, does not share with third parties beyond Sentry
(diagnostics only).

## Is all of the user data collected by your app encrypted in transit?
**Yes** (HTTPS / TLS 1.2+).

## Do you provide a way for users to request that their data be deleted?
**Yes** — users may email privacy@humnsprt.com to request deletion.
An in-app deletion flow is scheduled for a follow-up release.

## Data types collected

### Personal info
- **Name** — Collected. Purpose: App functionality. Optional: No.
- **Email address** — Collected. Purpose: App functionality. Optional: No.
- **Phone number** — Collected. Purpose: App functionality. Optional: Yes.
- **User IDs** — Collected. Purpose: App functionality. Optional: No.

### Messages
- **Other in-app messages** — Collected (enquiry message body).
  Purpose: App functionality. Optional: No.

### App activity
- **Crash logs** — Collected via Sentry. Purpose: App functionality,
  Analytics. Optional: No.
- **Diagnostics** — Collected via Sentry. Purpose: Analytics. Optional: No.
- **Other app performance data** — Collected via Sentry.

## Data types NOT collected

- Location (precise or approximate)
- Financial info
- Health & fitness
- Photos / videos (unless the user explicitly uploads one)
- Audio files
- Contacts
- Calendar
- Web browsing history
- Search history
- Installed apps
- Device or advertising IDs (we do not use ad SDKs)

## Third-party sharing
- **Sentry** (crash + performance diagnostics). Data is not linked to
  advertising identifiers and is used solely to fix bugs.
