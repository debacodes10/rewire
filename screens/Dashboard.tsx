import React, { useState } from 'react';
import { StyleSheet, View, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import HeroCounter from '../components/HeroCounter';
import SubstanceToggle, { SubstanceType } from '../components/SubstanceToggle';
import QuickStats from '../components/QuickStats';
import PanicButton from '../components/PanicButton'; // Import our new block

export default function Dashboard() {
  const [currentSubstance, setCurrentSubstance] = useState<SubstanceType>('weed');

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Added ScrollView so the expanded dashboard forms remain fluid on smaller iPhones */}
      <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        
        <SubstanceToggle 
          activeSubstance={currentSubstance} 
          onSubstanceChange={setCurrentSubstance} 
        />
        
        <HeroCounter substance={currentSubstance} />
        
        <QuickStats substance={currentSubstance} />

        <PanicButton substance={currentSubstance} />
        
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