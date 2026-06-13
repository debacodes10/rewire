import React from 'react';
import { StyleSheet, Text, View, Dimensions, DimensionValue } from 'react-native';
import { AppData, CURRENCY_SYMBOLS, getDailyBudget, getMoneySaved, getStreakSeconds } from '../state/AppState';

interface QuickStatsProps {
  substance: 'weed' | 'nicotine';
  data: AppData;
}

export default function QuickStats({ substance, data }: QuickStatsProps) {
  const isWeed = substance === 'weed';

  const dailyBudget = getDailyBudget(data, substance);
  const streakDays = Math.floor(getStreakSeconds(data, substance) / 86400);
  const moneySaved = getMoneySaved(data, substance);
  const symbol = CURRENCY_SYMBOLS[data.settings.currency];
  const accentColor = isWeed ? '#34C759' : '#FF9F0A';
  const healthProgressNumber = Math.min(100, Math.max(5, Math.round((streakDays / (isWeed ? 21 : 14)) * 100)));

  const currentStats = {
    moneySaved: `${symbol}${moneySaved.toLocaleString()}`,
    dailyBurnRate: `${symbol}${dailyBudget.toLocaleString()} / day spent previously`,
    monthlyProjected: `${symbol}${Math.round(dailyBudget * 30).toLocaleString()} monthly run-rate avoided`,
    healthLabel: isWeed ? 'Stability Momentum' : 'Craving Resistance',
    healthProgress: `${healthProgressNumber}%`,
    accentColor,
    insights: isWeed ? [
      { title: 'Routine Distance', status: `${streakDays}d`, detail: 'Your current streak is creating separation from old smoking routines and high-risk evening patterns.' },
      { title: 'Trigger Evidence', status: `${data.craving_logs.filter(log => log.substance_type === substance).length} Logs`, detail: 'Each logged craving improves your view of the situations that need a better replacement behavior.' },
      { title: 'Savings Pace', status: 'Live', detail: `At your current baseline, every clean week protects roughly ${symbol}${Math.round(dailyBudget * 7).toLocaleString()}.` },
    ] : [
      { title: 'Routine Distance', status: `${streakDays}d`, detail: 'Your current streak is weakening automatic nicotine loops around work, commute, and post-meal windows.' },
      { title: 'Trigger Evidence', status: `${data.craving_logs.filter(log => log.substance_type === substance).length} Logs`, detail: 'Logged urges become a practical map of which cues still need replacement rituals.' },
      { title: 'Savings Pace', status: 'Live', detail: `At your current baseline, every clean week protects roughly ${symbol}${Math.round(dailyBudget * 7).toLocaleString()}.` },
    ],
  };

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
