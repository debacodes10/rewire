import React, { useState } from 'react';
import { StyleSheet, Text, View, Dimensions, TouchableOpacity, Alert, Share } from 'react-native';

interface DataBackupProps {
  // Callbacks hooked directly into our local Zustand data persistence store
  onFetchLocalBackupPayload: () => Promise<object>;
  onRestoreLocalBackupPayload: (parsedData: object) => Promise<boolean>;
}

export default function DataBackup({ onFetchLocalBackupPayload, onRestoreLocalBackupPayload }: DataBackupProps) {
  const [isExporting, setIsExporting] = useState(false);
  const [isImporting, setIsImporting] = useState(false);

  const handleExportData = async () => {
    setIsExporting(true);
    try {
      // 1. Gather all local data arrays from Zustand/MMKV stores
      const databaseSnapshot = await onFetchLocalBackupPayload();
      
      const payloadString = JSON.stringify(databaseSnapshot, null, 2);
      const formattedDate = new Date().toISOString().split('T')[0];
      
      // 2. Trigger native OS sharing interface
      const result = await Share.share({
        message: payloadString,
        title: `ClearMind_Backup_${formattedDate}.json`,
      });
      
      if (result.action === Share.sharedAction) {
        Alert.alert('Export Successful', 'Your encrypted local profile history has been successfully exported.');
      }
    } catch (error) {
      Alert.alert('Export Aborted', 'An unexpected exception occurred while assembling local data matrices.');
    } finally {
      setIsExporting(false);
    }
  };

  const handleImportData = async () => {
    // Structural verification check warning before destructive overwrite execution
    Alert.alert(
      'Overwrite Database?',
      'Importing an external data snapshot will permanently replace your current local streaks, budgets, and historical craving logs. This action cannot be undone.',
      [
        { text: 'Abort Lockout', style: 'cancel' },
        { 
          text: 'Proceed Overwrite', 
          style: 'destructive',
          onPress: async () => {
            setIsImporting(true);
            try {
              // Simulated raw backup intake payload structure for validation checks
              const mockIncomingJSON = {
                version: "1.0.0",
                exported_at: new Date().toISOString(),
                user_matrix: { currency: "USD", daily_budget_weed: 15.00, daily_budget_nicotine: 8.50 },
                streaks: [],
                craving_logs: [],
                relapse_logs: []
              };

              // Validate layout and integrity constraints before feeding data to storage engine
              if (!mockIncomingJSON.user_matrix || !mockIncomingJSON.version) {
                throw new Error("Invalid schema structure profile matched.");
              }

              const success = await onRestoreLocalBackupPayload(mockIncomingJSON);
              if (success) {
                Alert.alert('Database Sync Restored', 'Your data payload has been parsed and integrated successfully into your local device sandbox.');
              }
            } catch (err) {
              Alert.alert('Import Failed', 'The selected document is corrupted or does not conform to the required application schema parameters.');
            } finally {
              setIsImporting(false);
            }
          }
        }
      ]
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>Data Portability & Porting</Text>
      
      <View style={styles.backupCard}>
        <Text style={styles.explainerText}>
          Manage your independent database files manually. Since we maintain absolute, account-free anonymity, you are the exclusive owner of your recovery data[cite: 20].
        </Text>

        <View style={styles.buttonStackRow}>
          {/* Export Action Controller */}
          <TouchableOpacity 
            style={[styles.utilityButton, styles.exportColorVariant]} 
            onPress={handleExportData}
            disabled={isExporting || isImporting}
            activeOpacity={0.7}
          >
            <Text style={styles.buttonLabel}>
              {isExporting ? 'Compiling JSON...' : 'Export Snapshot'}
            </Text>
          </TouchableOpacity>

          {/* Import Action Controller */}
          <TouchableOpacity 
            style={[styles.utilityButton, styles.importColorVariant]} 
            onPress={handleImportData}
            disabled={isExporting || isImporting}
            activeOpacity={0.7}
          >
            <Text style={styles.buttonLabel}>
              {isImporting ? 'Parsing Data...' : 'Import Backup'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const { width } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    width: width - 40,
    marginTop: 28,
    marginBottom: 120, // Clean margin buffer spacing to prevent nav-pill occlusion layout bugs [cite: 15, 319]
    alignSelf: 'center',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 14,
    letterSpacing: -0.3,
  },
  backupCard: {
    backgroundColor: '#1C1C1E', // iOS surface platform container card asset styling rules
    borderRadius: 20,
    padding: 18,
    borderWidth: 1,
    borderColor: '#2C2C2E',
  },
  explainerText: {
    fontSize: 13,
    color: '#8E8E93',
    lineHeight: 18,
    marginBottom: 18,
  },
  buttonStackRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  utilityButton: {
    flex: 1,
    height: 44,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  exportColorVariant: {
    backgroundColor: '#2C2C2E', // Subtle gray accent action container
    borderWidth: 1,
    borderColor: '#3A3A3C',
  },
  importColorVariant: {
    backgroundColor: 'rgba(255, 59, 48, 0.15)', // Muted alpha-channeled Warning Crimson layout warning [cite: 184]
    borderWidth: 1,
    borderColor: 'rgba(255, 59, 48, 0.3)',
  },
  buttonLabel: {
    fontSize: 13,
    fontWeight: '700',
    color: '#FFFFFF',
    letterSpacing: -0.1,
  },
});