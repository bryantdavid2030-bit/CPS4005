import * as Font from 'expo-font';
import { useEffect, useState } from 'react';

/**
 * Loads brand fonts from `assets/fonts`. Drop the referenced .ttf files
 * into that directory before the first native build.
 *
 * See docs/FONTS.md for license notes on Playfair Display and Inter
 * (both SIL OFL / free for commercial use).
 */
export function useAppFonts() {
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        await Font.loadAsync({
          'PlayfairDisplay-Regular': require('../../assets/fonts/PlayfairDisplay-Regular.ttf'),
          'PlayfairDisplay-Medium': require('../../assets/fonts/PlayfairDisplay-Medium.ttf'),
          'PlayfairDisplay-Italic': require('../../assets/fonts/PlayfairDisplay-Italic.ttf'),
          'Inter-Light': require('../../assets/fonts/Inter-Light.ttf'),
          'Inter-Regular': require('../../assets/fonts/Inter-Regular.ttf'),
          'Inter-Medium': require('../../assets/fonts/Inter-Medium.ttf'),
          'Inter-SemiBold': require('../../assets/fonts/Inter-SemiBold.ttf'),
        });
        if (mounted) setLoaded(true);
      } catch (e) {
        // Graceful degradation: if fonts can't be loaded (e.g. files
        // missing in a fresh clone), still render the app with system
        // fonts at the same point sizes. The error is surfaced so CI
        // can warn, but the UI remains accessible.
        if (mounted) {
          setError(e as Error);
          setLoaded(true);
        }
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  return { loaded, error };
}
