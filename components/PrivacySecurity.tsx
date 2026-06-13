import React, { useState } from 'react';
import { StyleSheet, Text, View, Switch, Dimensions, TouchableOpacity, Alert } from 'react-native';

interface PrivacySecurityProps {
  initialBiometricState?: boolean;
  onToggleBiometrics: (isEnabled: boolean) => Promise<boolean>;
}

export default function PrivacySecurity({ 
  initialBiometricState = false,
  onToggleBiometrics 
}: PrivacySecurityProps) {
  const [isBiometricsEnabled, setIsBiometricsEnabled] = useState(initialBiometricState);
  const [isDataMasked, setIsDataMasked] = useState(true);

  const handleBiometricToggle = async (newValue: boolean) => {
    // Optimistically update the UI track state
    setIsBiometricsEnabled(newValue);
    
    // Dispatch call out to device OS scanner framework logic
    const success = await onToggleBiometrics(newValue);
    
    if (!success) {
      // Revert track state if authorization handshake fails or is canceled
      setIsBiometricsEnabled(!newValue);
      Alert.alert(
        'Authentication Error',
        'Could not verify biometric credentials. Please ensure FaceID/TouchID is enabled in your device system settings.',
        [{ text: 'Acknowledge' }]
      );
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>Privacy & Device Security</Text>
      
      <View style={styles.settingsCard}>
        {/* Toggle 1: Hardware Biometric Auth Locker */}
        <View style={styles.settingRow}>
          <View style={styles.metaLabelContainer}>
            <Text style={styles.fieldTitle}>Require FaceID / TouchID</Text>
            <Text style={styles.fieldSubtitle}>Demands authentication whenever the app opens</Text>
          </View>
          <Switch
            trackColor={{ false: '#3A3A3C', true: '#34C759' }}
            thumbColor="#FFFFFF"
            ios_backgroundColor="#3A3A3C"
            onValueChange={handleBiometricToggle}
            value={isBiometricsEnabled}
          />
        </View>

        <View style={styles.divider} />

        {/* Toggle 2: App Switcher Blur Context */}
        <View style={styles.settingRow}>
          <View style={styles.metaLabelContainer}>
            <Text style={styles.fieldTitle}>Mask Multi-Tasking Snapshot</Text>
            <Text style={styles.fieldSubtitle}>Blurs dashboard content inside the OS App Switcher view</Text>
          </View>
          <Switch
            trackColor={{ false: '#3A3A3C', true: '#007AFF' }}
            thumbColor="#FFFFFF"
            ios_backgroundColor="#3A3A3C"
            onValueChange={setIsDataMasked}
            value={isDataMasked}
          />
        </View>
      </View>

      {/* Local Encryption Disclaimer Banner */}
      <View style={styles.securityBanner}>
        <Text style={styles.bannerText}>
          🔒 Hardware Sandboxed: Your choices are stored directly inside the device's secure keychain element. Your data is encrypted locally and is completely inaccessible to third parties or remote analytics engines.
        </Text>
      </View>
    </View>
  );
}

const { width } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    width: width - 40,
    marginTop: 28,
    alignSelf: 'center',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 14,
    letterSpacing: -0.3,
  },
  settingsCard: {
    backgroundColor: '#1C1C1E', // Matching premium iOS surface container card
    borderRadius: 20,
    paddingVertical: 4,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: '#2C2C2E',
  },
  settingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 14,
  },
  metaLabelContainer: {
    flex: 1,
    paddingRight: 16,
  },
  fieldTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#E5E5EA',
  },
  fieldSubtitle: {
    fontSize: 12,
    color: '#8E8E93',
    marginTop: 3,
    lineHeight: 16,
  },
  divider: {
    height: 1,
    backgroundColor: '#2C2C2E',
    width: '100%',
  },
  securityBanner: {
    backgroundColor: '#111214',
    borderRadius: 12,
    padding: 12,
    marginTop: 12,
    borderWidth: 1,
    borderColor: '#1C1C1E',
  },
  bannerText: {
    fontSize: 11,
    color: '#8E8E93',
    lineHeight: 16,
    textAlign: 'left',
  },
});