import { useEffect, useMemo, useState } from 'react';
import { Keyboard, KeyboardAvoidingView, Platform, Pressable, StyleSheet, TextInput, View } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router, useLocalSearchParams } from 'expo-router';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';

type EntryType = 'craving' | 'positive' | 'bump';

const BG = '#0D1B2A';

const TYPE_COPY: Record<EntryType, string> = {
  craving: "Cravings are normal, write down how you're feeling :)",
  positive: 'Write down a positive thought or feeling!',
  bump: "You are on a journey, it's okay to hit bumps.",
};

const TYPE_CARD_BG: Record<EntryType, string> = {
  craving: '#10E7B2',
  positive: '#AFC2FF',
  bump: '#E7F1D6',
};

export default function JournalScreen() {
  const params = useLocalSearchParams<{ type?: string }>();
  const type = (params.type as EntryType) || 'craving';
  const [note, setNote] = useState('');

  // Guard against bad route param by snapping to 'craving'
  const validType: EntryType = useMemo(() => (['craving', 'positive', 'bump'] as const).includes(type as EntryType) ? (type as EntryType) : 'craving', [type]);

  const submit = async () => {
    const text = note.trim();
    if (!text) return;
    const id = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
    const newEntry = { id, type: validType, timestamp: Date.now(), note: text };
    const raw = (await AsyncStorage.getItem('log:entries')) || '[]';
    let parsed: any[] = [];
    try {
      const p = JSON.parse(raw);
      parsed = Array.isArray(p) ? p : [];
    } catch {
      parsed = [];
    }
    const next = [newEntry, ...parsed];
    await AsyncStorage.setItem('log:entries', JSON.stringify(next));
    Keyboard.dismiss();
    router.replace('/home');
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: BG }} edges={['top']}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={{ flex: 1 }}
      >
        <ThemedView lightColor={BG} darkColor={BG} style={styles.container}>
          <View style={[styles.topCard, { backgroundColor: TYPE_CARD_BG[validType] }]}>
            <ThemedText style={styles.topCardText}>{TYPE_COPY[validType]}</ThemedText>
          </View>

          <TextInput
            style={styles.input}
            multiline
            placeholder="type here"
            placeholderTextColor="rgba(255,255,255,0.7)"
            value={note}
            onChangeText={setNote}
            returnKeyType="done"
          />

          <Pressable
            onPress={() => router.replace('/home')}
            accessibilityRole="button"
            style={styles.cancel}
          >
            <ThemedText style={styles.cancelText}>Cancel</ThemedText>
          </Pressable>

          <Pressable
            onPress={submit}
            disabled={!note.trim()}
            style={({ pressed }) => [
              styles.submit,
              { opacity: !note.trim() ? 0.5 : pressed ? 0.85 : 1 },
            ]}
            accessibilityRole="button"
          >
            <ThemedText style={styles.submitText}>Submit</ThemedText>
          </Pressable>
        </ThemedView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    gap: 20,
  },
  topCard: {
    borderRadius: 20,
    paddingVertical: 16,
    paddingHorizontal: 16,
  },
  topCardText: {
    color: '#0B1220',
    textAlign: 'left',
    fontSize: 16,
  },
  input: {
    height: '45%',
    minHeight: 180,
    backgroundColor: '#25314A',
    color: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    textAlignVertical: 'top',
  },
  cancel: {
    alignSelf: 'flex-start',
    paddingVertical: 6,
    paddingHorizontal: 4,
  },
  cancelText: {
    color: '#B6C1D1',
    fontSize: 14,
  },
  submit: {
    backgroundColor: '#10E7B2',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  submitText: {
    color: '#0B1220',
    fontSize: 16,
    fontWeight: '600',
  },
});


