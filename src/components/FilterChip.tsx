import React from 'react';
import { Pressable, StyleSheet, Text } from 'react-native';
import * as Haptics from 'expo-haptics';
import { useTheme } from '@/theme';

interface FilterChipProps {
  label: string;
  active?: boolean;
  onPress?: () => void;
}

export function FilterChip({ label, active, onPress }: FilterChipProps) {
  const theme = useTheme();
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ selected: !!active }}
      onPress={() => {
        Haptics.selectionAsync().catch(() => undefined);
        onPress?.();
      }}
      style={({ pressed }) => [
        styles.chip,
        {
          borderColor: active ? theme.colors.text : theme.colors.border,
          backgroundColor: active ? theme.colors.text : 'transparent',
          opacity: pressed ? 0.85 : 1,
        },
      ]}
    >
      <Text
        style={[
          theme.typography.label,
          { color: active ? theme.colors.inverseText : theme.colors.text },
        ]}
      >
        {label}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  chip: {
    paddingHorizontal: 16,
    paddingVertical: 9,
    borderRadius: 999,
    borderWidth: StyleSheet.hairlineWidth * 2,
    marginRight: 8,
    marginBottom: 8,
  },
});
