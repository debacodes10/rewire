import React from 'react';
import { StyleSheet, Text, View, Dimensions, DimensionValue } from 'react-native';
import { AppData, getCravingsForSubstance, getTriggerBreakdown } from '../state/AppState';

interface TriggerBreakdownProps {
  substance: 'weed' | 'nicotine';
  data: AppData;
}

interface TriggerItem {
  name: string;
  count: number;
  percentage: number;
}

export default function TriggerBreakdown({ substance, data }: TriggerBreakdownProps) {
  const isWeed = substance === 'weed';
  const accentColor = isWeed ? '#34C759' : '#FF9F0A';
  const triggers = getTriggerBreakdown(data, substance) as TriggerItem[];
  const totalCravings = getCravingsForSubstance(data, substance).length;
  const primaryState = triggers[0]?.name || 'No pattern yet';
  const dangerZoneTime = getCravingsForSubstance(data, substance)[0]
    ? new Date(getCravingsForSubstance(data, substance)[0].logged_at).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })
    : 'Log a craving to detect timing';

  return (
    <View style={styles.chartCard}>
      {/* Component Summary Header */}
      <View style={styles.headerRow}>
        <Text style={styles.cardTitle}>Craving Triggers</Text>
        <Text style={styles.totalText}>{totalCravings} logged instances</Text>
      </View>

      <View style={styles.chartContainer}>
        {triggers.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyStateTitle}>No cravings logged yet</Text>
            <Text style={styles.emptyStateText}>Use SOS Craving on the dashboard and this chart will build itself.</Text>
          </View>
        ) : triggers.map((item, index) => (
          <View key={index} style={styles.rowItem}>

            <View style={styles.labelRow}>
              <Text style={styles.triggerName}>{item.name}</Text>
              <Text style={styles.triggerValue}>
                {item.count} <Text style={styles.percentageText}>({item.percentage}%)</Text>
              </Text>
            </View>

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

      <View style={styles.insightBanner}>
        <Text style={styles.insightHeader}>🧠 BEHAVIORAL PREDICTION</Text>
        <Text style={styles.insightDescription}>
          Your highest relapse risk environment is driven by{' '}
          <Text style={[styles.highlightText, { color: accentColor }]}>{primaryState}</Text>{' '}
          around <Text style={styles.highlightText}>{dangerZoneTime}</Text>. Keep logging urges to sharpen this prediction.
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
  emptyState: {
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#2C2C2E',
    backgroundColor: 'rgba(255,255,255,0.02)',
    padding: 16,
  },
  emptyStateTitle: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
  },
  emptyStateText: {
    color: '#8E8E93',
    fontSize: 12,
    lineHeight: 17,
    marginTop: 5,
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
