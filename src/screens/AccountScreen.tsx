import React from 'react';
import { Linking, StyleSheet, Text, View } from 'react-native';
import { Screen } from '@/components/Screen';
import { Button } from '@/components/Button';
import { useTheme } from '@/theme';
import { useAuth } from '@/services/auth';
import Constants from 'expo-constants';

export function AccountScreen() {
  const theme = useTheme();
  const { user, signOut } = useAuth();

  const row = (label: string, value: string) => (
    <View style={styles.row}>
      <Text style={[theme.typography.caption, { color: theme.colors.textSubtle }]}>
        {label.toUpperCase()}
      </Text>
      <Text style={[theme.typography.body, { color: theme.colors.text, marginTop: 4 }]}>
        {value}
      </Text>
    </View>
  );

  return (
    <Screen scroll>
      <Text style={[theme.typography.eyebrow, { color: theme.colors.textMuted }]}>
        Your account
      </Text>
      <Text
        style={[
          theme.typography.displayL,
          { color: theme.colors.text, marginTop: theme.spacing.sm },
        ]}
      >
        {user?.name ?? 'Guest'}
      </Text>

      <View style={{ height: theme.spacing.xl }} />
      {user && row('Email', user.email)}
      {user && row('Role', user.role)}
      {row('Version', `${Constants.expoConfig?.version ?? '1.0.0'}`)}

      <View style={{ height: theme.spacing.xxxl }} />
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

      <View style={{ height: theme.spacing.huge }} />
      {user ? <Button label="Sign out" variant="secondary" onPress={signOut} /> : null}
      <View style={{ height: theme.spacing.huge }} />
    </Screen>
  );
}

const styles = StyleSheet.create({
  row: { marginBottom: 20 },
});
