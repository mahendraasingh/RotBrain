/**
 * RotBrain BrainStateManager
 *
 * Single Source of Truth for calculating the Brain Character state from confirmed counts.
 *
 * Rules:
 * - Fresh Brain: 0–29
 * - Tired Brain: 30–59
 * - Very Tired Brain: 60–89
 * - Completely Exhausted Brain: 90+
 *
 * The brain state is strictly derived from the sum of confirmed videos from ACTIVE tracked platforms.
 * Changing the dashboard filter MUST NOT alter the brain state.
 */

import {
  BrainState,
  BrainStateInfo,
  BRAIN_MILESTONES,
  BRAIN_STATE_CONFIGS,
} from '../../types/brain';

export interface MilestoneProgress {
  currentState: BrainState;
  currentCount: number;
  nextMilestone: number | null; // null if already at max state (90+)
  countUntilNextMilestone: number;
  percentageToNextMilestone: number; // 0 to 100
  stateInfo: BrainStateInfo;
}

export class BrainStateManager {
  /**
   * Derives the BrainState given a total confirmed video count.
   */
  public static calculateState(totalConfirmedCount: number): BrainState {
    const count = Math.max(0, Math.floor(totalConfirmedCount));

    if (count <= BRAIN_MILESTONES.FRESH_MAX) {
      return 'fresh';
    }
    if (count <= BRAIN_MILESTONES.TIRED_MAX) {
      return 'tired';
    }
    if (count <= BRAIN_MILESTONES.VERY_TIRED_MAX) {
      return 'very_tired';
    }
    return 'exhausted';
  }

  /**
   * Retrieves full configuration metadata for a given state.
   */
  public static getStateInfo(state: BrainState): BrainStateInfo {
    return BRAIN_STATE_CONFIGS[state];
  }

  /**
   * Calculates progress toward the next milestone.
   */
  public static calculateProgress(totalConfirmedCount: number): MilestoneProgress {
    const count = Math.max(0, Math.floor(totalConfirmedCount));
    const state = this.calculateState(count);
    const stateInfo = this.getStateInfo(state);

    let nextMilestone: number | null = null;
    let minForCurrentState = 0;
    let maxForCurrentState = BRAIN_MILESTONES.FRESH_MAX + 1; // 30

    switch (state) {
      case 'fresh':
        nextMilestone = BRAIN_MILESTONES.TIRED_MIN; // 30
        minForCurrentState = 0;
        maxForCurrentState = 30;
        break;
      case 'tired':
        nextMilestone = BRAIN_MILESTONES.VERY_TIRED_MIN; // 60
        minForCurrentState = 30;
        maxForCurrentState = 60;
        break;
      case 'very_tired':
        nextMilestone = BRAIN_MILESTONES.EXHAUSTED_MIN; // 90
        minForCurrentState = 60;
        maxForCurrentState = 90;
        break;
      case 'exhausted':
        nextMilestone = null;
        minForCurrentState = 90;
        maxForCurrentState = 90;
        break;
    }

    let countUntilNextMilestone = 0;
    let percentage = 100;

    if (nextMilestone !== null) {
      countUntilNextMilestone = Math.max(0, nextMilestone - count);
      const span = maxForCurrentState - minForCurrentState;
      const progressInSpan = count - minForCurrentState;
      percentage = Math.min(100, Math.max(0, Math.round((progressInSpan / span) * 100)));
    }

    return {
      currentState: state,
      currentCount: count,
      nextMilestone,
      countUntilNextMilestone,
      percentageToNextMilestone: percentage,
      stateInfo,
    };
  }

  /**
   * Calculates total confirmed count based on which platforms are enabled.
   * If a platform tracking toggle is disabled by the user, its counts are excluded
   * from the active brain state calculations.
   */
  public static calculateTotalConfirmed(
    instagramCount: number,
    youtubeCount: number,
    isInstagramEnabled: boolean,
    isYoutubeEnabled: boolean
  ): number {
    let total = 0;
    if (isInstagramEnabled) {
      total += Math.max(0, instagramCount);
    }
    if (isYoutubeEnabled) {
      total += Math.max(0, youtubeCount);
    }
    return total;
  }
}
