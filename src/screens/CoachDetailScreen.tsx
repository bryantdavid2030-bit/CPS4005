import React from 'react';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
import Animated, { FadeIn } from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';
import { Screen } from '@/components/Screen';
import { Button } from '@/components/Button';
import { useTheme } from '@/theme';
import type { Coach } from '@/types';

interface CoachDetailScreenProps {
  coach: Coach;
  onBack: () => void;
  onEnquire: (coach: Coach) => void;
}

export function CoachDetailScreen({ coach, onBack, onEnquire }: CoachDetailScreenProps) {
  const theme = useTheme();

  return (
    <Screen scroll padded={false}>
      <View style={{ height: 520, backgroundColor: theme.colors.surfaceAlt }}>
        {coach.portrait ? (
          <Image source={{ uri: coach.portrait }} style={styles.hero} resizeMode="cover" />
        ) : null}
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Back"
          onPress={onBack}
          style={[styles.backBtn, { backgroundColor: theme.colors.background }]}
        >
          <Ionicons name="chevron-back" size={22} color={theme.colors.text} />
        </Pressable>
      </View>

      <Animated.View
        entering={FadeIn.duration(500)}
        style={{ paddingHorizontal: theme.spacing.screen, paddingTop: theme.spacing.xl }}
      >
        <Text style={[theme.typography.eyebrow, { color: theme.colors.accent }]}>
          {coach.discipline}
        </Text>
        <Text
          style={[
            theme.typography.displayL,
            { color: theme.colors.text, marginTop: theme.spacing.sm },
          ]}
        >
          {coach.name}
        </Text>
        <Text
          style={[
            theme.typography.bodyL,
            { color: theme.colors.textMuted, marginTop: theme.spacing.sm },
          ]}
        >
          {coach.location}
        </Text>

        <View style={styles.meta}>
          <Meta label="Availability" value={coach.availability} />
          {coach.baseRate ? <Meta label="From" value={coach.baseRate} /> : null}
          <Meta label="Languages" value={coach.languages.join(' · ')} />
        </View>

        <Text
          style={[
            theme.typography.displayS,
            { color: theme.colors.text, marginTop: theme.spacing.xxl },
          ]}
        >
          {coach.headline}
        </Text>
        <Text
          style={[
            theme.typography.bodyL,
            { color: theme.colors.textMuted, marginTop: theme.spacing.md, lineHeight: 28 },
          ]}
        >
          {coach.bio}
        </Text>

        <Text
          style={[
            theme.typography.eyebrow,
            { color: theme.colors.textMuted, marginTop: theme.spacing.xxl, marginBottom: theme.spacing.md },
          ]}
        >
          Specialties
        </Text>
        {coach.specialties.map((s) => (
          <View key={s} style={styles.specialtyRow}>
            <View style={[styles.dot, { backgroundColor: theme.colors.accent }]} />
            <Text style={[theme.typography.body, { color: theme.colors.text }]}>{s}</Text>
          </View>
        ))}

        <View style={{ height: theme.spacing.huge }} />
        <Button label="Enquire about availability" onPress={() => onEnquire(coach)} />
        <View style={{ height: theme.spacing.xxxl }} />
      </Animated.View>
    </Screen>
  );
}

function Meta({ label, value }: { label: string; value: string }) {
  const theme = useTheme();
  return (
    <View style={{ marginRight: 24, marginTop: 16 }}>
      <Text style={[theme.typography.caption, { color: theme.colors.textSubtle }]}>
        {label.toUpperCase()}
      </Text>
      <Text
        style={[
          theme.typography.body,
          { color: theme.colors.text, marginTop: 4 },
        ]}
      >
        {value}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  hero: { width: '100%', height: '100%' },
  backBtn: {
    position: 'absolute',
    top: 52,
    left: 20,
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  meta: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  specialtyRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  dot: { width: 4, height: 4, borderRadius: 2, marginRight: 12 },
});
