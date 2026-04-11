import React, { ReactNode } from 'react';
import { StyleSheet, View, ScrollView, ViewStyle } from 'react-native';
import { SafeAreaView, Edge } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { useTheme } from '@/theme';

interface ScreenProps {
  children: ReactNode;
  scroll?: boolean;
  padded?: boolean;
  contentStyle?: ViewStyle;
  edges?: Edge[];
  background?: 'default' | 'surface' | 'inverse';
}

/**
 * Base screen wrapper. Handles safe area, status bar, scroll, and
 * consistent horizontal padding. Prefer this over ad-hoc containers.
 */
export function Screen({
  children,
  scroll = false,
  padded = true,
  contentStyle,
  edges = ['top', 'bottom'],
  background = 'default',
}: ScreenProps) {
  const theme = useTheme();

  const bg =
    background === 'inverse'
      ? theme.colors.inverse
      : background === 'surface'
        ? theme.colors.surface
        : theme.colors.background;

  const inner = (
    <View
      style={[
        // Inside a ScrollView we don't want `flex: 1` on the content
        // wrapper — it pins the content to the viewport height and
        // stops it from scrolling. Let it size to its children.
        scroll ? styles.innerScroll : styles.inner,
        padded && { paddingHorizontal: theme.spacing.screen },
        contentStyle,
      ]}
    >
      {children}
    </View>
  );

  return (
    <SafeAreaView edges={edges} style={[styles.root, { backgroundColor: bg }]}>
      <StatusBar style={background === 'inverse' || theme.isDark ? 'light' : 'dark'} />
      {scroll ? (
        <ScrollView
          contentContainerStyle={styles.scroll}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {inner}
        </ScrollView>
      ) : (
        inner
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  scroll: { flexGrow: 1 },
  inner: { flex: 1 },
  innerScroll: {},
});
