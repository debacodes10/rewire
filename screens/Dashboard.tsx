import React from 'react';
import { StyleSheet, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import HeroCounter from '../components/HeroCounter';
import SubstanceToggle from '../components/SubstanceToggle';
import QuickStats from '../components/QuickStats';
import PanicButton from '../components/PanicButton';
import { SubstanceType, useAppState } from '../state/AppState';

interface DashboardProps {
  currentSubstance: SubstanceType;
  onSubstanceChange: (substance: SubstanceType) => void;
}

export default function Dashboard({ currentSubstance, onSubstanceChange }: DashboardProps) {
  const { data, logCraving, logRelapse } = useAppState();

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>

        <SubstanceToggle
          activeSubstance={currentSubstance}
          onSubstanceChange={onSubstanceChange}
        />

        <HeroCounter substance={currentSubstance} quitDate={data.profiles[currentSubstance].quitDate} />

        <QuickStats substance={currentSubstance} data={data} />

        <PanicButton
          substance={currentSubstance}
          onCravingDefeated={({ intensity, trigger }) => logCraving({ substance_type: currentSubstance, intensity, trigger })}
          onRelapseLogged={({ intensity, trigger }) => logRelapse({ substance_type: currentSubstance, intensity, trigger, notes: `Slip after ${trigger.toLowerCase()} craving.` })}
        />

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#0F0F10',
  },
  scrollContainer: {
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingTop: 20,
    paddingBottom: 60,
  },
});
