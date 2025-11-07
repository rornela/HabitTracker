import { useState } from 'react';
import { Pressable, StyleSheet, TextInput, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';

const BG = '#0D1B2A';
const TEXT = '#FFFFF0';
const CTA = '#12D6A7';
const CTA_DISABLED = '#0FBF92';

export default function OnboardingNameScreen() {
  const [name, setName] = useState('');
  const isValid = name.trim().length > 0;

  return (
    <ThemedView lightColor={BG} darkColor={BG} style={styles.container}>
      <LinearGradient colors={["#FFB86C", "#FF8A34"]} style={styles.logo} />

      <View style={styles.center}>
        <ThemedText type="title" style={styles.title} lightColor={TEXT} darkColor={TEXT}>
          So now:
        </ThemedText>
        <ThemedText style={styles.lead} lightColor={TEXT} darkColor={TEXT}>
          Name your habit to squash.
        </ThemedText>
        <ThemedText style={styles.helper} lightColor={TEXT} darkColor={TEXT}>
          It can be the name of
          {'\n'}the substance, act, etc,
          {'\n'}or a made up representation
          {'\n'}to keep your journey private
        </ThemedText>

        <TextInput
          value={name}
          onChangeText={setName}
          placeholder="type here"
          placeholderTextColor="rgba(255,255,240,0.7)"
          style={styles.input}
          selectionColor={CTA}
        />
      </View>

      <Pressable
        style={[styles.cta, { backgroundColor: isValid ? CTA : CTA_DISABLED }]}
        disabled={!isValid}
        onPress={() => router.replace('/home')}
        accessibilityRole="button"
        accessibilityState={{ disabled: !isValid }}
      >
        <ThemedText type="defaultSemiBold" style={styles.ctaText}>Continue</ThemedText>
      </Pressable>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
  },
  logo: {
    width: 56,
    height: 56,
    borderRadius: 28,
    position: 'absolute',
    top: 24,
    left: 24,
  },
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    paddingHorizontal: 12,
  },
  title: {
    textAlign: 'center',
  },
  lead: {
    textAlign: 'center',
    opacity: 0.95,
  },
  helper: {
    textAlign: 'center',
    opacity: 0.7,
  },
  input: {
    marginTop: 8,
    alignSelf: 'stretch',
    borderWidth: 2,
    borderColor: CTA,
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 16,
    color: TEXT,
    fontSize: 16,
  },
  cta: {
    borderRadius: 28,
    paddingVertical: 16,
    paddingHorizontal: 24,
    alignSelf: 'stretch',
    marginTop: 16,
    marginBottom: 8,
  },
  ctaText: {
    color: '#fff',
    textAlign: 'center',
    fontSize: 18,
  },
});


