import { Stack } from 'expo-router';

export default function AuthLayout(): React.ReactNode {
  return (
    <Stack screenOptions={{ headerShown: false, animation: 'fade' }}>
      <Stack.Screen name="login" />
      <Stack.Screen name="biometric" />
    </Stack>
  );
}
