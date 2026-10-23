/**
 * RotBrain LiveSessionIndicator
 * Shows active session status when Instagram Reels or YouTube Shorts are actively detected.
 * Returns null when idle (removes legacy Background Activity Monitor card completely).
 */

import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useRotBrainStore } from '../../../store/useRotBrainStore';
import { DateTimeFormatter } from '../../../utils/dateTimeFormatter';
import { colors } from '../../../theme/colors';
import { typography } from '../../../theme/typography';
import { spacing, radii } from '../../../theme/spacing';

export const LiveSessionIndicator: React.FC = () => {
  const { activeSession, endActiveSession } = useRotBrainStore();
  const [elapsedSeconds, setElapsedSeconds] = useState<number>(0);

  useEffect(() => {
    if (!activeSession) {
      setElapsedSeconds(0);
      return;
    }

    const interval = setInterval(() => {
      const now = Date.now();
      const start = new Date(activeSession.startedAt).getTime();
      setElapsedSeconds(Math.max(0, Math.floor((now - start) / 1000)));
    }, 1000);

    return () => clearInterval(interval);
  }, [activeSession]);

  // Remove background activity monitor completely when idle
  if (!activeSession) {
    return null;
  }

  const isInstagram = activeSession.platform === 'instagram';
  const platformColor = isInstagram
    ? colors.platforms.instagram
    : colors.platforms.youtube;

  return (
    <View style={[styles.activeContainer, { borderColor: platformColor }]}>
      <View style={styles.headerRow}>
        <View style={styles.liveTag}>
          <View style={[styles.pulsingDot, { backgroundColor: platformColor }]} />
          <Text style={[styles.liveText, { color: platformColor }]}>
            ACTIVE FEED — {isInstagram ? 'INSTAGRAM REELS' : 'YOUTUBE SHORTS'}
          </Text>
        </View>

        <Text style={styles.timerText}>
          {DateTimeFormatter.formatDuration(elapsedSeconds)}
        </Text>
      </View>

      <View style={styles.statsRow}>
        <Text style={styles.statsText}>
          Videos Detected:{' '}
          <Text style={{ fontWeight: '800', color: '#F8FAFC' }}>
            {activeSession.confirmedVideoCount}
          </Text>
        </Text>

        <TouchableOpacity style={styles.endBtn} onPress={endActiveSession} activeOpacity={0.8}>
          <Text style={styles.endBtnText}>Close Feed Session</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  activeContainer: {
    backgroundColor: '#13151F',
    borderRadius: radii.lg,
    padding: spacing.md,
    marginVertical: spacing.sm,
    borderWidth: 1.5,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.xs,
  },
  liveTag: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  pulsingDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: spacing.xs,
  },
  liveText: {
    ...typography.caption,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  timerText: {
    ...typography.caption,
    color: '#F8FAFC',
    fontWeight: '700',
    fontFamily: 'monospace',
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: spacing.xs,
  },
  statsText: {
    ...typography.bodySmall,
    color: '#94A3B8',
  },
  endBtn: {
    backgroundColor: 'rgba(239, 68, 68, 0.15)',
    borderWidth: 1,
    borderColor: colors.danger,
    borderRadius: radii.sm,
    paddingVertical: 4,
    paddingHorizontal: spacing.md,
    alignItems: 'center',
  },
  endBtnText: {
    ...typography.caption,
    color: colors.danger,
    fontWeight: '700',
  },
});
