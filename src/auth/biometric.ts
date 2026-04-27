import * as LocalAuthentication from 'expo-local-authentication';

export async function isBiometricAvailable(): Promise<boolean> {
  const compatible = await LocalAuthentication.hasHardwareAsync();
  if (!compatible) return false;
  const enrolled = await LocalAuthentication.isEnrolledAsync();
  return enrolled;
}

export async function authenticateWithBiometric(): Promise<boolean> {
  const available = await isBiometricAvailable();
  if (!available) return true; // gracefully bypass on devices without biometrics
  const result = await LocalAuthentication.authenticateAsync({
    promptMessage: 'Unlock Ohanafy Field',
    fallbackLabel: 'Use passcode',
    disableDeviceFallback: false,
  });
  return result.success;
}
