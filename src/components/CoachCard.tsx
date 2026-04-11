import React from 'react';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { useTheme } from '@/theme';
import type { Coach } from '@/types';

interface CoachCardProps {
  coach: Coach;
  onPress?: (coach: Coach) => void;
  compact?: boolean;
}

/**
 * Editorial coach card. Full-bleed portrait image, discipline eyebrow,
 * name as display serif, and location as muted body text.
 */
export function CoachCard({ coach, onPress, compact }: CoachCardProps) {
  const theme = useTheme();
  const height = compact ? 260 : 440;

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={`View ${coach.name}, ${coach.discipline} coach`}
      onPress={() => onPress?.(coach)}
      style={({ pressed }) => [
        styles.card,
        { opacity: pressed ? 0.92 : 1, marginBottom: theme.spacing.xxl },
      ]}
    >
      <View style={[styles.imageWrap, { height, backgroundColor: theme.colors.surfaceAlt }]}>
        {coach.portrait ? (
          <Image source={{ uri: coach.portrait }} style={styles.image} resizeMode="cover" />
        ) : null}
      </View>
      <View style={{ marginTop: theme.spacing.lg }}>
        <Text style={[theme.typography.eyebrow, { color: theme.colors.accent }]}>
          {coach.discipline}
        </Text>
        <Text
          style={[
            theme.typography.displayS,
            { color: theme.colors.text, marginTop: theme.spacing.sm },
          ]}
        >
          {coach.name}
        </Text>
        <Text
          style={[
            theme.typography.body,
            { color: theme.colors.textMuted, marginTop: theme.spacing.xs },
          ]}
          numberOfLines={2}
        >
          {coach.location} · {coach.headline}
        </Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: { width: '100%' },
  imageWrap: { width: '100%', overflow: 'hidden' },
  image: { width: '100%', height: '100%' },
});
