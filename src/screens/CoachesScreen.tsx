import React, { useCallback, useMemo, useState } from 'react';
import {
  FlatList,
  RefreshControl,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { Screen } from '@/components/Screen';
import { CoachCard } from '@/components/CoachCard';
import { FilterChip } from '@/components/FilterChip';
import { useTheme } from '@/theme';
import { coaches as localCoaches, disciplines, locations } from '@/data/coaches';
import { listCoaches } from '@/services/api';
import type { Coach } from '@/types';

interface CoachesScreenProps {
  onOpenCoach: (coach: Coach) => void;
}

/**
 * Coach roster with search + discipline + location filtering.
 * Supports pull-to-refresh against the API (falls back to local data).
 */
export function CoachesScreen({ onOpenCoach }: CoachesScreenProps) {
  const theme = useTheme();
  const [query, setQuery] = useState('');
  const [discipline, setDiscipline] = useState<string | null>(null);
  const [location, setLocation] = useState<string | null>(null);
  const [coaches, setCoaches] = useState<Coach[]>(localCoaches);
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    try {
      const fresh = await listCoaches();
      setCoaches(fresh);
    } catch {
      // Keep current data on failure.
    } finally {
      setRefreshing(false);
    }
  }, []);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return coaches.filter((c) => {
      if (discipline && c.discipline !== discipline) return false;
      if (location && !c.location.includes(location)) return false;
      if (!q) return true;
      return (
        c.name.toLowerCase().includes(q) ||
        c.discipline.toLowerCase().includes(q) ||
        c.headline.toLowerCase().includes(q) ||
        c.specialties.some((s) => s.toLowerCase().includes(q))
      );
    });
  }, [query, discipline, location, coaches]);

  const header = (
    <View style={{ marginTop: 12 }}>
      <Text style={[theme.typography.eyebrow, { color: theme.colors.textMuted }]}>
        The roster
      </Text>
      <Text
        style={[
          theme.typography.displayL,
          { color: theme.colors.text, marginTop: theme.spacing.sm },
        ]}
      >
        {filtered.length} {filtered.length === 1 ? 'coach' : 'coaches'}.
      </Text>

      <View style={styles.searchRow}>
        <TextInput
          placeholder="Search by name, discipline or specialty"
          placeholderTextColor={theme.colors.textSubtle}
          value={query}
          onChangeText={setQuery}
          style={[
            theme.typography.body,
            {
              color: theme.colors.text,
              borderBottomColor: theme.colors.border,
              borderBottomWidth: StyleSheet.hairlineWidth * 2,
              paddingVertical: 14,
            },
          ]}
          returnKeyType="search"
          clearButtonMode="while-editing"
          accessibilityLabel="Search coaches"
        />
      </View>

      <Text
        style={[
          theme.typography.eyebrow,
          {
            color: theme.colors.textMuted,
            marginTop: theme.spacing.xl,
            marginBottom: 10,
          },
        ]}
      >
        Discipline
      </Text>
      <View style={styles.chipsRow}>
        <FilterChip
          label="All"
          active={discipline === null}
          onPress={() => setDiscipline(null)}
        />
        {disciplines.map((d) => (
          <FilterChip
            key={d}
            label={d}
            active={discipline === d}
            onPress={() => setDiscipline(d === discipline ? null : d)}
          />
        ))}
      </View>

      <Text
        style={[
          theme.typography.eyebrow,
          {
            color: theme.colors.textMuted,
            marginTop: theme.spacing.lg,
            marginBottom: 10,
          },
        ]}
      >
        Location
      </Text>
      <View style={styles.chipsRow}>
        <FilterChip
          label="Global"
          active={location === null}
          onPress={() => setLocation(null)}
        />
        {locations.map((l) => (
          <FilterChip
            key={l}
            label={l}
            active={location === l}
            onPress={() => setLocation(l === location ? null : l)}
          />
        ))}
      </View>

      <View style={{ height: theme.spacing.xl }} />
    </View>
  );

  return (
    <Screen>
      <FlatList
        data={filtered}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 48 }}
        ListHeaderComponent={header}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={theme.colors.accent}
            colors={[theme.colors.accent]}
          />
        }
        renderItem={({ item, index }) => (
          <Animated.View entering={FadeInDown.duration(500).delay(60 * Math.min(index, 6))}>
            <CoachCard coach={item} onPress={onOpenCoach} compact />
          </Animated.View>
        )}
        ListEmptyComponent={
          <Text
            style={[
              theme.typography.body,
              {
                color: theme.colors.textMuted,
                marginTop: 40,
                textAlign: 'center',
              },
            ]}
          >
            No coaches match your filters.
          </Text>
        }
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  searchRow: { marginTop: 20 },
  chipsRow: { flexDirection: 'row', flexWrap: 'wrap' },
});
