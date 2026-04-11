import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  TextInput,
  TextInputProps,
  View,
  ViewStyle,
} from 'react-native';
import { useTheme } from '@/theme';

interface TextFieldProps extends TextInputProps {
  label: string;
  error?: string;
  containerStyle?: ViewStyle;
}

/**
 * A minimal underlined text field. No rounded boxes — a single hairline
 * that animates to the accent colour on focus.
 */
export function TextField({
  label,
  error,
  containerStyle,
  ...rest
}: TextFieldProps) {
  const theme = useTheme();
  const [focused, setFocused] = useState(false);

  const lineColor = error
    ? theme.colors.error
    : focused
      ? theme.colors.accent
      : theme.colors.border;

  return (
    <View style={[styles.wrap, containerStyle]}>
      <Text
        style={[
          theme.typography.eyebrow,
          { color: theme.colors.textMuted, marginBottom: theme.spacing.sm },
        ]}
      >
        {label}
      </Text>
      <TextInput
        {...rest}
        onFocus={(e) => {
          setFocused(true);
          rest.onFocus?.(e);
        }}
        onBlur={(e) => {
          setFocused(false);
          rest.onBlur?.(e);
        }}
        placeholderTextColor={theme.colors.textSubtle}
        style={[
          theme.typography.bodyL,
          {
            color: theme.colors.text,
            borderBottomColor: lineColor,
            borderBottomWidth: StyleSheet.hairlineWidth * 2,
            paddingVertical: theme.spacing.md,
          },
          rest.style,
        ]}
      />
      {error ? (
        <Text
          style={[
            theme.typography.caption,
            { color: theme.colors.error, marginTop: theme.spacing.xs },
          ]}
        >
          {error}
        </Text>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { marginBottom: 20 },
});
