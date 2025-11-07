import { useEffect, useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';

const BG = '#0D1B2A'; // wireframe navy

export default function WelcomeScreen() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    (async () => {
      const done = await AsyncStorage.getItem('onboarding:complete');
      if (done === 'true') {
        router.replace('/home');
      } else {
        setShow(true);
      }
    })();
  }, []);

  if (!show) return null;

  return (
    <ThemedView lightColor={BG} darkColor={BG} style={styles.container}>
      <View style={styles.center}>
        <LinearGradient colors={['#FFB86C', '#FF8A34']} style={styles.logo} />
        <ThemedText type="title" style={styles.title} lightColor="#FFFFF0" darkColor="#FFFFF0">
          Welcome to{'\n'}Habit Training!
        </ThemedText>
        <ThemedText style={styles.subtitle} lightColor="#FFFFF0" darkColor="#FFFFF0">
          A simple companion app that understands:{'\n'}Bad habits don’t define you
        </ThemedText>
      </View>

      <Pressable style={styles.cta} onPress={() => router.push('/onboarding')}>
        <ThemedText type="defaultSemiBold" style={styles.ctaText}>
          Get Started
        </ThemedText>
      </Pressable>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  center: {
    alignItems: 'center',
    gap: 16,
    marginTop: 100,
  },
  logo: {
    width: 140,
    height: 140,
    borderRadius: 70,
  },
  title: {
    textAlign: 'center',
  },
  subtitle: {
    textAlign: 'center',
    opacity: 0.8,
  },
  cta: {
    backgroundColor: '#12D6A7',
    borderRadius: 28,
    paddingVertical: 16,
    paddingHorizontal: 24,
    alignSelf: 'stretch',
  },
  ctaText: {
    color: '#fff',
    textAlign: 'center',
    fontSize: 18,
  },
});


