import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { Screen } from '@/components/Screen';
import { CoachCard } from '@/components/CoachCard';
import { Button } from '@/components/Button';
import { Logo } from '@/components/Logo';
import { useTheme } from '@/theme';
import { coaches } from '@/data/coaches';
import type { Coach } from '@/types';

interface HomeScreenProps {
  onOpenCoach: (coach: Coach) => void;
  onOpenAll: () => void;
  onOpenConcierge: () => void;
}

/**
 * Landing feed. Editorial hero + featured coaches + concierge CTA +
 * disciplines overview + brand footer.
 */
export function HomeScreen({
  onOpenCoach,
  onOpenAll,
  onOpenConcierge,
}: HomeScreenProps) {
  const theme = useTheme();

  const featured = coaches.filter((c) => c.featured);

  // Unique disciplines for the overview section
  const disciplineNames = Array.from(
    new Set(coaches.map((c) => c.discipline)),
  );

  return (
    <Screen scroll>
      {/* ——— HERO ——— */}
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

      {/* ——— FEATURED ——— */}
      <Text style={[theme.typography.eyebrow, { color: theme.colors.textMuted }]}>
        Featured practitioners
      </Text>
      <View style={{ height: theme.spacing.lg }} />

      {featured.map((item, index) => (
        <Animated.View
          key={item.id}
          entering={FadeInDown.duration(600).delay(120 * index)}
        >
          <CoachCard coach={item} onPress={onOpenCoach} />
        </Animated.View>
      ))}

      {/* ——— DISCIPLINES ——— */}
      <View style={[styles.divider, { borderTopColor: theme.colors.border }]}>
        <Text style={[theme.typography.eyebrow, { color: theme.colors.accent }]}>
          Disciplines
        </Text>
        <Text
          style={[
            theme.typography.displayM,
            { color: theme.colors.text, marginTop: 10 },
          ]}
        >
          From strength to stillness.
        </Text>
        <Text
          style={[
            theme.typography.body,
            { color: theme.colors.textMuted, marginTop: 12, marginBottom: 20 },
          ]}
        >
          Every practitioner on our roster specialises in one of the
          following disciplines. Filter by any on the Roster tab.
        </Text>
        <View style={styles.disciplineGrid}>
          {disciplineNames.map((d) => (
            <View key={d} style={styles.disciplineItem}>
              <View style={[styles.dot, { backgroundColor: theme.colors.accent }]} />
              <Text style={[theme.typography.body, { color: theme.colors.text }]}>
                {d}
              </Text>
            </View>
          ))}
        </View>
        <View style={{ height: 12 }} />
        <Button label="View all coaches" variant="secondary" onPress={onOpenAll} />
      </View>

      {/* ——— CONCIERGE ——— */}
      <View style={[styles.divider, { borderTopColor: theme.colors.border }]}>
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

      {/* ——— FOOTER ——— */}
      <View style={styles.footer}>
        <Logo size={32} color={theme.colors.textSubtle} showWordmark={false} />
        <Text
          style={[
            theme.typography.caption,
            { color: theme.colors.textSubtle, marginTop: 12, textAlign: 'center' },
          ]}
        >
          Built with care. No ads. No noise.
        </Text>
      </View>

      <View style={{ height: theme.spacing.xxl }} />
    </Screen>
  );
}

const styles = StyleSheet.create({
  divider: {
    paddingVertical: 40,
    borderTopWidth: StyleSheet.hairlineWidth * 2,
    marginTop: 16,
  },
  disciplineGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  disciplineItem: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '50%',
    marginBottom: 10,
  },
  dot: { width: 4, height: 4, borderRadius: 2, marginRight: 10 },
  footer: {
    alignItems: 'center',
    paddingVertical: 48,
  },
});
