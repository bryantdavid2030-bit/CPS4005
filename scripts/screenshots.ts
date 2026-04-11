/**
 * Screenshot scenarios.
 *
 * Declares the five hero screens that Fastlane `snapshot` (iOS) and
 * `screengrab` (Android) capture for every supported device. The
 * native UI tests in `ios/humnsprtUITests/` and
 * `android/app/src/androidTest/` read this manifest at build time via
 * a codegen step so the ordering and labels stay in one place.
 *
 * Update this file when adding or reordering store screenshots.
 */

export interface ScreenshotScene {
  id: string;
  name: string;
  /** Deep-link path that `scripts/screenshots-driver.ts` navigates to */
  path: string;
  /** Localisation bundle key for the status-bar overlay caption */
  captionKey: string;
}

export const SCENES: ScreenshotScene[] = [
  {
    id: '01-splash',
    name: 'Brand intro',
    path: 'humnsprt://splash',
    captionKey: 'screenshots.splash',
  },
  {
    id: '02-home',
    name: 'Home hero',
    path: 'humnsprt://',
    captionKey: 'screenshots.home',
  },
  {
    id: '03-roster',
    name: 'Roster with filters',
    path: 'humnsprt://roster?filter=performance',
    captionKey: 'screenshots.roster',
  },
  {
    id: '04-coach-detail',
    name: 'Coach profile',
    path: 'humnsprt://coach/c-001',
    captionKey: 'screenshots.coach',
  },
  {
    id: '05-enquiry',
    name: 'Concierge enquiry',
    path: 'humnsprt://enquiry?type=concierge',
    captionKey: 'screenshots.enquiry',
  },
];

export default SCENES;
