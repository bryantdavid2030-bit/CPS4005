import React, { useState } from 'react';
import { KeyboardAvoidingView, Platform, StyleSheet, Text, View } from 'react-native';
import Animated, { FadeIn } from 'react-native-reanimated';
import { Screen } from '@/components/Screen';
import { TextField } from '@/components/TextField';
import { Button } from '@/components/Button';
import { FilterChip } from '@/components/FilterChip';
import { useTheme } from '@/theme';
import type { Coach, Enquiry } from '@/types';
import { submitEnquiry } from '@/services/api';

interface EnquiryScreenProps {
  coach?: Coach | null;
  onBack: () => void;
  onSuccess: () => void;
  presetType?: Enquiry['type'];
}

const types: { key: Enquiry['type']; label: string }[] = [
  { key: 'individual', label: 'Individual' },
  { key: 'concierge', label: 'Hotel · Concierge' },
  { key: 'corporate', label: 'Corporate' },
];

export function EnquiryScreen({ coach, onBack, onSuccess, presetType }: EnquiryScreenProps) {
  const theme = useTheme();

  const [type, setType] = useState<Enquiry['type']>(presetType ?? 'individual');
  const [clientName, setClientName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [organisation, setOrganisation] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const canSubmit =
    clientName.trim().length > 1 &&
    email.includes('@') &&
    message.trim().length > 10;

  const submit = async () => {
    if (!canSubmit) {
      setError('Please complete your name, email and a short message.');
      return;
    }
    setLoading(true);
    setError(null);
    try {
      await submitEnquiry({
        coachId: coach?.id,
        type,
        clientName,
        email,
        phone: phone || undefined,
        organisation: organisation || undefined,
        message,
      });
      onSuccess();
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Screen scroll>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={{ flex: 1 }}
      >
        <Animated.View entering={FadeIn.duration(500)}>
          <Text style={[theme.typography.eyebrow, { color: theme.colors.textMuted }]}>
            {coach ? `Enquiry · ${coach.discipline}` : 'Concierge desk'}
          </Text>
          <Text
            style={[
              theme.typography.displayL,
              { color: theme.colors.text, marginTop: theme.spacing.sm },
            ]}
          >
            {coach ? coach.name : 'Speak to concierge.'}
          </Text>
          <Text
            style={[
              theme.typography.bodyL,
              {
                color: theme.colors.textMuted,
                marginTop: theme.spacing.md,
                marginBottom: theme.spacing.xl,
              },
            ]}
          >
            Share a few details and we'll respond within 24 hours. All
            enquiries are handled in confidence.
          </Text>
        </Animated.View>

        <Text
          style={[
            theme.typography.eyebrow,
            { color: theme.colors.textMuted, marginBottom: 10 },
          ]}
        >
          Enquiry type
        </Text>
        <View style={styles.chipsRow}>
          {types.map((t) => (
            <FilterChip
              key={t.key}
              label={t.label}
              active={type === t.key}
              onPress={() => setType(t.key)}
            />
          ))}
        </View>

        <View style={{ height: theme.spacing.lg }} />
        <TextField
          label="Your name"
          value={clientName}
          onChangeText={setClientName}
          autoCapitalize="words"
        />
        <TextField
          label="Email"
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          keyboardType="email-address"
        />
        <TextField
          label="Phone (optional)"
          value={phone}
          onChangeText={setPhone}
          keyboardType="phone-pad"
        />
        {type !== 'individual' && (
          <TextField
            label={type === 'concierge' ? 'Hotel or residence' : 'Company'}
            value={organisation}
            onChangeText={setOrganisation}
          />
        )}
        <TextField
          label="Message"
          value={message}
          onChangeText={setMessage}
          multiline
          numberOfLines={5}
          style={{ minHeight: 120, textAlignVertical: 'top' }}
          error={error ?? undefined}
        />

        <View style={{ height: theme.spacing.lg }} />
        <Button
          label="Send enquiry"
          onPress={submit}
          loading={loading}
          disabled={!canSubmit}
        />
        <View style={{ height: theme.spacing.md }} />
        <Button variant="ghost" label="Cancel" onPress={onBack} />
        <View style={{ height: theme.spacing.huge }} />
      </KeyboardAvoidingView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  chipsRow: { flexDirection: 'row', flexWrap: 'wrap' },
});
