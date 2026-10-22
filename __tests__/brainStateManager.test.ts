import { BrainStateManager } from '../src/features/brain/brainStateManager';

describe('BrainStateManager Milestone Tests', () => {
  describe('calculateState Milestone Boundaries', () => {
    test('Count 0: should be fresh', () => {
      expect(BrainStateManager.calculateState(0)).toBe('fresh');
    });

    test('Count 15: should be fresh', () => {
      expect(BrainStateManager.calculateState(15)).toBe('fresh');
    });

    test('Count 29: should be the upper limit of fresh', () => {
      expect(BrainStateManager.calculateState(29)).toBe('fresh');
    });

    test('Count 30: should transition immediately to tired', () => {
      expect(BrainStateManager.calculateState(30)).toBe('tired');
    });

    test('Count 45: should be tired', () => {
      expect(BrainStateManager.calculateState(45)).toBe('tired');
    });

    test('Count 59: should be the upper limit of tired', () => {
      expect(BrainStateManager.calculateState(59)).toBe('tired');
    });

    test('Count 60: should transition immediately to very_tired', () => {
      expect(BrainStateManager.calculateState(60)).toBe('very_tired');
    });

    test('Count 75: should be very_tired', () => {
      expect(BrainStateManager.calculateState(75)).toBe('very_tired');
    });

    test('Count 89: should be the upper limit of very_tired', () => {
      expect(BrainStateManager.calculateState(89)).toBe('very_tired');
    });

    test('Count 90: should transition immediately to exhausted', () => {
      expect(BrainStateManager.calculateState(90)).toBe('exhausted');
    });

    test('Count 91: should remain exhausted', () => {
      expect(BrainStateManager.calculateState(91)).toBe('exhausted');
    });

    test('Count 250: should remain exhausted', () => {
      expect(BrainStateManager.calculateState(250)).toBe('exhausted');
    });

    test('Negative count: should safely clamp to 0 and be fresh', () => {
      expect(BrainStateManager.calculateState(-5)).toBe('fresh');
    });
  });

  describe('Milestone Progress Calculations', () => {
    test('Progress at 0 should be 0% toward 30', () => {
      const progress = BrainStateManager.calculateProgress(0);
      expect(progress.currentState).toBe('fresh');
      expect(progress.nextMilestone).toBe(30);
      expect(progress.countUntilNextMilestone).toBe(30);
      expect(progress.percentageToNextMilestone).toBe(0);
    });

    test('Progress at 15 should be 50% toward 30', () => {
      const progress = BrainStateManager.calculateProgress(15);
      expect(progress.currentState).toBe('fresh');
      expect(progress.nextMilestone).toBe(30);
      expect(progress.countUntilNextMilestone).toBe(15);
      expect(progress.percentageToNextMilestone).toBe(50);
    });

    test('Progress at 30 should be 0% toward 60', () => {
      const progress = BrainStateManager.calculateProgress(30);
      expect(progress.currentState).toBe('tired');
      expect(progress.nextMilestone).toBe(60);
      expect(progress.countUntilNextMilestone).toBe(30);
      expect(progress.percentageToNextMilestone).toBe(0);
    });

    test('Progress at 90+ should have null nextMilestone and 100%', () => {
      const progress = BrainStateManager.calculateProgress(120);
      expect(progress.currentState).toBe('exhausted');
      expect(progress.nextMilestone).toBeNull();
      expect(progress.countUntilNextMilestone).toBe(0);
      expect(progress.percentageToNextMilestone).toBe(100);
    });
  });

  describe('calculateTotalConfirmed based on enabled platforms', () => {
    test('Both platforms enabled sums both', () => {
      expect(BrainStateManager.calculateTotalConfirmed(20, 15, true, true)).toBe(35);
    });

    test('Only Instagram enabled excludes YouTube', () => {
      expect(BrainStateManager.calculateTotalConfirmed(20, 15, true, false)).toBe(20);
    });

    test('Only YouTube enabled excludes Instagram', () => {
      expect(BrainStateManager.calculateTotalConfirmed(20, 15, false, true)).toBe(15);
    });

    test('Neither platform enabled returns 0', () => {
      expect(BrainStateManager.calculateTotalConfirmed(20, 15, false, false)).toBe(0);
    });
  });
});
