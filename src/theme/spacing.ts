/**
 * A 4-pt spacing scale. Screens use generous outer padding
 * (`screen`) and tight inner rhythm for a calm, editorial feel.
 */
export const spacing = {
  none: 0,
  xxs: 2,
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  xxl: 32,
  xxxl: 48,
  huge: 64,
  screen: 28,
} as const;

export const radius = {
  none: 0,
  xs: 2,
  sm: 4,
  md: 8,
  lg: 14,
  xl: 20,
  pill: 999,
} as const;

export const shadow = {
  card: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.08,
    shadowRadius: 20,
    elevation: 4,
  },
  lifted: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.14,
    shadowRadius: 32,
    elevation: 10,
  },
} as const;

export const durations = {
  fast: 160,
  base: 240,
  slow: 420,
  splashIn: 1500,
  splashHold: 1000,
  splashOut: 1500,
} as const;
