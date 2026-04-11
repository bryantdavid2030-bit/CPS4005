const { getDefaultConfig } = require('expo/metro-config');
const { getSentryExpoConfig } = require('@sentry/react-native/metro');

const config = getDefaultConfig(__dirname);

config.resolver.assetExts.push('ttf', 'otf');

module.exports = getSentryExpoConfig(__dirname, config);
