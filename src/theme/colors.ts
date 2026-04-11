/**
 * Humn Sprt palette.
 *
 * The brand leans on a deep near-black ("obsidian") and a warm off-white
 * ("bone"). An ember accent is reserved for interactive highlights and
 * is used sparingly to preserve the luxurious, minimal feel.
 */
export const palette = {
  obsidian: '#0B0B0C',
  charcoal: '#17181A',
  graphite: '#2A2B2E',
  smoke: '#55565A',
  mist: '#A7A8AC',
  bone: '#F4F1EA',
  ivory: '#FAF8F3',
  ember: '#C8A96A', // muted gold accent
  emberSoft: '#E4CFA1',
  sage: '#6E7A5F',
  error: '#B3382C',
  success: '#4E6B4A',
} as const;

export const lightColors = {
  background: palette.ivory,
  surface: palette.bone,
  surfaceAlt: '#EEEAE1',
  text: palette.obsidian,
  textMuted: palette.smoke,
  textSubtle: palette.mist,
  border: '#E3DED3',
  accent: palette.ember,
  accentSoft: palette.emberSoft,
  inverse: palette.obsidian,
  inverseText: palette.ivory,
  error: palette.error,
  success: palette.success,
} as const;

export const darkColors = {
  background: palette.obsidian,
  surface: palette.charcoal,
  surfaceAlt: palette.graphite,
  text: palette.ivory,
  textMuted: palette.mist,
  textSubtle: palette.smoke,
  border: '#2A2B2E',
  accent: palette.ember,
  accentSoft: palette.emberSoft,
  inverse: palette.ivory,
  inverseText: palette.obsidian,
  error: palette.error,
  success: palette.success,
} as const;

export type ColorScheme = typeof lightColors;
