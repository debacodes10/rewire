import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View, Dimensions } from 'react-native';
import { SubstanceType, useAppState } from '../state/AppState';

interface SubstanceToggleProps {
  activeSubstance: SubstanceType;
  onSubstanceChange: (substance: SubstanceType) => void;
}

export default function SubstanceToggle({ activeSubstance, onSubstanceChange }: SubstanceToggleProps) {
  const { data } = useAppState();

  return (
    <View style={styles.toggleContainer}>
      {/* Weed Tab */}
      <TouchableOpacity
        activeOpacity={0.8}
        style={[
          styles.tabButton,
          !data.profiles.weed.enabled && styles.disabledTab,
          activeSubstance === 'weed' && styles.activeWeedTab
        ]}
        disabled={!data.profiles.weed.enabled}
        onPress={() => onSubstanceChange('weed')}
      >
        <Text style={[
          styles.tabText,
          activeSubstance === 'weed' && styles.activeWeedText
        ]}>
        Weed
        </Text>
      </TouchableOpacity>

      {/* Nicotine Tab */}
      <TouchableOpacity
        activeOpacity={0.8}
        style={[
          styles.tabButton,
          !data.profiles.nicotine.enabled && styles.disabledTab,
          activeSubstance === 'nicotine' && styles.activeNicotineTab
        ]}
        disabled={!data.profiles.nicotine.enabled}
        onPress={() => onSubstanceChange('nicotine')}
      >
        <Text style={[
          styles.tabText,
          activeSubstance === 'nicotine' && styles.activeNicotineText
        ]}>
          Nicotine
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const { width } = Dimensions.get('window');

const styles = StyleSheet.create({
  toggleContainer: {
    flexDirection: 'row',
    width: width - 40,
    backgroundColor: '#1C1C1E', // Match Hero Card surface color
    borderRadius: 14,
    padding: 4,
    marginBottom: 20,
  },
  tabButton: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10,
  },
  disabledTab: {
    opacity: 0.35,
  },
  // Active state styling for Weed
  activeWeedTab: {
    backgroundColor: 'rgba(52, 199, 89, 0.15)', // Muted crisp translucent mint
    borderWidth: 1,
    borderColor: 'rgba(52, 199, 89, 0.4)',
  },
  activeWeedText: {
    color: '#34C759', // Sharp iOS green
    fontWeight: '700',
  },
  // Active state styling for Nicotine
  activeNicotineTab: {
    backgroundColor: 'rgba(255, 159, 10, 0.15)', // Muted translucent amber
    borderWidth: 1,
    borderColor: 'rgba(255, 159, 10, 0.4)',
  },
  activeNicotineText: {
    color: '#FF9F0A', // Sharp iOS orange
    fontWeight: '700',
  },
  tabText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#8E8E93', // Secondary text grey
  },
});
