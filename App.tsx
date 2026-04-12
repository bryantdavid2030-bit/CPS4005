import React, { useEffect } from 'react';
import { ActivityIndicator, View } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import * as ExpoSplash from 'expo-splash-screen';
import * as Sentry from '@sentry/react-native';
import Constants from 'expo-constants';
import { AuthProvider } from '@/services/auth';
import { FavouritesProvider } from '@/hooks/useFavourites';
import { RootNavigator } from '@/navigation/RootNavigator';
import { useAppFonts } from '@/hooks/useAppFonts';
import { useTheme } from '@/theme';

// Keep the native splash visible until our JS is ready — our custom
// animated intro screen takes over the moment the tree mounts.
ExpoSplash.preventAutoHideAsync().catch(() => undefined);

const sentryDsn = Constants.expoConfig?.extra?.sentryDsn as string | undefined;
if (sentryDsn) {
  Sentry.init({
    dsn: sentryDsn,
    tracesSampleRate: 0.2,
    enableAutoPerformanceTracing: true,
    enableNative: true,
  });
}

function Root() {
  const { loaded } = useAppFonts();
  const theme = useTheme();

  useEffect(() => {
    if (loaded) ExpoSplash.hideAsync().catch(() => undefined);
  }, [loaded]);

  if (!loaded) {
    return (
      <View
        style={{
          flex: 1,
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: theme.colors.inverse,
        }}
      >
        <ActivityIndicator color={theme.colors.inverseText} />
      </View>
    );
  }

  return (
    <AuthProvider>
      <FavouritesProvider>
        <RootNavigator />
      </FavouritesProvider>
    </AuthProvider>
  );
}

function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <Root />
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}

export default sentryDsn ? Sentry.wrap(App) : App;
