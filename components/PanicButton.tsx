import React, { useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View, Modal, Dimensions, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

interface PanicButtonProps {
  substance: 'weed' | 'nicotine';
}

export default function PanicButton({ substance }: PanicButtonProps) {
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedIntensity, setSelectedIntensity] = useState<number | null>(null);
  const [selectedTrigger, setSelectedTrigger] = useState<string | null>(null);

  const isWeed = substance === 'weed';
  const accentColor = isWeed ? '#34C759' : '#FF9F0A';

  const triggers = ['Boredom', 'Stress/Anxiety', 'Social Setting', 'Routine Habit', 'Anger/Frustration'];

  const handleSaveLog = () => {
    // V2: This will dispatch real data to your Zustand state instance
    setModalVisible(false);
    setSelectedIntensity(null);
    setSelectedTrigger(null);
  };

  return (
    <View style={styles.buttonWrapper}>
      {/* The Floating Panic Trigger */}
      <TouchableOpacity
        activeOpacity={0.9}
        style={styles.panicButtonCircle}
        onPress={() => setModalVisible(true)}
      >
        <Text style={styles.panicButtonText}>SOS CRAVING</Text>
      </TouchableOpacity>

      {/* Full-Screen Native Sheet Overlay */}
      <Modal
        animationType="slide"
        transparent={false}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <SafeAreaView style={styles.modalContainer}>
          <ScrollView contentContainerStyle={styles.scrollContent}>
            
            {/* Modal Header */}
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Override the Urge</Text>
              <TouchableOpacity onPress={() => setModalVisible(false)} style={styles.closeButton}>
                <Text style={styles.closeButtonText}>Cancel</Text>
              </TouchableOpacity>
            </View>

            {/* Step 1: Urge Intensity Selector */}
            <View style={styles.sectionCard}>
              <Text style={styles.sectionTitle}>1. HOW INTENSE IS THE CRAVING?</Text>
              <View style={styles.intensityRow}>
                {[1, 2, 3, 4, 5].map((num) => (
                  <TouchableOpacity
                    key={num}
                    style={[
                      styles.intensityBox,
                      selectedIntensity === num && { backgroundColor: accentColor, borderColor: accentColor }
                    ]}
                    onPress={() => setSelectedIntensity(num)}
                  >
                    <Text style={[styles.intensityText, selectedIntensity === num && styles.activeText]}>
                      {num}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
              <View style={styles.scaleLabels}>
                <Text style={styles.scaleLabelText}>Mild</Text>
                <Text style={styles.scaleLabelText}>Severe</Text>
              </View>
            </View>

            {/* Step 2: Trigger Selector */}
            <View style={styles.sectionCard}>
              <Text style={styles.sectionTitle}>2. WHAT IS TRIGGERING YOU?</Text>
              <View style={styles.triggerChipsContainer}>
                {triggers.map((trigger) => (
                  <TouchableOpacity
                    key={trigger}
                    style={[
                      styles.triggerChip,
                      selectedTrigger === trigger && { borderColor: accentColor, backgroundColor: 'rgba(255,255,255,0.03)' }
                    ]}
                    onPress={() => setSelectedTrigger(trigger)}
                  >
                    <Text style={[styles.triggerChipText, selectedTrigger === trigger && { color: accentColor, fontWeight: '700' }]}>
                      {trigger}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Step 3: Crisis Action Box Breathing Guide */}
            <View style={[styles.sectionCard, styles.breathingCard]}>
              <Text style={[styles.sectionTitle, { color: accentColor }]}>⚡ EMERGENCY ANCHOR RUNNING</Text>
              <Text style={styles.breathingInstruction}>
                Before making a decision, take 4 deep box breaths:
              </Text>
              <View style={styles.breathStepRow}>
                <Text style={styles.breathStep}>Inhale (4s)</Text>
                <Text style={styles.breathArrow}>→</Text>
                <Text style={styles.breathStep}>Hold (4s)</Text>
                <Text style={styles.breathArrow}>→</Text>
                <Text style={styles.breathStep}>Exhale (4s)</Text>
              </View>
            </View>

            {/* Complete action block submission button */}
            <TouchableOpacity
              activeOpacity={0.8}
              disabled={!selectedIntensity || !selectedTrigger}
              style={[
                styles.submitButton, 
                { backgroundColor: (selectedIntensity && selectedTrigger) ? '#FFFFFF' : '#2C2C2E' }
              ]}
              onPress={handleSaveLog}
            >
              <Text style={[
                styles.submitButtonText, 
                { color: (selectedIntensity && selectedTrigger) ? '#000000' : '#8E8E93' }
              ]}>
                I Beat The Craving
              </Text>
            </TouchableOpacity>

          </ScrollView>
        </SafeAreaView>
      </Modal>
    </View>
  );
}

const { width } = Dimensions.get('window');

const styles = StyleSheet.create({
  buttonWrapper: {
    width: width - 40,
    marginTop: 24,
    marginBottom: 20,
    alignItems: 'center',
  },
  panicButtonCircle: {
    width: width - 40,
    backgroundColor: '#FF3B30', // Apple System Red
    borderRadius: 16,
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#FF3B30',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 6,
  },
  panicButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  // Modal Sheet Configurations
  modalContainer: {
    flex: 1,
    backgroundColor: '#0F0F10',
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 20,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#FFFFFF',
    letterSpacing: -0.5,
  },
  closeButton: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    backgroundColor: '#1C1C1E',
    borderRadius: 10,
  },
  closeButtonText: {
    color: '#AEAEB2',
    fontSize: 14,
    fontWeight: '600',
  },
  sectionCard: {
    backgroundColor: '#1C1C1E',
    borderRadius: 18,
    padding: 18,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 11,
    fontWeight: '700',
    color: '#8E8E93',
    letterSpacing: 1,
    marginBottom: 14,
  },
  intensityRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  intensityBox: {
    width: (width - 100) / 5,
    height: 48,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#3A3A3C',
    alignItems: 'center',
    justifyContent: 'center',
  },
  intensityText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  activeText: {
    color: '#000000',
    fontWeight: '700',
  },
  scaleLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
    paddingHorizontal: 2,
  },
  scaleLabelText: {
    fontSize: 11,
    color: '#636366',
    fontWeight: '500',
  },
  triggerChipsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  triggerChip: {
    borderWidth: 1,
    borderColor: '#3A3A3C',
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 12,
  },
  triggerChipText: {
    color: '#E5E5EA',
    fontSize: 13,
    fontWeight: '500',
  },
  breathingCard: {
    borderWidth: 1,
    borderColor: '#2C2C2E',
    backgroundColor: 'rgba(255,255,255,0.01)',
  },
  breathingInstruction: {
    fontSize: 13,
    color: '#E5E5EA',
    lineHeight: 18,
    marginBottom: 12,
  },
  breathStepRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#1C1C1E',
    padding: 12,
    borderRadius: 12,
  },
  breathStep: {
    fontSize: 12,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  breathArrow: {
    color: '#48484A',
    fontWeight: '700',
  },
  submitButton: {
    width: width - 40,
    paddingVertical: 16,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
  },
  submitButtonText: {
    fontSize: 16,
    fontWeight: '700',
  },
});