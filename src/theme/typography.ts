import { TextStyle } from 'react-native';

/**
 * Typography pairs a high-contrast display serif (editorial feel)
 * with a geometric sans for UI copy. Font files are loaded via
 * expo-font in src/hooks/useAppFonts.ts.
 */
export const fonts = {
  displayRegular: 'PlayfairDisplay-Regular',
  displayMedium: 'PlayfairDisplay-Medium',
  displayItalic: 'PlayfairDisplay-Italic',
  sansLight: 'Inter-Light',
  sansRegular: 'Inter-Regular',
  sansMedium: 'Inter-Medium',
  sansSemibold: 'Inter-SemiBold',
  monoRegular: 'JetBrainsMono-Regular',
} as const;

type Variant = TextStyle & { fontFamily: string };

export const typography: Record<string, Variant> = {
  displayXL: {
    fontFamily: fonts.displayRegular,
    fontSize: 52,
    lineHeight: 56,
    letterSpacing: -0.8,
  },
  displayL: {
    fontFamily: fonts.displayRegular,
    fontSize: 40,
    lineHeight: 44,
    letterSpacing: -0.6,
  },
  displayM: {
    fontFamily: fonts.displayRegular,
    fontSize: 30,
    lineHeight: 34,
    letterSpacing: -0.4,
  },
  displayS: {
    fontFamily: fonts.displayRegular,
    fontSize: 22,
    lineHeight: 28,
    letterSpacing: -0.2,
  },
  eyebrow: {
    fontFamily: fonts.sansMedium,
    fontSize: 11,
    lineHeight: 14,
    letterSpacing: 2.4,
    textTransform: 'uppercase',
  },
  bodyL: {
    fontFamily: fonts.sansRegular,
    fontSize: 17,
    lineHeight: 26,
  },
  body: {
    fontFamily: fonts.sansRegular,
    fontSize: 15,
    lineHeight: 22,
  },
  bodyS: {
    fontFamily: fonts.sansRegular,
    fontSize: 13,
    lineHeight: 18,
  },
  label: {
    fontFamily: fonts.sansMedium,
    fontSize: 13,
    lineHeight: 16,
    letterSpacing: 0.4,
  },
  button: {
    fontFamily: fonts.sansMedium,
    fontSize: 14,
    lineHeight: 18,
    letterSpacing: 1.6,
    textTransform: 'uppercase',
  },
  caption: {
    fontFamily: fonts.sansRegular,
    fontSize: 11,
    lineHeight: 14,
    letterSpacing: 0.2,
  },
};
