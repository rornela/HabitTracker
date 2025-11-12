import { useEffect, useMemo, useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { SafeAreaView } from 'react-native-safe-area-context';

const BG = '#0D1B2A';

export default function HomeScreen() {
  const [habitName, setHabitName] = useState<string>('');
  const [isReady, setIsReady] = useState(false);
  const [entries, setEntries] = useState<Array<{ id: string; type: 'craving' | 'positive' | 'bump'; timestamp: number }>>([]);

  useEffect(() => {
    (async () => {
      const name = (await AsyncStorage.getItem('habit:name')) || '';
      setHabitName(name);
      const raw = (await AsyncStorage.getItem('log:entries')) || '[]';
      try {
        const parsed = JSON.parse(raw) as Array<{ id: string; type: 'craving' | 'positive' | 'bump'; timestamp: number }>;
        setEntries(Array.isArray(parsed) ? parsed : []);
      } catch {
        setEntries([]);
      }
      setIsReady(true);
    })();
  }, []);

  // Build week data (Mon..Sun)
  const week = useMemo(() => {
    const now = new Date();
    const day = now.getDay(); // 0..6, Sun = 0
    const mondayOffset = (day + 6) % 7;
    const monday = new Date(now);
    monday.setHours(0, 0, 0, 0);
    monday.setDate(now.getDate() - mondayOffset);
    const days = Array.from({ length: 7 }, (_, i) => {
      const d = new Date(monday);
      d.setDate(monday.getDate() + i);
      return d;
    });
    return days;
  }, []);

  const eventsByDay = useMemo(() => {
    const buckets: Array<Array<{ id: string; type: 'craving' | 'positive' | 'bump'; timestamp: number }>> = week.map(() => []);
    const start = week[0].getTime();
    const end = new Date(week[6]).setHours(23, 59, 59, 999);
    for (const e of entries) {
      if (e.timestamp < start || e.timestamp > end) continue;
      const date = new Date(e.timestamp);
      const idx = Math.floor((date.getTime() - start) / (24 * 60 * 60 * 1000));
      if (idx >= 0 && idx < 7) buckets[idx].push(e);
    }
    return buckets;
  }, [entries, week]);

  // Days since last bump
  const daysSinceBump = useMemo(() => {
    const bumps = entries.filter((e) => e.type === 'bump');
    if (bumps.length === 0) return null;
    const last = bumps.reduce((max, e) => (e.timestamp > max ? e.timestamp : max), 0);
    const diffMs = Date.now() - last;
    return Math.floor(diffMs / (24 * 60 * 60 * 1000));
  }, [entries]);

  const goToJournal = (type: 'craving' | 'positive' | 'bump') => {
    router.push({ pathname: '/journal/[type]', params: { type } });
  };

  if (!isReady) return null;

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: BG }} edges={['top']}>
    <ThemedView lightColor={BG} darkColor={BG} style={styles.container}>
      {/* Header with logo and title */}
      <View style={styles.headerRow}>
        <LinearGradient colors={['#FFB86C', '#FF8A34']} style={styles.logo} />
        <View style={styles.headerText}>
          <ThemedText type="subtitle" lightColor="#FFFFFF" darkColor="#FFFFFF" style={styles.headerTitle}>Squashing</ThemedText>
          <ThemedText type="title" lightColor="#FFFFFF" darkColor="#FFFFFF" style={styles.headerHabit}>
            {habitName ? habitName : 'Name of Habit'}
          </ThemedText>
        </View>
      </View>

      {/* Onboarding card */}
      <View style={styles.infoCard}>
        <ThemedText style={styles.infoText}>
          This is your homepage! Try recording a feeling
        </ThemedText>
      </View>

      {/* Week calendar card */}
      <Pressable style={styles.calendarCard} onPress={() => router.push('/calendar')}>
        <View style={styles.weekHeader}>
          {['Mon','Tue','Wed','Thu','Fri','Sat','Sun'].map((d) => (
            <ThemedText key={d} style={styles.weekHeaderText}>{d}</ThemedText>
          ))}
        </View>
        <View style={styles.weekEventsRow}>
          {eventsByDay.map((items, idx) => (
            <View key={idx} style={styles.dayCol}>
              {/* show up to four bubbles per day */}
              {items.slice(0, 4).map((e) => (
                <View
                  key={e.id}
                  style={[
                    styles.bubble,
                    e.type === 'craving' && styles.bubbleCraving,
                    e.type === 'positive' && styles.bubblePositive,
                    e.type === 'bump' && styles.bubbleBump,
                  ]}
                />
              ))}
              {/* empty placeholders to stabilize height */}
              {Array.from({ length: Math.max(0, 4 - items.length) }).map((_, i) => (
                <View key={`p-${i}`} style={[styles.bubble, styles.bubbleEmpty]} />
              ))}
            </View>
          ))}
        </View>
      </Pressable>

      {/* Days since bump */}
      <View style={styles.streakCard}>
        {daysSinceBump === null ? (
          <ThemedText style={styles.streakLabel}>No bumps recorded yet</ThemedText>
        ) : (
          <View style={{ alignItems: 'center' }}>
            <ThemedText type="title" style={styles.streakNumber}>{daysSinceBump}</ThemedText>
            <ThemedText style={styles.streakLabel}>days since a bump in the road</ThemedText>
          </View>
        )}
      </View>

      {/* Stacked action buttons */}
      <View style={styles.stack}>
        <Pressable style={[styles.action, styles.actionPositive]} onPress={() => goToJournal('positive')} accessibilityRole="button">
          <View style={[styles.actionDot, styles.dotPositive]} />
          <ThemedText style={styles.actionText}>Journal a positive thought</ThemedText>
        </Pressable>
        <Pressable style={[styles.action, styles.actionCraving]} onPress={() => goToJournal('craving')} accessibilityRole="button">
          <View style={[styles.actionDot, styles.dotCraving]} />
          <ThemedText style={styles.actionText}>Journal a craving</ThemedText>
        </Pressable>
        <Pressable style={[styles.action, styles.actionBump]} onPress={() => goToJournal('bump')} accessibilityRole="button">
          <View style={[styles.actionDot, styles.dotBump]} />
          <ThemedText style={styles.actionText}>Report a bump in the road</ThemedText>
        </Pressable>
      </View>
    </ThemedView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    marginBottom: 16,
  },
  logo: {
    width: 56,
    height: 56,
    borderRadius: 28,
  },
  headerText: {
    flex: 1,
  },
  headerTitle: {
  },
  headerHabit: {
    marginTop: 2,
  },
  headerHabitItalic: {
    fontStyle: 'italic',
  },
  infoCard: {
    backgroundColor: '#BBD0FF',
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 12,
    marginBottom: 16,
  },
  infoText: {
    color: '#0B1220',
    textAlign: 'center',
  },
  calendarCard: {
    backgroundColor: '#1F2A44',
    borderRadius: 12,
    padding: 12,
    marginBottom: 20,
  },
  streakCard: {
    backgroundColor: '#1F2A44',
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 16,
    alignItems: 'center',
    marginBottom: 20,
  },
  streakNumber: {
    color: '#FFFFFF',
  },
  streakLabel: {
    color: '#B6C1D1',
    fontSize: 14,
    marginTop: 4,
    textAlign: 'center',
  },
  weekHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  weekHeaderText: {
    color: '#B6C1D1',
    fontSize: 12,
    width: `${100 / 7}%`,
    textAlign: 'center',
  },
  weekEventsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  dayCol: {
    width: `${100 / 7}%`,
    alignItems: 'center',
    gap: 6,
  },
  bubble: {
    width: 14,
    height: 14,
    borderRadius: 7,
  },
  bubbleEmpty: {
    backgroundColor: 'rgba(255,255,255,0.08)',
  },
  bubbleCraving: {
    backgroundColor: '#F59E0B',
  },
  bubblePositive: {
    backgroundColor: '#10B981',
  },
  bubbleBump: {
    backgroundColor: '#EF4444',
  },
  stack: {
    gap: 12,
  },
  action: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderRadius: 16,
  },
  actionText: {
    color: '#0B1220',
    fontSize: 16,
  },
  actionCraving: {
    backgroundColor: '#10E7B2',
  },
  actionPositive: {
    backgroundColor: '#AFC2FF',
  },
  actionBump: {
    backgroundColor: '#E7F1D6',
  },
  actionDot: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#0B1220',
  },
  dotCraving: {
    backgroundColor: '#0B1220',
  },
  dotPositive: {
    backgroundColor: '#0B1220',
  },
  dotBump: {
    backgroundColor: '#0B1220',
  },
});