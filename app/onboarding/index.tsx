import { StyleSheet, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';

const BG = '#0D1B2A';
const TEXT = '#FFFFF0';
const CTA = '#12D6A7';

export default function OnboardingIntroScreen() {
  return (
    <ThemedView lightColor={BG} darkColor={BG} style={styles.container}>
      <LinearGradient colors={["#FFB86C", "#FF8A34"]} style={styles.logo} />

      <View style={styles.center}>
        <ThemedText type="title" style={styles.title} lightColor={TEXT} darkColor={TEXT}>
          First:
        </ThemedText>
        <ThemedText type ="title" style={styles.lead} lightColor={TEXT} darkColor={TEXT}>
          This is a guilt-free zone.
        </ThemedText>
        <ThemedText style={styles.body} lightColor={TEXT} darkColor={TEXT}>
          We know. LIFE IS HARD.
        </ThemedText>
        <ThemedText style={styles.body} lightColor={TEXT} darkColor={TEXT}>
          And sometimes, we build habits we would rather not have
        </ThemedText>

        <View style={styles.examples}>
          <ThemedText style={styles.examplesTitle} lightColor={TEXT} darkColor={TEXT}>
            Whether it’s:
          </ThemedText>
          <ThemedText style={styles.exampleItem} lightColor={TEXT} darkColor={TEXT}>cigarettes</ThemedText>
          <ThemedText style={styles.exampleItem} lightColor={TEXT} darkColor={TEXT}>alcohol</ThemedText>
          <ThemedText style={styles.exampleItem} lightColor={TEXT} darkColor={TEXT}>porn</ThemedText>
          <ThemedText style={styles.exampleItem} lightColor={TEXT} darkColor={TEXT}>sports gambling</ThemedText>
          <ThemedText style={styles.exampleItem} lightColor={TEXT} darkColor={TEXT}>etc.</ThemedText>
        </View>
      </View>

      <View style={[styles.cta, { backgroundColor: CTA }]} onTouchEnd={() => router.push('/onboarding/name')}>
        <ThemedText type="defaultSemiBold" style={styles.ctaText}>Continue</ThemedText>
      </View>
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
    gap: 8,
    paddingHorizontal: 12,
  },
  title: {
    textAlign: 'center',
  },
  lead: {
    textAlign: 'center',
    opacity: 0.95,
  },
  body: {
    textAlign: 'center',
    opacity: 0.9,
  },
  examples: {
    marginTop: 20,
    alignItems: 'center',
  },
  examplesTitle: {
    opacity: 0.9,
  },
  exampleItem: {
    opacity: 0.8,
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


