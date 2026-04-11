import { useColorScheme } from 'react-native';
import { darkColors, lightColors, ColorScheme } from './colors';
import { typography, fonts } from './typography';
import { spacing, radius, shadow, durations } from './spacing';

export * from './colors';
export * from './typography';
export * from './spacing';

export interface Theme {
  colors: ColorScheme;
  typography: typeof typography;
  fonts: typeof fonts;
  spacing: typeof spacing;
  radius: typeof radius;
  shadow: typeof shadow;
  durations: typeof durations;
  isDark: boolean;
}

export function useTheme(): Theme {
  const scheme = useColorScheme();
  const isDark = scheme === 'dark';
  return {
    colors: isDark ? darkColors : lightColors,
    typography,
    fonts,
    spacing,
    radius,
    shadow,
    durations,
    isDark,
  };
}
