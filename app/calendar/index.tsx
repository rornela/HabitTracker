import { useEffect, useMemo, useState } from 'react';
import { FlatList, Pressable, StyleSheet, View } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';

type Entry = { id: string; type: 'craving' | 'positive' | 'bump'; timestamp: number; note?: string };

const BG = '#0D1B2A';

function formatYmd(d: Date) {
  const y = d.getFullYear();
  const m = `${d.getMonth() + 1}`.padStart(2, '0');
  const day = `${d.getDate()}`.padStart(2, '0');
  return `${y}-${m}-${day}`;
}

function startOfMonth(d: Date) {
  const x = new Date(d);
  x.setDate(1);
  x.setHours(0, 0, 0, 0);
  return x;
}

function startOfWeekMonday(d: Date) {
  const x = new Date(d);
  const day = x.getDay(); // Sun=0
  const mondayOffset = (day + 6) % 7;
  x.setDate(x.getDate() - mondayOffset);
  x.setHours(0, 0, 0, 0);
  return x;
}

function addDays(d: Date, n: number) {
  const x = new Date(d);
  x.setDate(x.getDate() + n);
  return x;
}

function monthLabel(d: Date) {
  return d.toLocaleDateString([], { month: 'long', year: 'numeric' });
}

export default function CalendarIndexScreen() {
  const [entries, setEntries] = useState<Entry[]>([]);

  useEffect(() => {
    (async () => {
      const raw = (await AsyncStorage.getItem('log:entries')) || '[]';
      try {
        const parsed = JSON.parse(raw) as Entry[];
        setEntries(Array.isArray(parsed) ? parsed : []);
      } catch {
        setEntries([]);
      }
    })();
  }, []);

  // Build last 12 months including current
  const months = useMemo(() => {
    const now = new Date();
    const arr: Date[] = [];
    for (let i = 0; i < 12; i++) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      arr.push(d);
    }
    return arr;
  }, []);

  // pre-bucket entries by date string
  const eventsByDay = useMemo(() => {
    const map = new Map<string, Entry[]>();
    for (const e of entries) {
      const d = new Date(e.timestamp);
      d.setHours(0, 0, 0, 0);
      const key = formatYmd(d);
      const arr = map.get(key) || [];
      arr.push(e);
      map.set(key, arr);
    }
    return map;
  }, [entries]);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: BG }} edges={['top']}>
      <ThemedView lightColor={BG} darkColor={BG} style={styles.container}>
        <Pressable onPress={() => router.replace('/home')} accessibilityRole="button" style={styles.homeBtn} />
        <FlatList
          data={months}
          keyExtractor={(d) => d.toISOString()}
          renderItem={({ item: monthDate }) => {
            const first = startOfMonth(monthDate);
            const gridStart = startOfWeekMonday(first);
            const days: Date[] = Array.from({ length: 42 }, (_, i) => addDays(gridStart, i)); // 6 weeks x 7 days
            const currentMonth = monthDate.getMonth();
            return (
              <View style={styles.monthSection}>
                <ThemedText type="subtitle" lightColor="#FFFFFF" darkColor="#FFFFFF" style={styles.monthTitle}>{monthLabel(monthDate)}</ThemedText>
                <View style={styles.weekHeader}>
                  {['Mon','Tue','Wed','Thu','Fri','Sat','Sun'].map((d) => (
                    <ThemedText key={d} lightColor="#FFFFFF" darkColor="#FFFFFF" style={styles.weekHeaderText}>{d}</ThemedText>
                  ))}
                </View>
                <View style={styles.grid}>
                  {days.map((d) => {
                    const k = formatYmd(d);
                    const items = eventsByDay.get(k) || [];
                    const isDim = d.getMonth() !== currentMonth;
                    return (
                      <Pressable
                        key={k}
                        style={[styles.cell, isDim && styles.cellDim]}
                        onPress={() => router.push({ pathname: '/calendar/[date]', params: { date: k } })}
                        accessibilityRole="button"
                      >
                        <ThemedText style={[styles.cellDay, isDim && styles.cellDayDim]}>{d.getDate()}</ThemedText>
                        <View style={styles.cellDots}>
                          {items.slice(0, 4).map((e) => (
                            <View
                              key={e.id}
                              style={[
                                styles.dot,
                                e.type === 'craving' && styles.dotCraving,
                                e.type === 'positive' && styles.dotPositive,
                                e.type === 'bump' && styles.dotBump,
                              ]}
                            />
                          ))}
                        </View>
                      </Pressable>
                    );
                  })}
                </View>
              </View>
            );
          }}
        />
      </ThemedView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    gap: 16,
  },
  homeBtn: {
    alignSelf: 'flex-start',
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FFB86C',
    marginBottom: 8,
  },
  monthSection: {
    backgroundColor: '#1F2A44',
    borderRadius: 12,
    padding: 12,
  },
  monthTitle: {
    marginBottom: 8,
  },
  weekHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  weekHeaderText: {
    color: '#FFFFFF',
    fontSize: 12,
    width: `${100 / 7}%`,
    textAlign: 'center',
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  cell: {
    width: `${100 / 7}%`,
    height: 56,
    paddingTop: 6,
    alignItems: 'center',
    borderRadius: 8,
  },
  cellDim: {
    opacity: 0.5,
  },
  cellDay: {
    color: '#FFFFFF',
    fontSize: 12,
    marginBottom: 4,
  },
  cellDayDim: {
    color: '#B6C1D1',
  },
  cellDots: {
    flexDirection: 'row',
    gap: 4,
    flexWrap: 'wrap',
    width: 40,
    justifyContent: 'center',
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  dotCraving: {
    backgroundColor: '#F59E0B',
  },
  dotPositive: {
    backgroundColor: '#10B981',
  },
  dotBump: {
    backgroundColor: '#EF4444',
  },
});


