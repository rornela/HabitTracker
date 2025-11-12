import { useEffect, useMemo, useState } from 'react';
import { FlatList, StyleSheet, View } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';

type Entry = { id: string; type: 'craving' | 'positive' | 'bump'; timestamp: number };

export default function HistoryScreen() {
  const [entries, setEntries] = useState<Entry[]>([]);

  useEffect(() => {
    const load = async () => {
      const raw = (await AsyncStorage.getItem('log:entries')) || '[]';
      try {
        const parsed = JSON.parse(raw) as Entry[];
        const sorted = (Array.isArray(parsed) ? parsed : []).sort((a, b) => b.timestamp - a.timestamp);
        setEntries(sorted);
      } catch {
        setEntries([]);
      }
    };
    load();
  }, []);

  const grouped = useMemo(() => {
    const groups = new Map<string, Entry[]>();
    for (const e of entries) {
      const d = new Date(e.timestamp);
      const key = d.toDateString();
      const arr = groups.get(key) || [];
      arr.push(e);
      groups.set(key, arr);
    }
    return Array.from(groups.entries()).map(([day, items]) => ({ day, items }));
  }, [entries]);

  return (
    <ThemedView style={styles.container}>
      {grouped.length === 0 ? (
        <ThemedText style={styles.empty}>No history yet.</ThemedText>
      ) : (
        <FlatList
          data={grouped}
          keyExtractor={(g) => g.day}
          renderItem={({ item }) => (
            <View style={styles.group}>
              <ThemedText type="subtitle" style={styles.groupTitle}>{item.day}</ThemedText>
              {item.items.map((e) => {
                const time = new Date(e.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
                return (
                  <View key={e.id} style={[styles.row, styles[`row_${e.type}` as const]]}>
                    <ThemedText style={styles.rowText}>{time} — {capitalize(e.type)}</ThemedText>
                  </View>
                );
              })}
            </View>
          )}
          ItemSeparatorComponent={() => <View style={{ height: 12 }} />}
        />
      )}
    </ThemedView>
  );
}

function capitalize(s: string) {
  return s.slice(0, 1).toUpperCase() + s.slice(1);
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  empty: {
    textAlign: 'center',
    marginTop: 24,
    opacity: 0.8,
  },
  group: {
    gap: 8,
  },
  groupTitle: {
    marginBottom: 4,
  },
  row: {
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderRadius: 10,
  },
  rowText: {
    color: '#fff',
  },
  row_craving: {
    backgroundColor: '#F59E0B',
  },
  row_positive: {
    backgroundColor: '#10B981',
  },
  row_bump: {
    backgroundColor: '#EF4444',
  },
});


