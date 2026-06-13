import React from 'react';
import { StyleSheet, ScrollView, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import SubstanceToggle from '../components/SubstanceToggle';
import StreakCalendar from '../components/StreakCalender';
import TriggerBreakdown from '../components/TriggerBreakdown';
import RelapseLedger from '../components/RelapseLedger';
import { SubstanceType, useAppState } from '../state/AppState';

interface AnalyticsProps {
  currentSubstance: SubstanceType;
  onSubstanceChange: (substance: SubstanceType) => void;
}

export default function Analytics({ currentSubstance, onSubstanceChange }: AnalyticsProps) {
  const { data } = useAppState();

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>

        <SubstanceToggle 
          activeSubstance={currentSubstance} 
          onSubstanceChange={onSubstanceChange}
        />

        <Text style={styles.sectionHeader}>CONSISTENCY MATRIX</Text>
        <StreakCalendar substance={currentSubstance} data={data} />

        <Text style={styles.sectionHeader}>BEHAVIORAL DISTRIBUTION</Text>
        <TriggerBreakdown substance={currentSubstance} data={data} />

        <RelapseLedger substance={currentSubstance} data={data} />

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
    paddingBottom: 110, // Generous breathing room so elements never hide behind floating tab pill
  },
  sectionHeader: {
    alignSelf: 'flex-start',
    marginLeft: 24,
    fontSize: 11,
    fontWeight: '700',
    color: '#636366',
    letterSpacing: 1.5,
    marginTop: 20,
    marginBottom: 4,
  },
});
