import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, Switch, Dimensions } from 'react-native';

interface PrivacySecurityProps {
  initialBiometricState?: boolean;
  initialMaskState?: boolean;
  onToggleBiometrics: (isEnabled: boolean) => Promise<boolean>;
  onToggleMask: (isEnabled: boolean) => void;
}

export default function PrivacySecurity({ 
  initialBiometricState = false,
  initialMaskState = true,
  onToggleBiometrics,
  onToggleMask,
}: PrivacySecurityProps) {
  const [isBiometricsEnabled, setIsBiometricsEnabled] = useState(initialBiometricState);
  const [isDataMasked, setIsDataMasked] = useState(initialMaskState);
  const [authStatus, setAuthStatus] = useState<string | undefined>();

  useEffect(() => {
    setIsBiometricsEnabled(initialBiometricState);
  }, [initialBiometricState]);

  useEffect(() => {
    setIsDataMasked(initialMaskState);
  }, [initialMaskState]);

  const handleBiometricToggle = async (newValue: boolean) => {
    setAuthStatus(undefined);
    setIsBiometricsEnabled(newValue);
    
    const success = await onToggleBiometrics(newValue);
    
    if (!success) {
      setIsBiometricsEnabled(!newValue);
      setAuthStatus('App lock was not enabled. Verify your device credentials and try again.');
      return;
    }

    setAuthStatus(newValue ? 'App lock is enabled for the next launch.' : 'App lock is disabled.');
  };

  const handleMaskToggle = (newValue: boolean) => {
    setIsDataMasked(newValue);
    onToggleMask(newValue);
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
        {authStatus && <Text style={styles.statusText}>{authStatus}</Text>}

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
            onValueChange={handleMaskToggle}
            value={isDataMasked}
          />
        </View>
      </View>

      {/* Local Encryption Disclaimer Banner */}
      <View style={styles.securityBanner}>
        <Text style={styles.bannerText}>
          🔒 Local-first: Your settings and recovery logs stay inside the local app data layer. No remote account, analytics pipeline, or API sync is required for this demo flow.
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
  statusText: {
    color: '#8E8E93',
    fontSize: 11,
    lineHeight: 16,
    marginBottom: 10,
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
