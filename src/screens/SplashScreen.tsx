import React, { useEffect, useCallback } from 'react';
import { Pressable, StyleSheet, View, AccessibilityInfo } from 'react-native';
import Animated, {
  Easing,
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withSequence,
  withTiming,
} from 'react-native-reanimated';
import { useTheme } from '@/theme';
import { Logo } from '@/components/Logo';

interface SplashScreenProps {
  onFinish: () => void;
}

/**
 * Brand intro.
 *
 * Sequence:
 *   1. Logo fades in (1.5s ease-in) and scales 0.85 -> 1.0
 *   2. Holds 1.0s
 *   3. Fades out (1.5s ease-out) and scales 1.0 -> 1.05
 *   4. onFinish() fires so the root navigator can cross-fade into auth
 *
 * Tap anywhere to skip. Respects "Reduce Motion" by collapsing
 * animations to a single fast fade.
 */
export function SplashScreen({ onFinish }: SplashScreenProps) {
  const theme = useTheme();

  const opacity = useSharedValue(0);
  const scale = useSharedValue(0.85);
  const bgOpacity = useSharedValue(1);

  const finish = useCallback(() => {
    onFinish();
  }, [onFinish]);

  useEffect(() => {
    let cancelled = false;
    AccessibilityInfo.isReduceMotionEnabled().then((reduce) => {
      if (cancelled) return;

      if (reduce) {
        opacity.value = withSequence(
          withTiming(1, { duration: 400 }),
          withDelay(600, withTiming(0, { duration: 400 }, (fin) => {
            if (fin) runOnJS(finish)();
          })),
        );
        return;
      }

      // Entrance
      opacity.value = withTiming(1, {
        duration: theme.durations.splashIn,
        easing: Easing.in(Easing.cubic),
      });
      scale.value = withTiming(1, {
        duration: theme.durations.splashIn,
        easing: Easing.out(Easing.cubic),
      });

      // Hold then exit
      const exitDelay = theme.durations.splashIn + theme.durations.splashHold;
      opacity.value = withDelay(
        exitDelay,
        withTiming(
          0,
          {
            duration: theme.durations.splashOut,
            easing: Easing.out(Easing.cubic),
          },
          (fin) => {
            if (fin) runOnJS(finish)();
          },
        ),
      );
      scale.value = withDelay(
        exitDelay,
        withTiming(1.05, {
          duration: theme.durations.splashOut,
          easing: Easing.out(Easing.cubic),
        }),
      );
      // Background holds solid until slightly after logo is gone —
      // the next screen cross-fades under it for a seamless transition.
      bgOpacity.value = withDelay(
        exitDelay + theme.durations.splashOut - 200,
        withTiming(0, { duration: 400, easing: Easing.out(Easing.cubic) }),
      );
    });
    return () => {
      cancelled = true;
    };
  }, [opacity, scale, bgOpacity, theme.durations, finish]);

  const logoStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ scale: scale.value }],
  }));

  const bgStyle = useAnimatedStyle(() => ({
    opacity: bgOpacity.value,
  }));

  return (
    <Animated.View
      pointerEvents="box-only"
      style={[StyleSheet.absoluteFill, { backgroundColor: theme.colors.inverse }, bgStyle]}
    >
      <Pressable
        onPress={finish}
        accessibilityLabel="Skip intro"
        accessibilityRole="button"
        style={styles.pressable}
      >
        <View style={styles.center}>
          <Animated.View style={logoStyle}>
            <Logo size={86} color={theme.colors.inverseText} />
          </Animated.View>
        </View>
      </Pressable>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  pressable: { flex: 1 },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
});
