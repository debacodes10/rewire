import React from 'react';
import { Alert, StyleSheet, Text, ScrollView, Dimensions, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import ProfileConfigs from '../components/ProfileConfigs';
import PrivacySecurity from '../components/PrivacySecurity';
import DataBackup from '../components/DataBackup';
import { CurrencyCode, useAppState } from '../state/AppState';
import { authenticateForAppUnlock, getLocalAuthLabel } from '../services/localAuth';

export default function Settings() {
  const { data, updateFinancialSettings, updatePrivacySettings, exportBackup, restoreBackup, resetDemoData } = useAppState();

  const handleBiometricAuthExchange = async (isEnabled: boolean): Promise<boolean> => {
    if (!isEnabled) {
      updatePrivacySettings({ biometricsEnabled: false });
      return true;
    }

    const result = await authenticateForAppUnlock('Enable Rewire app lock');

    if (!result.success) {
      const authLabel = getLocalAuthLabel(result.biometryType);
      Alert.alert(
        'Could not enable app lock',
        result.error || `Rewire could not verify ${authLabel}. Check your device settings and try again.`,
      );
      return false;
    }

    updatePrivacySettings({ biometricsEnabled: isEnabled });
    return true;
  };

  const handleCompileBackupData = async (): Promise<object> => {
    return {
      ...exportBackup(),
      exported_at: new Date().toISOString(),
    };
  };

  const handleRestoreBackupData = async (parsedData: object): Promise<boolean> => {
    return restoreBackup(parsedData);
  };

  const handleResetDemo = () => {
    Alert.alert(
      'Reset local demo?',
      'This clears onboarding, settings, cravings, and relapse logs in the current local store.',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Reset', style: 'destructive', onPress: resetDemoData },
      ],
    );
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
        <ProfileConfigs
          initialWeedBudget={String(data.settings.weedDailyBudget)}
          initialNicotineBudget={String(data.settings.nicotineDailyBudget)}
          initialCurrency={data.settings.currency}
          onSaveConfigurations={(weed, nicotine, currency: CurrencyCode) => updateFinancialSettings(weed, nicotine, currency)}
        />

        <PrivacySecurity
          initialBiometricState={data.settings.biometricsEnabled}
          initialMaskState={data.settings.maskInSwitcher}
          onToggleBiometrics={handleBiometricAuthExchange}
          onToggleMask={isEnabled => updatePrivacySettings({ maskInSwitcher: isEnabled })}
        />

        <DataBackup 
          onFetchLocalBackupPayload={handleCompileBackupData}
          onRestoreLocalBackupPayload={handleRestoreBackupData}
          onResetDemoData={handleResetDemo}
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
    paddingBottom: 40,
  },
});
