import React, { useState } from 'react';
import { StyleSheet, Text, View, TextInput, Dimensions, TouchableOpacity, Keyboard } from 'react-native';

// Supported currency formats for localization mapping
type CurrencyCode = 'USD' | 'EUR' | 'GBP' | 'INR';

interface ProfileConfigsProps {
  initialWeedBudget?: string;
  initialNicotineBudget?: string;
  initialCurrency?: CurrencyCode;
  onSaveConfigurations: (weedBudget: number, nicotineBudget: number, currency: CurrencyCode) => void;
}

const CURRENCY_SYMBOLS: Record<CurrencyCode, string> = {
  USD: '$',
  EUR: '€',
  GBP: '£',
  INR: '₹',
};

export default function ProfileConfigs({ 
  initialWeedBudget = '15.00', 
  initialNicotineBudget = '8.50',
  initialCurrency = 'USD',
  onSaveConfigurations 
}: ProfileConfigsProps) {
  const [weedBudget, setWeedBudget] = useState(initialWeedBudget);
  const [nicotineBudget, setNicotineBudget] = useState(initialNicotineBudget);
  const [currency, setCurrency] = useState<CurrencyCode>(initialCurrency);
  const [isSaved, setIsSaved] = useState(false);

  const handleSave = () => {
    Keyboard.dismiss();
    
    // Defensive parsing to clean up input strings safely before calculations
    const parsedWeed = parseFloat(weedBudget.replace(/[^0-9.]/g, '')) || 0;
    const parsedNicotine = parseFloat(nicotineBudget.replace(/[^0-9.]/g, '')) || 0;
    
    setWeedBudget(parsedWeed.toFixed(2));
    setNicotineBudget(parsedNicotine.toFixed(2));
    
    // Dispatch all adjusted settings up to the state engine
    onSaveConfigurations(parsedWeed, parsedNicotine, currency);
    
    // Trigger success feedback micro-interaction
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2500);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>Global App Configurations</Text>
      
      <View style={styles.settingsCard}>
        {/* Row 1: Currency Format Selector */}
        <View style={styles.pickerRow}>
          <View style={styles.metaLabelContainer}>
            <Text style={styles.fieldTitle}>Currency Token</Text>
            <Text style={styles.fieldSubtitle}>Localizes metric trackers app-wide</Text>
          </View>
          
          <View style={styles.segmentedControl}>
            {(Object.keys(CURRENCY_SYMBOLS) as CurrencyCode[]).map((code) => {
              const isActive = currency === code;
              return (
                <TouchableOpacity
                  key={code}
                  style={[styles.segmentButton, isActive && styles.segmentActive]}
                  onPress={() => setCurrency(code)}
                  activeOpacity={0.9}
                >
                  <Text style={[styles.segmentText, isActive && styles.segmentTextActive]}>
                    {CURRENCY_SYMBOLS[code]}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        <View style={styles.divider} />

        {/* Row 2: Weed Daily Budget Input */}
        <View style={styles.inputRow}>
          <View style={styles.metaLabelContainer}>
            <Text style={styles.fieldTitle}>Weed Daily Budget</Text>
            <Text style={styles.fieldSubtitle}>Avg. spent per day prior to day zero</Text>
          </View>
          <View style={[styles.inputWrapper, styles.weedFocusBorder]}>
            <Text style={styles.currencySymbol}>{CURRENCY_SYMBOLS[currency]}</Text>
            <TextInput
              style={styles.textInput}
              keyboardType="decimal-pad"
              value={weedBudget}
              onChangeText={setWeedBudget}
              placeholder="0.00"
              placeholderTextColor="#48484A"
              maxLength={7}
            />
          </View>
        </View>

        <View style={styles.divider} />

        {/* Row 3: Nicotine Daily Budget Input */}
        <View style={styles.inputRow}>
          <View style={styles.metaLabelContainer}>
            <Text style={styles.fieldTitle}>Nicotine Daily Budget</Text>
            <Text style={styles.fieldSubtitle}>Avg. spent per day on pods or vapes</Text>
          </View>
          <View style={[styles.inputWrapper, styles.nicotineFocusBorder]}>
            <Text style={styles.currencySymbol}>{CURRENCY_SYMBOLS[currency]}</Text>
            <TextInput
              style={styles.textInput}
              keyboardType="decimal-pad"
              value={nicotineBudget}
              onChangeText={setNicotineBudget}
              placeholder="0.00"
              placeholderTextColor="#48484A"
              maxLength={7}
            />
          </View>
        </View>
      </View>

      {/* Action CTA */}
      <TouchableOpacity 
        style={[styles.saveButton, isSaved && styles.savedActiveSuccess]} 
        onPress={handleSave}
        activeOpacity={0.8}
      >
        <Text style={styles.saveButtonText}>
          {isSaved ? '✓ Configurations Applied Locally' : 'Update Financial Matrix'}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const { width } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    width: width - 40,
    marginTop: 20,
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
    backgroundColor: '#1C1C1E',
    borderRadius: 20,
    paddingVertical: 4,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: '#2C2C2E',
  },
  inputRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 14,
  },
  pickerRow: {
    flexDirection: 'column',
    paddingVertical: 14,
    gap: 12,
  },
  metaLabelContainer: {
    flex: 1,
  },
  fieldTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#E5E5EA',
  },
  fieldSubtitle: {
    fontSize: 12,
    color: '#8E8E93',
    marginTop: 2,
    lineHeight: 15,
  },
  segmentedControl: {
    flexDirection: 'row',
    backgroundColor: '#2C2C2E',
    borderRadius: 10,
    padding: 3,
    width: '100%',
    justifyContent: 'space-between',
  },
  segmentButton: {
    flex: 1,
    paddingVertical: 8,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 7,
  },
  segmentActive: {
    backgroundColor: '#3A3A3C', // Slightly brighter gray layer to highlight selection
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.5,
    elevation: 2,
  },
  segmentText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#AEAEB2',
  },
  segmentTextActive: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#2C2C2E',
    borderRadius: 12,
    width: 110,
    height: 40,
    paddingHorizontal: 10,
  },
  weedFocusBorder: {
    borderWidth: 1,
    borderColor: 'rgba(52, 199, 89, 0.2)',
  },
  nicotineFocusBorder: {
    borderWidth: 1,
    borderColor: 'rgba(255, 159, 10, 0.2)',
  },
  currencySymbol: {
    fontSize: 15,
    fontWeight: '600',
    color: '#AEAEB2',
    marginRight: 4,
  },
  textInput: {
    flex: 1,
    fontSize: 15,
    fontWeight: '700',
    color: '#FFFFFF',
    padding: 0,
    fontVariant: ['tabular-nums'],
  },
  divider: {
    height: 1,
    backgroundColor: '#2C2C2E',
    width: '100%',
  },
  saveButton: {
    backgroundColor: '#007AFF',
    borderRadius: 14,
    height: 48,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 16,
  },
  savedActiveSuccess: {
    backgroundColor: '#34C759',
  },
  saveButtonText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#FFFFFF',
    letterSpacing: -0.1,
  },
});