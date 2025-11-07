import { Stack } from 'expo-router';


export default function OnboardingLayout() {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ title: 'Introduction' }} />
      <Stack.Screen name="name" options={{ title: 'Name your habit' }} />
      <Stack.Screen name="logging" options={{ title: 'How logging works' }} />
      <Stack.Screen name="summary" options={{ title: 'Ready to start' }} />
    </Stack>
  );
}


