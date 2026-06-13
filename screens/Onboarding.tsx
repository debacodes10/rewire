import React, { useMemo, useState } from 'react';
import { Alert, Dimensions, Keyboard, ScrollView, StyleSheet, Switch, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { CURRENCY_SYMBOLS, CurrencyCode, OnboardingPayload, SubstanceType } from '../state/AppState';
import { authenticateForAppUnlock, getLocalAuthLabel } from '../services/localAuth';

interface OnboardingProps {
  onComplete: (payload: OnboardingPayload) => void;
}

const currencyOptions = Object.keys(CURRENCY_SYMBOLS) as CurrencyCode[];

export default function Onboarding({ onComplete }: OnboardingProps) {
  const [enabled, setEnabled] = useState<Record<SubstanceType, boolean>>({ weed: true, nicotine: true });
  const [currency, setCurrency] = useState<CurrencyCode>('INR');
  const [weedBudget, setWeedBudget] = useState('450');
  const [nicotineBudget, setNicotineBudget] = useState('200');
  const [weedDaysAgo, setWeedDaysAgo] = useState(3);
  const [nicotineDaysAgo, setNicotineDaysAgo] = useState(2);
  const [biometricsEnabled, setBiometricsEnabled] = useState(false);
  const [maskInSwitcher, setMaskInSwitcher] = useState(true);

  const selectedSubstances = useMemo(
    () => (Object.keys(enabled) as SubstanceType[]).filter(substance => enabled[substance]),
    [enabled],
  );

  const toggleSubstance = (substance: SubstanceType) => {
    setEnabled(current => {
      const next = { ...current, [substance]: !current[substance] };
      return next.weed || next.nicotine ? next : current;
    });
  };

  const completeSetup = () => {
    Keyboard.dismiss();
    const daysAgoToDate = (days: number) => new Date(Date.now() - Math.max(0, days) * 24 * 60 * 60 * 1000).toISOString();

    onComplete({
      enabledSubstances: selectedSubstances,
      quitDates: {
        weed: daysAgoToDate(weedDaysAgo),
        nicotine: daysAgoToDate(nicotineDaysAgo),
      },
      currency,
      weedDailyBudget: parseFloat(weedBudget.replace(/[^0-9.]/g, '')) || 0,
      nicotineDailyBudget: parseFloat(nicotineBudget.replace(/[^0-9.]/g, '')) || 0,
      biometricsEnabled,
      maskInSwitcher,
    });
  };

  const handleBiometricPreference = async (enabledValue: boolean) => {
    if (!enabledValue) {
      setBiometricsEnabled(false);
      return;
    }

    const result = await authenticateForAppUnlock('Enable Rewire app lock');

    if (!result.success) {
      const authLabel = getLocalAuthLabel(result.biometryType);
      Alert.alert(
        'Could not enable app lock',
        result.error || `Rewire could not verify ${authLabel}. You can turn this on later in Settings.`,
      );
      setBiometricsEnabled(false);
      return;
    }

    setBiometricsEnabled(true);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.heroBlock}>
          <Text style={styles.kicker}>PRIVATE RECOVERY TRACKER</Text>
          <Text style={styles.title}>Set your day zero.</Text>
          <Text style={styles.subtitle}>
            Rewire keeps your streaks, savings, cravings, and reflections on this device.
          </Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Tracked habits</Text>
          <View style={styles.segmentedRow}>
            {(['weed', 'nicotine'] as SubstanceType[]).map(substance => {
              const isActive = enabled[substance];
              const accent = substance === 'weed' ? '#34C759' : '#FF9F0A';
              return (
                <TouchableOpacity
                  key={substance}
                  activeOpacity={0.85}
                  style={[styles.substanceButton, isActive && { borderColor: accent, backgroundColor: `${accent}20` }]}
                  onPress={() => toggleSubstance(substance)}
                >
                  <Text style={[styles.substanceText, isActive && { color: accent }]}>
                    {substance === 'weed' ? 'Weed' : 'Nicotine'}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Quit timing</Text>
          <DayStepper label="Weed" value={weedDaysAgo} disabled={!enabled.weed} onChange={setWeedDaysAgo} />
          <View style={styles.divider} />
          <DayStepper label="Nicotine" value={nicotineDaysAgo} disabled={!enabled.nicotine} onChange={setNicotineDaysAgo} />
        </View>

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Money baseline</Text>
          <View style={styles.currencyRow}>
            {currencyOptions.map(code => (
              <TouchableOpacity
                key={code}
                activeOpacity={0.85}
                style={[styles.currencyButton, currency === code && styles.currencyActive]}
                onPress={() => setCurrency(code)}
              >
                <Text style={[styles.currencyText, currency === code && styles.currencyTextActive]}>
                  {CURRENCY_SYMBOLS[code]}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <MoneyInput label="Weed daily spend" symbol={CURRENCY_SYMBOLS[currency]} value={weedBudget} disabled={!enabled.weed} onChangeText={setWeedBudget} />
          <MoneyInput label="Nicotine daily spend" symbol={CURRENCY_SYMBOLS[currency]} value={nicotineBudget} disabled={!enabled.nicotine} onChangeText={setNicotineBudget} />
        </View>

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Privacy defaults</Text>
          <SettingSwitch label="Local app lock" value={biometricsEnabled} onValueChange={handleBiometricPreference} />
          <View style={styles.divider} />
          <SettingSwitch label="Mask app switcher" value={maskInSwitcher} onValueChange={setMaskInSwitcher} />
        </View>

        <TouchableOpacity activeOpacity={0.9} style={styles.startButton} onPress={completeSetup}>
          <Text style={styles.startButtonText}>Enter Dashboard</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

function DayStepper({ label, value, disabled, onChange }: { label: string; value: number; disabled: boolean; onChange: (value: number) => void }) {
  return (
    <View style={[styles.stepperRow, disabled && styles.disabledRow]}>
      <View>
        <Text style={styles.fieldTitle}>{label}</Text>
        <Text style={styles.fieldSubtitle}>{disabled ? 'Not tracked' : `${value} day${value === 1 ? '' : 's'} clean`}</Text>
      </View>
      <View style={styles.stepperControls}>
        <TouchableOpacity style={styles.stepperButton} disabled={disabled} onPress={() => onChange(Math.max(0, value - 1))}>
          <Text style={styles.stepperText}>-</Text>
        </TouchableOpacity>
        <TextInput
          style={styles.dayInput}
          editable={!disabled}
          keyboardType="number-pad"
          value={String(value)}
          onChangeText={text => onChange(parseInt(text.replace(/[^0-9]/g, ''), 10) || 0)}
        />
        <TouchableOpacity style={styles.stepperButton} disabled={disabled} onPress={() => onChange(value + 1)}>
          <Text style={styles.stepperText}>+</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

function MoneyInput({ label, symbol, value, disabled, onChangeText }: { label: string; symbol: string; value: string; disabled: boolean; onChangeText: (text: string) => void }) {
  return (
    <View style={[styles.moneyRow, disabled && styles.disabledRow]}>
      <Text style={styles.fieldTitle}>{label}</Text>
      <View style={styles.moneyInputWrapper}>
        <Text style={styles.symbolText}>{symbol}</Text>
        <TextInput
          style={styles.moneyInput}
          editable={!disabled}
          keyboardType="decimal-pad"
          value={value}
          maxLength={7}
          onChangeText={onChangeText}
        />
      </View>
    </View>
  );
}

function SettingSwitch({ label, value, onValueChange }: { label: string; value: boolean; onValueChange: (value: boolean) => void }) {
  return (
    <View style={styles.switchRow}>
      <Text style={styles.fieldTitle}>{label}</Text>
      <Switch
        value={value}
        onValueChange={onValueChange}
        trackColor={{ false: '#3A3A3C', true: '#34C759' }}
        thumbColor="#FFFFFF"
        ios_backgroundColor="#3A3A3C"
      />
    </View>
  );
}

const { width } = Dimensions.get('window');

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#0F0F10',
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 22,
    paddingBottom: 36,
  },
  heroBlock: {
    marginBottom: 22,
  },
  kicker: {
    color: '#34C759',
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 1.5,
    marginBottom: 10,
  },
  title: {
    color: '#FFFFFF',
    fontSize: 38,
    fontWeight: '800',
    letterSpacing: -0.6,
  },
  subtitle: {
    color: '#8E8E93',
    fontSize: 14,
    lineHeight: 20,
    marginTop: 8,
    maxWidth: width - 70,
  },
  card: {
    backgroundColor: '#1C1C1E',
    borderRadius: 22,
    borderWidth: 1,
    borderColor: '#2C2C2E',
    padding: 16,
    marginBottom: 14,
  },
  sectionTitle: {
    color: '#FFFFFF',
    fontSize: 17,
    fontWeight: '700',
    marginBottom: 14,
  },
  segmentedRow: {
    flexDirection: 'row',
    gap: 12,
  },
  substanceButton: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#3A3A3C',
    backgroundColor: '#2C2C2E',
    borderRadius: 14,
    paddingVertical: 13,
    alignItems: 'center',
  },
  substanceText: {
    color: '#AEAEB2',
    fontWeight: '700',
    fontSize: 14,
  },
  divider: {
    height: 1,
    backgroundColor: '#2C2C2E',
    marginVertical: 12,
  },
  stepperRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  disabledRow: {
    opacity: 0.35,
  },
  fieldTitle: {
    color: '#E5E5EA',
    fontSize: 15,
    fontWeight: '600',
  },
  fieldSubtitle: {
    color: '#8E8E93',
    fontSize: 12,
    marginTop: 3,
  },
  stepperControls: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  stepperButton: {
    width: 34,
    height: 34,
    borderRadius: 10,
    backgroundColor: '#2C2C2E',
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepperText: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: '700',
  },
  dayInput: {
    width: 46,
    height: 36,
    borderRadius: 10,
    backgroundColor: '#2C2C2E',
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
    textAlign: 'center',
    padding: 0,
  },
  currencyRow: {
    flexDirection: 'row',
    backgroundColor: '#2C2C2E',
    borderRadius: 12,
    padding: 4,
    marginBottom: 12,
  },
  currencyButton: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 8,
    borderRadius: 9,
  },
  currencyActive: {
    backgroundColor: '#3A3A3C',
  },
  currencyText: {
    color: '#AEAEB2',
    fontSize: 15,
    fontWeight: '700',
  },
  currencyTextActive: {
    color: '#FFFFFF',
  },
  moneyRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 12,
  },
  moneyInputWrapper: {
    width: 112,
    height: 40,
    borderRadius: 12,
    backgroundColor: '#2C2C2E',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
  },
  symbolText: {
    color: '#AEAEB2',
    fontWeight: '700',
    marginRight: 4,
  },
  moneyInput: {
    flex: 1,
    color: '#FFFFFF',
    fontWeight: '700',
    padding: 0,
  },
  switchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  startButton: {
    height: 54,
    borderRadius: 16,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 6,
  },
  startButtonText: {
    color: '#000000',
    fontSize: 16,
    fontWeight: '800',
  },
});
