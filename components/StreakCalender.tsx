import React from 'react';
import { StyleSheet, Text, View, Dimensions } from 'react-native';
import { AppData, DayStatus, getCalendarStatuses } from '../state/AppState';

interface StreakCalendarProps {
  substance: 'weed' | 'nicotine';
  data: AppData;
}

export default function StreakCalendar({ substance, data }: StreakCalendarProps) {
  const isWeed = substance === 'weed';
  const accentColor = isWeed ? '#34C759' : '#FF9F0A';
  const currentMonth = new Date();
  const monthTitle = currentMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  const statuses = getCalendarStatuses(data, substance, currentMonth);
  const cleanCount = Object.values(statuses).filter(status => status === 'clean' || status === 'craving_fought').length;
  const trackedCount = Object.values(statuses).filter(status => status !== 'none').length;
  const today = new Date();

  const daysInMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0).getDate();
  const startOffset = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1).getDay();

  const weekdays = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
  const gridBlocks = Array(startOffset).fill(null).concat(Array.from({ length: daysInMonth }, (_, i) => i + 1));

  const getDayStyle = (dayNum: number | null) => {
    if (!dayNum) return styles.emptyDay;

    const status: DayStatus = statuses[dayNum] || 'none';
    switch (status) {
      case 'clean':
        return { backgroundColor: isWeed ? 'rgba(52, 199, 89, 0.2)' : 'rgba(255, 159, 10, 0.2)', borderColor: accentColor, borderWidth: 1 };
      case 'relapse':
        return { backgroundColor: 'rgba(255, 59, 48, 0.2)', borderColor: '#FF3B30', borderWidth: 1 };
      case 'craving_fought':
        return { backgroundColor: '#1C1C1E', borderColor: '#AF52DE', borderWidth: 1.5 }; // Purple badge of honor for winning the fight
      default:
        return styles.futureDay;
    }
  };

  const getDayTextStyle = (dayNum: number | null) => {
    if (!dayNum) return {};
    if (dayNum === today.getDate() && currentMonth.getMonth() === today.getMonth()) return { color: '#FFFFFF', fontWeight: '800' as const };
    if (statuses[dayNum] && statuses[dayNum] !== 'none') return { color: '#E5E5EA' };
    return { color: '#48484A' };
  };

  return (
    <View style={styles.calendarCard}>
      <View style={styles.headerRow}>
        <Text style={styles.monthTitle}>{monthTitle}</Text>
        <Text style={[styles.summaryBadge, { color: accentColor, backgroundColor: isWeed ? 'rgba(52,199,89,0.08)' : 'rgba(255,159,10,0.08)' }]}>
          {cleanCount} / {trackedCount || 0} Clean Days
        </Text>
      </View>

      <View style={styles.weekdaysRow}>
        {weekdays.map((day, idx) => (
          <Text key={idx} style={styles.weekdayText}>{day}</Text>
        ))}
      </View>

      <View style={styles.gridContainer}>
        {gridBlocks.map((day, index) => (
          <View key={index} style={[styles.dayCell, getDayStyle(day)]}>
            {day && <Text style={[styles.dayNumberText, getDayTextStyle(day)]}>{day}</Text>}
          </View>
        ))}
      </View>

      <View style={styles.legendContainer}>
        <View style={styles.legendItem}><View style={[styles.legendDot, { backgroundColor: isWeed ? 'rgba(52,199,89,0.2)' : 'rgba(255,159,10,0.2)', borderColor: accentColor, borderWidth: 0.5 }]} /><Text style={styles.legendLabel}>Clean</Text></View>
        <View style={styles.legendItem}><View style={[styles.legendDot, { borderColor: '#AF52DE', borderWidth: 1 }]} /><Text style={styles.legendLabel}>Urge Defeated</Text></View>
        <View style={styles.legendItem}><View style={[styles.legendDot, { backgroundColor: 'rgba(255,59,48,0.2)', borderColor: '#FF3B30', borderWidth: 0.5 }]} /><Text style={styles.legendLabel}>Slip-up</Text></View>
      </View>
    </View>
  );
}

const { width } = Dimensions.get('window');
const CELL_SIZE = (width - 72) / 7; // Evenly grid-distribute across standard iOS boundaries

const styles = StyleSheet.create({
  calendarCard: {
    width: width - 40,
    backgroundColor: '#1C1C1E',
    borderRadius: 22,
    padding: 16,
    marginTop: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 5,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  monthTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  summaryBadge: {
    fontSize: 11,
    fontWeight: '700',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
    overflow: 'hidden',
  },
  weekdaysRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  weekdayText: {
    width: CELL_SIZE,
    textAlign: 'center',
    color: '#636366',
    fontSize: 11,
    fontWeight: '700',
  },
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    rowGap: 6,
    columnGap: 6,
  },
  dayCell: {
    width: CELL_SIZE,
    height: CELL_SIZE,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#2C2C2E', // Default dark cell filling
  },
  emptyDay: {
    backgroundColor: 'transparent',
  },
  futureDay: {
    backgroundColor: '#151516',
  },
  dayNumberText: {
    fontSize: 12,
    fontWeight: '600',
  },
  legendContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
    paddingTop: 12,
    borderTopWidth: 1,
    borderColor: '#2C2C2E',
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  legendDot: {
    width: 10,
    height: 10,
    borderRadius: 3,
  },
  legendLabel: {
    fontSize: 11,
    color: '#8E8E93',
    fontWeight: '500',
  },
});
