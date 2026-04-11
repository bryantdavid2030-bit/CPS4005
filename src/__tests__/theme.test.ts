import { lightColors, darkColors, palette } from '../theme/colors';
import { typography } from '../theme/typography';
import { durations } from '../theme/spacing';

describe('theme', () => {
  it('ships both light and dark palettes with matching keys', () => {
    expect(Object.keys(lightColors).sort()).toEqual(
      Object.keys(darkColors).sort(),
    );
  });

  it('uses the obsidian brand background in dark mode', () => {
    expect(darkColors.background).toBe(palette.obsidian);
  });

  it('defines the splash intro durations from the brief', () => {
    // 1.5s in, 1.0s hold, 1.5s out
    expect(durations.splashIn).toBe(1500);
    expect(durations.splashHold).toBe(1000);
    expect(durations.splashOut).toBe(1500);
  });

  it('exposes an editorial display variant for the hero', () => {
    expect(typography.displayXL.fontSize).toBeGreaterThanOrEqual(48);
  });
});
