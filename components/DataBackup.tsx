import React, { useState } from 'react';
import { StyleSheet, Text, View, Dimensions, TouchableOpacity, Alert, Share, TextInput } from 'react-native';

interface DataBackupProps {
  onFetchLocalBackupPayload: () => Promise<object>;
  onRestoreLocalBackupPayload: (parsedData: object) => Promise<boolean>;
  onResetDemoData: () => void;
}

export default function DataBackup({ onFetchLocalBackupPayload, onRestoreLocalBackupPayload, onResetDemoData }: DataBackupProps) {
  const [isExporting, setIsExporting] = useState(false);
  const [isImporting, setIsImporting] = useState(false);
  const [lastExport, setLastExport] = useState('');
  const [importText, setImportText] = useState('');

  const handleExportData = async () => {
    setIsExporting(true);
    try {
      const databaseSnapshot = await onFetchLocalBackupPayload();
      const payloadString = JSON.stringify(databaseSnapshot, null, 2);
      setLastExport(payloadString);
      const formattedDate = new Date().toISOString().split('T')[0];

      const result = await Share.share({
        message: payloadString,
        title: `Rewire_Backup_${formattedDate}.json`,
      });

      if (result.action === Share.sharedAction) {
        Alert.alert('Export Successful', 'Your local profile history has been exported as JSON.');
      }
    } catch {
      Alert.alert('Export Aborted', 'An unexpected exception occurred while assembling local data.');
    } finally {
      setIsExporting(false);
    }
  };

  const handleImportData = async () => {
    if (!importText.trim()) {
      Alert.alert('Paste Backup JSON', 'Paste a backup JSON payload into the restore field first.');
      return;
    }

    Alert.alert(
      'Overwrite Database?',
      'Importing this snapshot will replace your current local streaks, budgets, cravings, and relapse logs.',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Restore', 
          style: 'destructive',
          onPress: async () => {
            setIsImporting(true);
            try {
              const parsed = JSON.parse(importText);
              const success = await onRestoreLocalBackupPayload(parsed);
              if (success) {
                setImportText('');
                Alert.alert('Restore Complete', 'Your local app data has been replaced with the imported backup.');
              } else {
                Alert.alert('Import Failed', 'The pasted JSON does not match the Rewire backup schema.');
              }
            } catch {
              Alert.alert('Import Failed', 'The pasted text is not valid JSON.');
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
          Manage your independent recovery data manually. The demo exports the current local state as JSON and restores from pasted backup JSON.
        </Text>

        <View style={styles.buttonStackRow}>
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

        {lastExport ? (
          <View style={styles.previewBox}>
            <Text style={styles.previewLabel}>Latest Export Preview</Text>
            <Text style={styles.previewText} numberOfLines={5}>{lastExport}</Text>
          </View>
        ) : null}

        <TextInput
          style={styles.importInput}
          value={importText}
          onChangeText={setImportText}
          multiline
          placeholder="Paste Rewire backup JSON here"
          placeholderTextColor="#636366"
        />

        <TouchableOpacity style={styles.resetButton} onPress={onResetDemoData} activeOpacity={0.75}>
          <Text style={styles.resetButtonText}>Reset Local Demo Data</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const { width } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    width: width - 40,
    marginTop: 28,
    marginBottom: 120,
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
    backgroundColor: '#1C1C1E',
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
    backgroundColor: 'rgba(255, 59, 48, 0.15)',
    borderWidth: 1,
    borderColor: 'rgba(255, 59, 48, 0.3)',
  },
  buttonLabel: {
    fontSize: 13,
    fontWeight: '700',
    color: '#FFFFFF',
    letterSpacing: -0.1,
  },
  previewBox: {
    backgroundColor: '#111214',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#2C2C2E',
    padding: 12,
    marginTop: 14,
  },
  previewLabel: {
    color: '#8E8E93',
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 1,
    marginBottom: 8,
  },
  previewText: {
    color: '#AEAEB2',
    fontSize: 11,
    lineHeight: 16,
    fontFamily: 'Courier',
  },
  importInput: {
    minHeight: 92,
    backgroundColor: '#111214',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#2C2C2E',
    color: '#FFFFFF',
    padding: 12,
    marginTop: 14,
    textAlignVertical: 'top',
    fontSize: 12,
  },
  resetButton: {
    height: 42,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 14,
    borderWidth: 1,
    borderColor: '#3A3A3C',
  },
  resetButtonText: {
    color: '#AEAEB2',
    fontSize: 13,
    fontWeight: '700',
  },
});
