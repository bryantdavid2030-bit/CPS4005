import React from 'react';
import { Linking, StyleSheet, Text, View } from 'react-native';
import Animated, { FadeIn } from 'react-native-reanimated';
import { Screen } from '@/components/Screen';
import { Logo } from '@/components/Logo';
import { Button } from '@/components/Button';
import { useTheme } from '@/theme';
import Constants from 'expo-constants';

/**
 * Brand & mission screen. Replaces the "About" page on the web.
 * Provides brand story, mission, and links to legal pages.
 */
export function AboutScreen() {
  const theme = useTheme();

  const section = (eyebrow: string, title: string, body: string) => (
    <View style={styles.section}>
      <Text style={[theme.typography.eyebrow, { color: theme.colors.accent }]}>
        {eyebrow}
      </Text>
      <Text
        style={[
          theme.typography.displayS,
          { color: theme.colors.text, marginTop: theme.spacing.sm },
        ]}
      >
        {title}
      </Text>
      <Text
        style={[
          theme.typography.bodyL,
          {
            color: theme.colors.textMuted,
            marginTop: theme.spacing.md,
            lineHeight: 28,
          },
        ]}
      >
        {body}
      </Text>
    </View>
  );

  return (
    <Screen scroll>
      <Animated.View entering={FadeIn.duration(600)} style={styles.header}>
        <Logo size={48} color={theme.colors.text} showWordmark />
      </Animated.View>

      <Animated.View entering={FadeIn.duration(700).delay(100)}>
        <Text style={[theme.typography.eyebrow, { color: theme.colors.textMuted }]}>
          About
        </Text>
        <Text
          style={[
            theme.typography.displayL,
            { color: theme.colors.text, marginTop: theme.spacing.sm },
          ]}
        >
          The platform.
        </Text>
      </Animated.View>

      <Animated.View entering={FadeIn.duration(700).delay(200)}>
        {section(
          'Mission',
          'Human performance, curated.',
          'Humn Sprt is a private directory of the world\'s most sought-after coaches and movement specialists. We connect discerning individuals, hotel concierges, and corporations with practitioners who operate at the highest level — across strength, mobility, tennis, golf, yoga, psychology, and alpine conditioning.',
        )}

        {section(
          'For whom',
          'Principals, concierges & corporates.',
          'Whether you are a private client seeking a personal coach, a five-star hotel looking to offer bespoke wellness programming, or a corporation investing in executive performance — Humn Sprt provides a single, trusted point of access.',
        )}

        {section(
          'How it works',
          'Browse. Enquire. Begin.',
          'Browse our curated roster, filtered by discipline, location, or specialty. Submit a confidential enquiry and our concierge desk will respond within 24 hours with availability, pricing, and logistics.',
        )}

        {section(
          'Design philosophy',
          'Quiet by design.',
          'No ads. No feeds. No noise. Every interaction is considered, every screen minimal. Humn Sprt is designed to feel like the service it represents — premium, discreet, and effortless.',
        )}
      </Animated.View>

      <View style={{ height: theme.spacing.xxl }} />

      <Text
        style={[
          theme.typography.eyebrow,
          { color: theme.colors.textMuted, marginBottom: theme.spacing.md },
        ]}
      >
        Legal
      </Text>
      <Button
        variant="ghost"
        label="Privacy policy"
        fullWidth={false}
        onPress={() => Linking.openURL('https://humnsprt.com/privacy')}
      />
      <Button
        variant="ghost"
        label="Terms of service"
        fullWidth={false}
        onPress={() => Linking.openURL('https://humnsprt.com/terms')}
      />

      <View style={{ height: theme.spacing.xl }} />
      <Text
        style={[
          theme.typography.caption,
          { color: theme.colors.textSubtle, textAlign: 'center' },
        ]}
      >
        v{Constants.expoConfig?.version ?? '1.0.0'} · Built with care.
      </Text>
      <View style={{ height: theme.spacing.huge }} />
    </Screen>
  );
}

const styles = StyleSheet.create({
  header: { marginTop: 16, marginBottom: 40 },
  section: { marginTop: 40 },
});
