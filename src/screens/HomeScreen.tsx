import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { Screen } from '@/components/Screen';
import { CoachCard } from '@/components/CoachCard';
import { Button } from '@/components/Button';
import { useTheme } from '@/theme';
import { coaches } from '@/data/coaches';
import type { Coach } from '@/types';

interface HomeScreenProps {
  onOpenCoach: (coach: Coach) => void;
  onOpenAll: () => void;
  onOpenConcierge: () => void;
}

/**
 * Landing feed. Editorial hero + featured coaches + concierge CTA.
 */
export function HomeScreen({ onOpenCoach, onOpenAll, onOpenConcierge }: HomeScreenProps) {
  const theme = useTheme();

  const featured = coaches.filter((c) => c.featured);

  return (
    <Screen scroll>
      <Animated.View entering={FadeInDown.duration(700)} style={{ marginTop: 16 }}>
        <Text style={[theme.typography.eyebrow, { color: theme.colors.accent }]}>
          Humn Sprt · Curated
        </Text>
        <Text
          style={[
            theme.typography.displayXL,
            { color: theme.colors.text, marginTop: theme.spacing.md },
          ]}
        >
          Human{'\n'}performance.{'\n'}On request.
        </Text>
        <Text
          style={[
            theme.typography.bodyL,
            {
              color: theme.colors.textMuted,
              marginTop: theme.spacing.lg,
              marginBottom: theme.spacing.xl,
            },
          ]}
        >
          A private listing of the world's most sought-after coaches and
          movement specialists. Retained by hotel concierges, family
          offices, and corporations.
        </Text>
        <Button label="Browse the roster" variant="secondary" onPress={onOpenAll} />
      </Animated.View>

      <View style={{ height: theme.spacing.huge }} />

      <Text style={[theme.typography.eyebrow, { color: theme.colors.textMuted }]}>
        Featured practitioners
      </Text>
      <View style={{ height: theme.spacing.lg }} />

      {/* Nested FlatList inside a ScrollView triggers a RN warning and
          virtualisation is wasted here — the featured list is small and
          already inside a scroll container, so render with .map(). */}
      {featured.map((item, index) => (
        <Animated.View
          key={item.id}
          entering={FadeInDown.duration(600).delay(120 * index)}
        >
          <CoachCard coach={item} onPress={onOpenCoach} />
        </Animated.View>
      ))}

      <View style={styles.conciergeCard}>
        <Text style={[theme.typography.eyebrow, { color: theme.colors.accent }]}>
          For concierges & corporates
        </Text>
        <Text
          style={[
            theme.typography.displayM,
            { color: theme.colors.text, marginTop: 10 },
          ]}
        >
          A dedicated line for institutional bookings.
        </Text>
        <Text
          style={[
            theme.typography.body,
            { color: theme.colors.textMuted, marginTop: 12, marginBottom: 24 },
          ]}
        >
          Hotel, residence and corporate engagements handled by our
          concierge desk. Single or multi-week programmes across Europe,
          the Middle East and the US.
        </Text>
        <Button label="Speak to concierge" onPress={onOpenConcierge} />
      </View>

      <View style={{ height: theme.spacing.xxxl }} />
    </Screen>
  );
}

const styles = StyleSheet.create({
  conciergeCard: {
    paddingVertical: 40,
    borderTopWidth: StyleSheet.hairlineWidth * 2,
    borderTopColor: 'rgba(0,0,0,0.1)',
    marginTop: 16,
  },
});
