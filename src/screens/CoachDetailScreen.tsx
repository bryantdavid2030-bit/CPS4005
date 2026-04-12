import React from 'react';
import { Image, Pressable, Share, StyleSheet, Text, View } from 'react-native';
import Animated, { FadeIn, FadeInDown } from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';
import { Screen } from '@/components/Screen';
import { Button } from '@/components/Button';
import { FavouriteButton } from '@/components/FavouriteButton';
import { useTheme } from '@/theme';
import type { Coach } from '@/types';

interface CoachDetailScreenProps {
  coach: Coach;
  onBack: () => void;
  onEnquire: (coach: Coach) => void;
}

export function CoachDetailScreen({ coach, onBack, onEnquire }: CoachDetailScreenProps) {
  const theme = useTheme();

  const handleShare = async () => {
    try {
      await Share.share({
        message: `${coach.name} — ${coach.discipline} coach. ${coach.headline}. View on Humn Sprt.`,
      });
    } catch {
      // User cancelled or share failed — no action needed.
    }
  };

  return (
    <Screen scroll padded={false}>
      <View style={{ height: 520, backgroundColor: theme.colors.surfaceAlt }}>
        {coach.portrait ? (
          <Image source={{ uri: coach.portrait }} style={styles.hero} resizeMode="cover" />
        ) : (
          <View style={[styles.hero, styles.portraitPlaceholder]}>
            <Text
              style={[
                theme.typography.displayXL,
                { color: theme.colors.textSubtle, opacity: 0.3 },
              ]}
            >
              {coach.name.charAt(0)}
            </Text>
          </View>
        )}
        <View style={styles.headerActions}>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Back"
            onPress={onBack}
            style={[styles.circleBtn, { backgroundColor: theme.colors.background }]}
          >
            <Ionicons name="chevron-back" size={22} color={theme.colors.text} />
          </Pressable>
          <View style={styles.headerRight}>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Share coach profile"
              onPress={handleShare}
              style={[styles.circleBtn, { backgroundColor: theme.colors.background }]}
            >
              <Ionicons name="share-outline" size={20} color={theme.colors.text} />
            </Pressable>
            <View
              style={[
                styles.circleBtn,
                { backgroundColor: theme.colors.background, marginLeft: 10 },
              ]}
            >
              <FavouriteButton coachId={coach.id} size={20} />
            </View>
          </View>
        </View>
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

        {/* Availability badge */}
        <View style={[styles.availBadge, { borderColor: theme.colors.border }]}>
          <View
            style={[
              styles.availDot,
              {
                backgroundColor:
                  coach.availability === 'Available'
                    ? theme.colors.success
                    : coach.availability === 'Limited'
                      ? theme.colors.accent
                      : theme.colors.textSubtle,
              },
            ]}
          />
          <Text style={[theme.typography.label, { color: theme.colors.text }]}>
            {coach.availability}
          </Text>
        </View>

        <View style={styles.meta}>
          {coach.baseRate ? <Meta label="Starting from" value={coach.baseRate} /> : null}
          <Meta label="Languages" value={coach.languages.join(' · ')} />
        </View>

        <Animated.View entering={FadeInDown.duration(500).delay(100)}>
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
        </Animated.View>

        <Animated.View entering={FadeInDown.duration(500).delay(200)}>
          <Text
            style={[
              theme.typography.eyebrow,
              {
                color: theme.colors.textMuted,
                marginTop: theme.spacing.xxl,
                marginBottom: theme.spacing.md,
              },
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
        </Animated.View>

        <View style={{ height: theme.spacing.huge }} />
        <Button label="Enquire about availability" onPress={() => onEnquire(coach)} />
        <View style={{ height: theme.spacing.md }} />
        <Button label="Share profile" variant="secondary" onPress={handleShare} />
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
  portraitPlaceholder: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerActions: {
    position: 'absolute',
    top: 52,
    left: 20,
    right: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerRight: { flexDirection: 'row', alignItems: 'center' },
  circleBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  availBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 999,
    borderWidth: StyleSheet.hairlineWidth * 2,
    marginTop: 16,
  },
  availDot: { width: 6, height: 6, borderRadius: 3, marginRight: 8 },
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
