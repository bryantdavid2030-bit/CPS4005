import React, { useState } from 'react';
import { KeyboardAvoidingView, Platform, StyleSheet, Text, View } from 'react-native';
import Animated, { FadeIn } from 'react-native-reanimated';
import { Screen } from '@/components/Screen';
import { Logo } from '@/components/Logo';
import { Button } from '@/components/Button';
import { TextField } from '@/components/TextField';
import { useTheme } from '@/theme';
import { useAuth } from '@/services/auth';

type Mode = 'signin' | 'signup';

/**
 * Unified auth screen with toggle between sign-in and sign-up.
 * Editorial layout: generous vertical rhythm, serif display copy,
 * underlined text fields, and a single primary CTA.
 */
export function AuthScreen() {
  const theme = useTheme();
  const { signIn, signUp } = useAuth();

  const [mode, setMode] = useState<Mode>('signin');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submit = async () => {
    setError(null);
    if (!email.includes('@') || password.length < 6) {
      setError('Please enter a valid email and a password of at least 6 characters.');
      return;
    }
    setLoading(true);
    try {
      if (mode === 'signin') await signIn(email, password);
      else await signUp(name || email.split('@')[0], email, password);
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Screen scroll background="default">
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={{ flex: 1 }}
      >
        <Animated.View entering={FadeIn.duration(600)} style={styles.header}>
          <Logo size={52} color={theme.colors.text} showWordmark />
        </Animated.View>

        <Animated.View entering={FadeIn.duration(700).delay(120)}>
          <Text style={[theme.typography.eyebrow, { color: theme.colors.textMuted }]}>
            {mode === 'signin' ? 'Welcome back' : 'Create your account'}
          </Text>
          <Text
            style={[
              theme.typography.displayL,
              { color: theme.colors.text, marginTop: theme.spacing.md },
            ]}
          >
            {mode === 'signin' ? 'Sign in.' : 'Join the list.'}
          </Text>
          <Text
            style={[
              theme.typography.bodyL,
              { color: theme.colors.textMuted, marginTop: theme.spacing.md, marginBottom: theme.spacing.xxl },
            ]}
          >
            {mode === 'signin'
              ? 'A curated network of practitioners for private clients, concierges and corporations.'
              : 'Request access to a hand-picked roster of coaches and movement specialists.'}
          </Text>
        </Animated.View>

        <Animated.View entering={FadeIn.duration(700).delay(220)}>
          {mode === 'signup' && (
            <TextField
              label="Full name"
              value={name}
              onChangeText={setName}
              autoCapitalize="words"
              autoComplete="name"
              textContentType="name"
            />
          )}
          <TextField
            label="Email"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            autoComplete="email"
            textContentType="emailAddress"
          />
          <TextField
            label="Password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            autoCapitalize="none"
            autoComplete={mode === 'signin' ? 'current-password' : 'new-password'}
            textContentType={mode === 'signin' ? 'password' : 'newPassword'}
            error={error ?? undefined}
          />

          <View style={{ height: theme.spacing.lg }} />
          <Button
            label={mode === 'signin' ? 'Sign in' : 'Request access'}
            onPress={submit}
            loading={loading}
          />

          <View style={{ height: theme.spacing.xl }} />
          <Button
            variant="ghost"
            label={mode === 'signin' ? 'New here? Create an account' : 'Have an account? Sign in'}
            onPress={() => setMode(mode === 'signin' ? 'signup' : 'signin')}
          />
        </Animated.View>
      </KeyboardAvoidingView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  header: { marginTop: 24, marginBottom: 48 },
});
