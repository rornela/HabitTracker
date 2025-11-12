import { useMemo, useState, useEffect } from 'react';
import { FlatList, Pressable, StyleSheet, View } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router, useLocalSearchParams } from 'expo-router';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';

type Entry = { id: string; type: 'craving' | 'positive' | 'bump'; timestamp: number; note?: string };

const BG = '#0D1B2A';

function toYmd(d: Date) {
  const y = d.getFullYear();
  const m = `${d.getMonth() + 1}`.padStart(2, '0');
  const day = `${d.getDate()}`.padStart(2, '0');
  return `${y}-${m}-${day}`;
}

// Parse 'YYYY-MM-DD' as a LOCAL date (avoid UTC shift that causes off-by-one)
function parseYmdLocal(ymd: string) {
  const [y, m, d] = ymd.split('-').map((n) => parseInt(n, 10));
  return new Date(y, (m || 1) - 1, d || 1);
}

export default function CalendarDayScreen() {
  const { date } = useLocalSearchParams<{ date?: string }>();
  const [entries, setEntries] = useState<Entry[]>([]);
  const [expandedId, setExpandedId] = useState<string | null>(null);

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

  const target = date || toYmd(new Date());

  const dayEntries = useMemo(() => {
    const base = parseYmdLocal(target);
    const start = new Date(base);
    start.setHours(0, 0, 0, 0);
    const end = new Date(base);
    end.setHours(23, 59, 59, 999);
    return entries
      .filter((e) => e.timestamp >= start.getTime() && e.timestamp <= end.getTime())
      .sort((a, b) => b.timestamp - a.timestamp);
  }, [entries, target]);

  const title = useMemo(() => {
    const d = parseYmdLocal(target);
    return d.toLocaleDateString([], { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
  }, [target]);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: BG }} edges={['top']}>
      <ThemedView lightColor={BG} darkColor={BG} style={styles.container}>
        <Pressable onPress={() => router.replace('/home')} accessibilityRole="button" style={styles.homeBtn} />
        <ThemedText type="subtitle" lightColor="#FFFFFF" darkColor="#FFFFFF" style={styles.title}>{title}</ThemedText>
        {dayEntries.length === 0 ? (
          <ThemedText lightColor="#FFFFFF" darkColor="#FFFFFF" style={styles.empty}>No logs for this day.</ThemedText>
        ) : (
          <FlatList
            data={dayEntries}
            keyExtractor={(e) => e.id}
            ItemSeparatorComponent={() => <View style={{ height: 10 }} />}
            renderItem={({ item }) => {
              const isOpen = expandedId === item.id;
              const time = new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
              return (
                <Pressable
                  onPress={() => setExpandedId((prev) => (prev === item.id ? null : item.id))}
                  style={[styles.card, styles[`card_${item.type}` as const]]}
                >
                  <ThemedText style={styles.cardTitle}>{time} — {capitalize(item.type)}</ThemedText>
                  {isOpen && !!item.note && (
                    <ThemedText style={styles.cardNote}>{item.note}</ThemedText>
                  )}
                </Pressable>
              );
            }}
          />
        )}
      </ThemedView>
    </SafeAreaView>
  );
}

function capitalize(s: string) {
  return s.slice(0, 1).toUpperCase() + s.slice(1);
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    gap: 12,
  },
  homeBtn: {
    alignSelf: 'flex-start',
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FFB86C',
    marginBottom: 6,
  },
  title: {
    marginBottom: 6,
  },
  empty: {
    opacity: 0.9,
    textAlign: 'center',
    marginTop: 16,
  },
  card: {
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderRadius: 10,
  },
  cardTitle: {
    color: '#fff',
    marginBottom: 6,
  },
  cardNote: {
    color: '#0B1220',
    backgroundColor: 'rgba(255,255,255,0.85)',
    borderRadius: 8,
    padding: 10,
  },
  card_craving: {
    backgroundColor: '#F59E0B',
  },
  card_positive: {
    backgroundColor: '#10B981',
  },
  card_bump: {
    backgroundColor: '#EF4444',
  },
});


