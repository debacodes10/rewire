import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, Dimensions } from 'react-native';

// Static quit date set to exactly 3d 14h 22m 05s ago for layout testing
const MOCK_QUIT_DATE = new Date(Date.now() - (3 * 24 * 60 * 60 * 1000 + 14 * 60 * 60 * 1000 + 22 * 60 * 1000 + 5 * 1000)).toISOString();

interface TimeSegments {
  days: string;
  hours: string;
  minutes: string;
  seconds: string;
}

interface HeroCounterProps {
  substance: 'weed' | 'nicotine';
}

export default function HeroCounter({ substance }: HeroCounterProps) {
  const [timeLeft, setTimeLeft] = useState<TimeSegments>({
    days: '00',
    hours: '00',
    minutes: '00',
    seconds: '00',
  });

  useEffect(() => {
    const calculateTime = () => {
      const difference = new Date().getTime() - new Date(MOCK_QUIT_DATE).getTime();
      
      if (difference <= 0) {
        return { days: '00', hours: '00', minutes: '00', seconds: '00' };
      }

      const d = Math.floor(difference / (1000 * 60 * 60 * 24));
      const h = Math.floor((difference / (1000 * 60 * 60)) % 24);
      const m = Math.floor((difference / 1000 / 60) % 60);
      const s = Math.floor((difference / 1000) % 60);

      const pad = (num: number) => String(num).padStart(2, '0');

      return {
        days: pad(d),
        hours: pad(h),
        minutes: pad(m),
        seconds: pad(s),
      };
    };

    // Initial calculation
    setTimeLeft(calculateTime());

    // Live tick
    const interval = setInterval(() => {
      setTimeLeft(calculateTime());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  // Determine theme flags based on current selection
  const isWeed = substance === 'weed';
  const accentColor = isWeed ? '#34C759' : '#FF9F0A';

  return (
    <View style={styles.container}>
      {/* Dynamic border tint wrapper based on substance selection */}
      <View style={[
        styles.counterCard, 
        isWeed ? styles.weedGlowBorder : styles.nicotineGlowBorder
      ]}>
        
        {/* Dynamic header text layout and text color token assignment */}
        <Text style={[styles.substanceBadge, { color: accentColor }]}>
          {isWeed ? 'FREEDOM FROM WEED' : 'FREEDOM FROM NICOTINE'}
        </Text>
        
        <View style={styles.timerRow}>
          {/* Days */}
          <View style={styles.timeBox}>
            <Text style={styles.timeNumber}>{timeLeft.days}</Text>
            <Text style={styles.timeLabel}>DAYS</Text>
          </View>
          
          <Text style={styles.colon}>:</Text>

          {/* Hours */}
          <View style={styles.timeBox}>
            <Text style={styles.timeNumber}>{timeLeft.hours}</Text>
            <Text style={styles.timeLabel}>HRS</Text>
          </View>

          <Text style={styles.colon}>:</Text>

          {/* Minutes */}
          <View style={styles.timeBox}>
            <Text style={styles.timeNumber}>{timeLeft.minutes}</Text>
            <Text style={styles.timeLabel}>MINS</Text>
          </View>

          <Text style={styles.colon}>:</Text>

          {/* Seconds */}
          <View style={styles.timeBox}>
            <Text style={styles.timeNumber}>{timeLeft.seconds}</Text>
            <Text style={styles.timeLabel}>SECS</Text>
          </View>
        </View>
      </View>
    </View>
  );
}

const { width } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: '#0F0F10', 
    alignItems: 'center',
  },
  counterCard: {
    width: width - 40,
    backgroundColor: '#1C1C1E', 
    borderRadius: 24,
    paddingVertical: 24,
    paddingHorizontal: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 8,
  },
  weedGlowBorder: {
    borderWidth: 1,
    borderColor: 'rgba(52, 199, 89, 0.25)', 
  },
  nicotineGlowBorder: {
    borderWidth: 1,
    borderColor: 'rgba(255, 159, 10, 0.25)', 
  },
  substanceBadge: {
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 2,
    marginBottom: 16,
  },
  timerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  timeBox: {
    alignItems: 'center',
    minWidth: 60,
  },
  timeNumber: {
    fontSize: 34,
    fontWeight: '700',
    color: '#FFFFFF',
    fontVariant: ['tabular-nums'], 
    letterSpacing: -0.5,
  },
  timeLabel: {
    fontSize: 10,
    fontWeight: '600',
    color: '#8E8E93', 
    marginTop: 4,
    letterSpacing: 0.5,
  },
  colon: {
    fontSize: 28,
    fontWeight: '600',
    color: '#3A3A3C',
    bottom: 8, 
    marginHorizontal: 4,
  },
});