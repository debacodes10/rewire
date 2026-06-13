import React from 'react';
import { StyleSheet, Text, View, Dimensions, FlatList } from 'react-native';

// Explicit type definition for our ledger items mapping to our DB schema
interface RelapseItem {
  id: string;
  substance_type: 'weed' | 'nicotine';
  relapsed_at: string;
  streak_lost_seconds: number;
  notes?: string;
}

interface RelapseLedgerProps {
  substance: 'weed' | 'nicotine';
}

// Mock historical data array for layout testing
const MOCK_RELAPSE_DATA: RelapseItem[] = [
  {
    id: '1',
    substance_type: 'weed',
    relapsed_at: '2026-06-10T22:15:00.000Z',
    streak_lost_seconds: 1209600, // 14 days
    notes: 'Had an intense wave of boredom late at night after staying up too late watching movies. Need to fix sleep routine.',
  },
  {
    id: '2',
    substance_type: 'nicotine',
    relapsed_at: '2026-06-05T08:30:00.000Z',
    streak_lost_seconds: 259200, // 3 days
    notes: 'Super stressful morning meeting at work. Automatically reached for my old vape spot before thinking.',
  },
  {
    id: '3',
    substance_type: 'weed',
    relapsed_at: '2026-05-20T19:40:00.000Z',
    streak_lost_seconds: 604800, // 7 days
    notes: 'Out with old friends who were smoking. Peer pressure got the best of me.',
  },
];

export default function RelapseLedger({ substance }: RelapseLedgerProps) {
  // Filter items to show only logs corresponding to the active toggle tab
  const filteredData = MOCK_RELAPSE_DATA.filter(item => item.substance_type === substance);

  // Helper to format large seconds into readable block chunks
  const formatLostStreak = (totalSeconds: number) => {
    const days = Math.floor(totalSeconds / (24 * 3600));
    const hours = Math.floor((totalSeconds % (24 * 3600)) / 3600);
    return days > 0 ? `${days}d ${hours}h broken` : `${hours}h broken`;
  };

  const isWeed = substance === 'weed';
  const accentColor = isWeed ? '#34C759' : '#FF9F0A'; // Mint Green vs Warm Amber

  const renderItem = ({ item, index }: { item: RelapseItem; index: number }) => {
    const dateFormatted = new Date(item.relapsed_at).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });

    return (
      <View style={styles.timelineRow}>
        {/* Left Side Node: Creates the native continuous rail effect */}
        <View style={styles.railContainer}>
          <View style={[styles.timelineDot, { borderColor: accentColor }]} />
          {index !== filteredData.length - 1 && <View style={styles.verticalLine} />}
        </View>

        {/* Right Side Content Block */}
        <View style={styles.cardContent}>
          <View style={styles.cardHeader}>
            <Text style={styles.dateText}>{dateFormatted}</Text>
            <View style={[styles.durationBadge, { backgroundColor: `${accentColor}15` }]}>
              <Text style={[styles.durationText, { color: accentColor }]}>
                {formatLostStreak(item.streak_lost_seconds)}
              </Text>
            </View>
          </View>
          
          {item.notes ? (
            <Text style={styles.notesText} numberOfLines={3}>
              "{item.notes}"
            </Text>
          ) : (
            <Text style={styles.noNotesText}>No reflections recorded for this slip.</Text>
          )}
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>Relapse Ledger & Reflections</Text>
      
      {filteredData.length === 0 ? (
        <View style={styles.emptyCard}>
          <Text style={[styles.emptyText, { color: accentColor }]}>Flawless History</Text>
          <Text style={styles.emptySubtext}>No slip-ups logged for this substance yet. Keep guarding the streak!</Text>
        </View>
      ) : (
        <View style={styles.ledgerWrapper}>
          {filteredData.map((item, index) => (
            <View key={item.id}>
              {renderItem({ item, index })}
            </View>
          ))}
        </View>
      )}
    </View>
  );
}

const { width } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    width: width - 40,
    marginTop: 24,
    marginBottom: 100, // Provides extra space so elements don't get choked behind our floating navbar
    alignSelf: 'center',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 16,
    letterSpacing: -0.3,
  },
  ledgerWrapper: {
    backgroundColor: '#1C1C1E', // Matching premium iOS surface container card
    borderRadius: 24,
    paddingVertical: 20,
    paddingHorizontal: 16,
  },
  timelineRow: {
    flexDirection: 'row',
    minHeight: 80,
  },
  railContainer: {
    alignItems: 'center',
    marginRight: 14,
  },
  timelineDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    borderWidth: 2.5,
    backgroundColor: '#1C1C1E',
    marginTop: 4,
    zIndex: 2,
  },
  verticalLine: {
    width: 2,
    flex: 1,
    backgroundColor: '#2C2C2E', // Subtle dark track line
    marginTop: 2,
    marginBottom: -6,
  },
  cardContent: {
    flex: 1,
    paddingBottom: 20,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  dateText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#E5E5EA',
  },
  durationBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  durationText: {
    fontSize: 11,
    fontWeight: '700',
    fontVariant: ['tabular-nums'],
  },
  notesText: {
    fontSize: 13,
    lineHeight: 18,
    color: '#8E8E93',
    fontStyle: 'italic',
  },
  noNotesText: {
    fontSize: 13,
    color: '#48484A',
    fontStyle: 'italic',
  },
  emptyCard: {
    backgroundColor: '#1C1C1E',
    borderRadius: 24,
    padding: 24,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#2C2C2E',
  },
  emptyText: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 6,
    letterSpacing: 0.5,
  },
  emptySubtext: {
    fontSize: 13,
    color: '#8E8E93',
    textAlign: 'center',
    lineHeight: 18,
  },
});