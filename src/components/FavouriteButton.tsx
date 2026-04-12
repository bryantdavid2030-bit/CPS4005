import React from 'react';
import { Pressable, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useFavourites } from '@/hooks/useFavourites';
import { useTheme } from '@/theme';

interface FavouriteButtonProps {
  coachId: string;
  size?: number;
}

/**
 * A heart toggle for bookmarking coaches. Wired to FavouritesProvider.
 */
export function FavouriteButton({ coachId, size = 22 }: FavouriteButtonProps) {
  const theme = useTheme();
  const { isFavourite, toggleFavourite } = useFavourites();
  const active = isFavourite(coachId);

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={active ? 'Remove from favourites' : 'Add to favourites'}
      accessibilityState={{ selected: active }}
      onPress={() => toggleFavourite(coachId)}
      hitSlop={12}
      style={({ pressed }) => [
        styles.btn,
        { opacity: pressed ? 0.7 : 1 },
      ]}
    >
      <Ionicons
        name={active ? 'heart' : 'heart-outline'}
        size={size}
        color={active ? theme.colors.accent : theme.colors.textMuted}
      />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  btn: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
