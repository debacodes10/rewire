import ReactNativeBiometrics, { type BiometryType } from 'react-native-biometrics';

export type LocalAuthResult = {
  success: boolean;
  biometryType?: BiometryType;
  error?: string;
};

const biometrics = new ReactNativeBiometrics({ allowDeviceCredentials: true });

export async function getLocalAuthAvailability(): Promise<LocalAuthResult> {
  try {
    const result = await biometrics.isSensorAvailable();
    return {
      success: result.available,
      biometryType: result.biometryType,
      error: result.error,
    };
  } catch (error) {
    return {
      success: false,
      error: getErrorMessage(error),
    };
  }
}

export async function authenticateForAppUnlock(promptMessage = 'Unlock Rewire'): Promise<LocalAuthResult> {
  const availability = await getLocalAuthAvailability();

  if (!availability.success) {
    return availability;
  }

  try {
    const result = await biometrics.simplePrompt({
      promptMessage,
      fallbackPromptMessage: 'Use Passcode',
      cancelButtonText: 'Cancel',
    });

    return {
      success: result.success,
      biometryType: availability.biometryType,
      error: result.error,
    };
  } catch (error) {
    return {
      success: false,
      biometryType: availability.biometryType,
      error: getErrorMessage(error),
    };
  }
}

export function getLocalAuthLabel(type?: BiometryType) {
  if (type === 'FaceID') {
    return 'Face ID';
  }

  if (type === 'TouchID') {
    return 'Touch ID';
  }

  return 'biometrics';
}

function getErrorMessage(error: unknown) {
  return error instanceof Error ? error.message : 'Local authentication is unavailable.';
}
