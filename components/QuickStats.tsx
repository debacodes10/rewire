import React from 'react';
import { StyleSheet, Text, View, Dimensions, DimensionValue } from 'react-native';

interface QuickStatsProps {
  substance: 'weed' | 'nicotine';
}

export default function QuickStats({ substance }: QuickStatsProps) {
  const isWeed = substance === 'weed';
  
  // comprehensive metrics and historical recovery milestones
  const statsData = {
    weed: {
      moneySaved: '₹1,620',
      dailyBurnRate: '₹450 / day spent previously',
      monthlyProjected: '₹13,500 monthly run-rate saved',
      healthLabel: 'REM Sleep Rebound',
      healthProgress: '68%',
      accentColor: '#34C759',
      insights: [
        { title: 'Brain Fog Resolution', status: 'In Progress', detail: 'THC metabolites are clearing out from lipid tissues. Focus spikes by 40%.' },
        { title: 'Neurotransmitter Baseline', status: 'Stabilizing', detail: 'CB1 receptors in your brain are starting to upregulate naturally.' },
        { title: 'Lung Tar Clearing', status: 'Started', detail: 'Cilia cells in your airway are beginning to break down residual resin particles.' }
      ]
    },
    nicotine: {
      moneySaved: '₹720',
      dailyBurnRate: '₹200 / day spent previously',
      monthlyProjected: '₹6,000 monthly run-rate saved',
      healthLabel: 'Cardiovascular Oxygenation',
      healthProgress: '92%',
      accentColor: '#FF9F0A',
      insights: [
        { title: 'Carbon Monoxide Levels', status: 'Normal', detail: 'Blood gas balance is restored. Oxygen absorption capacity is fully optimized.' },
        { title: 'Cotine Clearance', status: '100% Clean', detail: 'Nicotine derivatives have been completely processed out through the kidneys.' },
        { title: 'Cardiac Workload Reduction', status: 'Stabilizing', detail: 'Resting pulse rate has decreased by an average of 8-12 beats per minute.' }
      ]
    }
  };

  const currentStats = isWeed ? statsData.weed : statsData.nicotine;

  return (
    <View style={styles.masterContainer}>
      
      {/* Grid Summary Row */}
      <View style={styles.statsContainer}>
        {/* Financial Card */}
        <View style={styles.statCard}>
          <Text style={styles.cardLabel}>CASH SAVED</Text>
          <Text style={[styles.cardValue, { color: currentStats.accentColor }]}>
            {currentStats.moneySaved}
          </Text>
          <Text style={styles.cardSubtext}>{currentStats.dailyBurnRate}</Text>
        </View>

        {/* Health Progress Card */}
        <View style={styles.statCard}>
          <Text style={styles.cardLabel}>{currentStats.healthLabel.toUpperCase()}</Text>
          <Text style={styles.cardValue}>
            {currentStats.healthProgress}
          </Text>
          {/* Dynamic mini progress indicator track */}
          <View style={styles.progressTrack}>
            <View style={[
              styles.progressBar, 
              { 
                // Fixes the Redline Warning by explicitly asserting string type as a percentage
                width: currentStats.healthProgress as DimensionValue, 
                backgroundColor: currentStats.accentColor 
              }
            ]} />
          </View>
        </View>
      </View>

      {/* Extended Breakdown List (Fills out empty dashboard space) */}
      <View style={styles.breakdownCard}>
        <Text style={styles.sectionHeader}>PROJECTED METRICS</Text>
        
        {/* Financial Projection Banner */}
        <View style={styles.projectionRow}>
          <Text style={styles.projectionText}>{currentStats.monthlyProjected}</Text>
        </View>

        <View style={styles.divider} />

        {/* Health Insights Timeline Map */}
        {currentStats.insights.map((item, index) => (
          <View key={index} style={styles.insightItem}>
            <View style={styles.insightHeaderRow}>
              <Text style={styles.insightTitle}>{item.title}</Text>
              <View style={[styles.statusBadge, { backgroundColor: 'rgba(255,255,255,0.05)', borderColor: currentStats.accentColor }]}>
                <Text style={[styles.statusText, { color: currentStats.accentColor }]}>{item.status}</Text>
              </View>
            </View>
            <Text style={styles.insightDetail}>{item.detail}</Text>
          </View>
        ))}
      </View>

    </View>
  );
}

const { width } = Dimensions.get('window');
const CARD_WIDTH = (width - 52) / 2;

const styles = StyleSheet.create({
  masterContainer: {
    alignItems: 'center',
    width: width,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: width - 40,
    marginTop: 4,
  },
  statCard: {
    width: CARD_WIDTH,
    backgroundColor: '#1C1C1E',
    borderRadius: 18,
    padding: 16,
    justifyContent: 'space-between',
    height: 110,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 4,
  },
  cardLabel: {
    fontSize: 10,
    fontWeight: '700',
    color: '#8E8E93',
    letterSpacing: 1,
  },
  cardValue: {
    fontSize: 24,
    fontWeight: '700',
    color: '#FFFFFF',
    marginVertical: 4,
    fontVariant: ['tabular-nums'],
  },
  cardSubtext: {
    fontSize: 9,
    fontWeight: '500',
    color: '#636366',
  },
  progressTrack: {
    height: 5,
    backgroundColor: '#2C2C2E',
    borderRadius: 3,
    width: '100%',
    marginTop: 6,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    borderRadius: 3,
  },
  // Expanded Detailed Layout Elements
  breakdownCard: {
    width: width - 40,
    backgroundColor: '#1C1C1E',
    borderRadius: 22,
    padding: 20,
    marginTop: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 5,
  },
  sectionHeader: {
    fontSize: 11,
    fontWeight: '700',
    color: '#8E8E93',
    letterSpacing: 1.5,
    marginBottom: 14,
  },
  projectionRow: {
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderWidth: 1,
    borderColor: '#2C2C2E',
  },
  projectionText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#E5E5EA',
  },
  divider: {
    height: 1,
    backgroundColor: '#2C2C2E',
    marginVertical: 16,
  },
  insightItem: {
    marginBottom: 16,
  },
  insightHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  insightTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    borderWidth: 0.5,
  },
  statusText: {
    fontSize: 9,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  insightDetail: {
    fontSize: 12,
    color: '#8E8E93',
    lineHeight: 17,
  },
});