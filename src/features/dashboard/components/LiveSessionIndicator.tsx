/**
 * RotBrain LiveSessionIndicator
 * Shows active session status, live timer, and simulation controls.
 */

import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useRotBrainStore } from '../../../store/useRotBrainStore';
import { DateTimeFormatter } from '../../../utils/dateTimeFormatter';
import { colors } from '../../../theme/colors';
import { typography } from '../../../theme/typography';
import { spacing, radii } from '../../../theme/spacing';

export const LiveSessionIndicator: React.FC = () => {
  const {
    activeSession,
    startSession,
    endActiveSession,
    recordVideoEvent,
    preferences,
  } = useRotBrainStore();

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

  if (!activeSession) {
    return (
      <View style={styles.idleContainer}>
        <View style={styles.idleRow}>
          <View style={styles.idleDot} />
          <Text style={styles.idleText}>Background Activity Monitor: Standby</Text>
        </View>

        <View style={styles.startRow}>
          {preferences.instagramTrackingEnabled && (
            <TouchableOpacity
              style={[styles.startButton, { borderColor: colors.platforms.instagram }]}
              onPress={() => startSession('instagram')}
            >
              <Text style={styles.startButtonText}>+ Sim Instagram Session</Text>
            </TouchableOpacity>
          )}

          {preferences.youtubeTrackingEnabled && (
            <TouchableOpacity
              style={[styles.startButton, { borderColor: colors.platforms.youtube }]}
              onPress={() => startSession('youtube')}
            >
              <Text style={styles.startButtonText}>+ Sim YouTube Session</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    );
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
            TRACKING ACTIVE — {isInstagram ? 'INSTAGRAM REELS' : 'YOUTUBE SHORTS'}
          </Text>
        </View>

        <Text style={styles.timerText}>
          {DateTimeFormatter.formatDuration(elapsedSeconds)}
        </Text>
      </View>

      <View style={styles.statsRow}>
        <Text style={styles.statsText}>
          Session Count:{' '}
          <Text style={{ fontWeight: '800', color: '#F8FAFC' }}>
            {activeSession.confirmedVideoCount}
          </Text>{' '}
          videos
        </Text>
      </View>

      <View style={styles.actionRow}>
        <TouchableOpacity
          style={styles.simulateVideoBtn}
          onPress={() => recordVideoEvent(activeSession.platform, true)}
        >
          <Text style={styles.simulateVideoText}>⚡ Record Confirmed Reel</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.endBtn} onPress={endActiveSession}>
          <Text style={styles.endBtnText}>End Session</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  idleContainer: {
    backgroundColor: '#13151F',
    borderRadius: radii.lg,
    padding: spacing.md,
    marginVertical: spacing.sm,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
  },
  idleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.xs,
  },
  idleDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#64748B',
    marginRight: spacing.sm,
  },
  idleText: {
    ...typography.caption,
    color: '#94A3B8',
  },
  startRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: spacing.xs,
  },
  startButton: {
    flex: 1,
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.sm,
    borderRadius: radii.sm,
    borderWidth: 1,
    alignItems: 'center',
    marginHorizontal: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.04)',
  },
  startButtonText: {
    ...typography.caption,
    color: '#CBD5E1',
    fontWeight: '600',
  },
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
  },
  statsRow: {
    marginBottom: spacing.sm,
  },
  statsText: {
    ...typography.bodySmall,
    color: '#94A3B8',
  },
  actionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  simulateVideoBtn: {
    flex: 2,
    backgroundColor: 'rgba(139, 92, 246, 0.2)',
    borderWidth: 1,
    borderColor: colors.primary,
    borderRadius: radii.sm,
    paddingVertical: spacing.xs,
    alignItems: 'center',
    marginRight: spacing.xs,
  },
  simulateVideoText: {
    ...typography.caption,
    color: colors.primaryLight,
    fontWeight: '700',
  },
  endBtn: {
    flex: 1,
    backgroundColor: 'rgba(239, 68, 68, 0.15)',
    borderWidth: 1,
    borderColor: colors.danger,
    borderRadius: radii.sm,
    paddingVertical: spacing.xs,
    alignItems: 'center',
  },
  endBtnText: {
    ...typography.caption,
    color: colors.danger,
    fontWeight: '700',
  },
});
