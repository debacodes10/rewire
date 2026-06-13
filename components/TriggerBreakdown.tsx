import React from 'react';
import { StyleSheet, Text, View, Dimensions, DimensionValue } from 'react-native';

interface TriggerBreakdownProps {
  substance: 'weed' | 'nicotine';
}

interface TriggerItem {
  name: string;
  count: number;
  percentage: number;
}

export default function TriggerBreakdown({ substance }: TriggerBreakdownProps) {
  const isWeed = substance === 'weed';
  const accentColor = isWeed ? '#34C759' : '#FF9F0A';

  // Comprehensive analytics mockup data based on historical MVP trends
  const analyticsData = {
    weed: {
      totalCravings: 24,
      dangerZoneTime: 'Late Night (10 PM – 1 AM)',
      primaryState: 'Boredom',
      triggers: [
        { name: 'Boredom / Idle Time', count: 12, percentage: 50 },
        { name: 'Insomnia / Sleep Routine', count: 6, percentage: 25 },
        { name: 'Stress / Overwhelm', count: 4, percentage: 17 },
        { name: 'Social Group Setting', count: 2, percentage: 8 },
      ] as TriggerItem[],
    },
    nicotine: {
      totalCravings: 42,
      dangerZoneTime: 'Early Morning (8 AM – 10 AM)',
      primaryState: 'Work Stress',
      triggers: [
        { name: 'Work Stress / Tight Deadlines', count: 18, percentage: 43 },
        { name: 'Post-Meal Routine Habit', count: 14, percentage: 33 },
        { name: 'Social Commute / Driving', count: 7, percentage: 17 },
        { name: 'Boredom', count: 3, percentage: 7 },
      ] as TriggerItem[],
    },
  };

  const currentData = isWeed ? analyticsData.weed : analyticsData.nicotine;

  return (
    <View style={styles.chartCard}>
      {/* Component Summary Header */}
      <View style={styles.headerRow}>
        <Text style={styles.cardTitle}>Craving Triggers</Text>
        <Text style={styles.totalText}>{currentData.totalCravings} logged instances</Text>
      </View>

      {/* Ranked Horizontal Distribution Bars */}
      <View style={styles.chartContainer}>
        {currentData.triggers.map((item, index) => (
          <View key={index} style={styles.rowItem}>
            
            {/* Label Line Description */}
            <View style={styles.labelRow}>
              <Text style={styles.triggerName}>{item.name}</Text>
              <Text style={styles.triggerValue}>
                {item.count} <Text style={styles.percentageText}>({item.percentage}%)</Text>
              </Text>
            </View>

            {/* Custom Track Background */}
            <View style={styles.trackBackground}>
              <View 
                style={[
                  styles.trackFill, 
                  { 
                    width: `${item.percentage}%` as DimensionValue, // explicit cast fixes TS compiler warning 
                    backgroundColor: accentColor 
                  }
                ]} 
              />
            </View>

          </View>
        ))}
      </View>

      {/* Advanced Predictive Behavior Summary Banner */}
      <View style={styles.insightBanner}>
        <Text style={styles.insightHeader}>🧠 BEHAVIORAL PREDICTION</Text>
        <Text style={styles.insightDescription}>
          Your highest relapse risk environment is driven by{' '}
          <Text style={[styles.highlightText, { color: accentColor }]}>{currentData.primaryState}</Text>{' '}
          during <Text style={styles.highlightText}>{currentData.dangerZoneTime}</Text>. Plan proactive distractions before this window hits.
        </Text>
      </View>

    </View>
  );
}

const { width } = Dimensions.get('window');

const styles = StyleSheet.create({
  chartCard: {
    width: width - 40,
    backgroundColor: '#1C1C1E',
    borderRadius: 22,
    padding: 18,
    marginTop: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 5,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'baseline',
    marginBottom: 20,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  totalText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#8E8E93',
  },
  chartContainer: {
    gap: 16,
  },
  rowItem: {
    width: '100%',
  },
  labelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  triggerName: {
    fontSize: 13,
    fontWeight: '600',
    color: '#E5E5EA',
  },
  triggerValue: {
    fontSize: 13,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  percentageText: {
    fontSize: 11,
    fontWeight: '500',
    color: '#636366',
  },
  trackBackground: {
    height: 8,
    backgroundColor: '#2C2C2E',
    borderRadius: 4,
    width: '100%',
    overflow: 'hidden',
  },
  trackFill: {
    height: '100%',
    borderRadius: 4,
  },
  // Insight Card Elements
  insightBanner: {
    backgroundColor: 'rgba(255, 255, 255, 0.02)',
    borderRadius: 14,
    padding: 14,
    marginTop: 22,
    borderWidth: 1,
    borderColor: '#2C2C2E',
  },
  insightHeader: {
    fontSize: 10,
    fontWeight: '700',
    color: '#8E8E93',
    letterSpacing: 1,
    marginBottom: 6,
  },
  insightDescription: {
    fontSize: 12,
    color: '#AEAEB2',
    lineHeight: 18,
  },
  highlightText: {
    fontWeight: '700',
    color: '#FFFFFF',
  },
});