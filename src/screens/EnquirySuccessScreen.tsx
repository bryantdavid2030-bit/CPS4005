import React, { useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Animated, { FadeIn } from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import { Screen } from '@/components/Screen';
import { Button } from '@/components/Button';
import { useTheme } from '@/theme';

interface EnquirySuccessScreenProps {
  onDone: () => void;
}

export function EnquirySuccessScreen({ onDone }: EnquirySuccessScreenProps) {
  const theme = useTheme();

  useEffect(() => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(
      () => undefined,
    );
  }, []);

  return (
    <Screen>
      <View style={styles.center}>
        <Animated.View entering={FadeIn.duration(700)}>
          <Text
            style={[
              theme.typography.eyebrow,
              { color: theme.colors.accent, textAlign: 'center' },
            ]}
          >
            Received
          </Text>
          <Text
            style={[
              theme.typography.displayL,
              { color: theme.colors.text, textAlign: 'center', marginTop: theme.spacing.md },
            ]}
          >
            Thank you.
          </Text>
          <Text
            style={[
              theme.typography.bodyL,
              {
                color: theme.colors.textMuted,
                textAlign: 'center',
                marginTop: theme.spacing.lg,
              },
            ]}
          >
            Our concierge team has received your enquiry and will be in
            touch within 24 hours.
          </Text>
        </Animated.View>
      </View>
      <Button label="Return" onPress={onDone} />
      <View style={{ height: 24 }} />
    </Screen>
  );
}

const styles = StyleSheet.create({
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 12 },
});
