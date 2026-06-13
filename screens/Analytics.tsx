import React, { useState } from 'react';
import { StyleSheet, View, ScrollView, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import SubstanceToggle, { SubstanceType } from '../components/SubstanceToggle';
import StreakCalendar from '../components/StreakCalender';
import TriggerBreakdown from '../components/TriggerBreakdown'; // Import new module
import RelapseLedger from '../components/RelapseLedger';

export default function Analytics() {
  const [currentSubstance, setCurrentSubstance] = useState<SubstanceType>('weed');

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        
        {/* Toggle Selector controls the sub-context global layouts state */}
        <SubstanceToggle 
          activeSubstance={currentSubstance} 
          onSubstanceChange={setCurrentSubstance} 
        />

        {/* Section 1: Consistency Grid */}
        <Text style={styles.sectionHeader}>CONSISTENCY MATRIX</Text>
        <StreakCalendar substance={currentSubstance} />
        
        {/* Section 2: Habits Behavioral Analysis Breakdown List */}
        <Text style={styles.sectionHeader}>BEHAVIORAL DISTRIBUTION</Text>
        <TriggerBreakdown substance={currentSubstance} />

        {/* 3. Non-Shaming Historical Timeline Tracker */}
        <RelapseLedger substance={currentSubstance} />
        
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