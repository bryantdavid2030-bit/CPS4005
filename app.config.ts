import { ExpoConfig, ConfigContext } from 'expo/config';

/**
 * Dynamic Expo config for Humn Sprt.
 *
 * Environment-driven values come from process.env so CI can inject
 * secrets without committing them. Signing placeholders are marked
 * REPLACE_ME and documented in docs/STORE_SUBMISSION.md.
 */
export default ({ config }: ConfigContext): ExpoConfig => ({
  ...config,
  name: 'Humn Sprt',
  slug: 'humnsprt',
  scheme: 'humnsprt',
  version: '1.0.0',
  orientation: 'portrait',
  icon: './assets/icons/icon.png',
  userInterfaceStyle: 'automatic',
  newArchEnabled: true,
  splash: {
    image: './assets/splash/splash.png',
    resizeMode: 'contain',
    backgroundColor: '#0B0B0C',
  },
  assetBundlePatterns: ['**/*'],
  ios: {
    supportsTablet: true,
    bundleIdentifier: 'com.humnsprt.app',
    buildNumber: '1',
    infoPlist: {
      ITSAppUsesNonExemptEncryption: false,
      NSCameraUsageDescription:
        'Humn Sprt uses the camera so you can upload a profile photo.',
      NSPhotoLibraryUsageDescription:
        'Humn Sprt uses your photo library so you can upload a profile photo.',
      UIBackgroundModes: [],
    },
    config: {
      usesNonExemptEncryption: false,
    },
  },
  android: {
    package: 'com.humnsprt.app',
    versionCode: 1,
    adaptiveIcon: {
      foregroundImage: './assets/icons/adaptive-icon.png',
      backgroundColor: '#0B0B0C',
    },
    permissions: ['INTERNET'],
  },
  web: {
    bundler: 'metro',
    favicon: './assets/icons/favicon.png',
  },
  plugins: [
    'expo-font',
    [
      'expo-splash-screen',
      {
        image: './assets/splash/splash.png',
        backgroundColor: '#0B0B0C',
        imageWidth: 200,
      },
    ],
    [
      '@sentry/react-native/expo',
      {
        organization: process.env.SENTRY_ORG ?? 'humnsprt',
        project: process.env.SENTRY_PROJECT ?? 'humnsprt-mobile',
      },
    ],
  ],
  updates: {
    url: 'https://u.expo.dev/REPLACE_ME_PROJECT_ID',
    fallbackToCacheTimeout: 0,
  },
  runtimeVersion: {
    policy: 'appVersion',
  },
  extra: {
    eas: {
      projectId: 'REPLACE_ME_EAS_PROJECT_ID',
    },
    sentryDsn: process.env.SENTRY_DSN ?? '',
  },
  owner: 'humnsprt',
});
