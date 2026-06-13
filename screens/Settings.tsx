import React from 'react';
import { StyleSheet, Text, ScrollView, Dimensions, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import ProfileConfigs from '../components/ProfileConfigs';
import PrivacySecurity from '../components/PrivacySecurity';
import DataBackup from '../components/DataBackup'; // New Import

export default function Settings() {
  const handleConfigSync = (weed: number, nicotine: number, currency: string) => {
    console.log(`Zustand Sync -> Budget Weed: $${weed}, Budget Nicotine: $${nicotine}, Currency Token: ${currency}`);
  };

  const handleBiometricAuthExchange = async (isEnabled: boolean): Promise<boolean> => {
    return new Promise((resolve) => setTimeout(() => resolve(true), 600));
  };

  // Mock hooks preparing for direct mapping to our Zustand local store queries
  const handleCompileBackupData = async (): Promise<object> => {
    return {
      version: "1.0.0",
      exported_at: new Date().toISOString(),
      user_matrix: { currency: "USD", daily_budget_weed: 15.00, daily_budget_nicotine: 8.50 },
      streaks: [{ substance: "weed", duration_seconds: 432000 }],
      craving_logs: [],
      relapse_logs: []
    };
  };

  const handleRestoreBackupData = async (parsedData: object): Promise<boolean> => {
    console.log("Injecting validated payload directly into MMKV cell arrays...", parsedData);
    return true;
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.headerWrapper}>
        <Text style={styles.headerTitle}>Settings & Controls</Text>
        <Text style={styles.headerSubtitle}>Account-Free. Offline-First. 100% Private.</Text>
      </View>

      <ScrollView 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Component 1: Financial Run-Rate Profiles */}
        <ProfileConfigs onSaveConfigurations={handleConfigSync} />
        
        {/* Component 2: Hardware Biometric Locker Toggle */}
        <PrivacySecurity onToggleBiometrics={handleBiometricAuthExchange} />

        {/* Component 3: Data Backup & JSON Portability Utility */}
        <DataBackup 
          onFetchLocalBackupPayload={handleCompileBackupData}
          onRestoreLocalBackupPayload={handleRestoreBackupData}
        />
      </ScrollView>
    </SafeAreaView>
  );
}

const { width } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0F0F10',
  },
  headerWrapper: {
    width: width - 40,
    alignSelf: 'center',
    marginTop: 16,
    marginBottom: 8,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: -0.5,
  },
  headerSubtitle: {
    fontSize: 13,
    color: '#8E8E93',
    marginTop: 4,
  },
  scrollContent: {
    paddingBottom: 40, // Reset tight bounds since container child spacing handles floating offset clearances [cite: 15]
  },
});