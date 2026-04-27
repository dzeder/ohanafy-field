import { Stack } from 'expo-router';

export default function OnboardingLayout(): React.ReactNode {
  return <Stack screenOptions={{ headerShown: false, animation: 'slide_from_right' }} />;
}
