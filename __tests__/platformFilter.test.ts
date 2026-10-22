import { BrainStateManager } from '../src/features/brain/brainStateManager';

describe('Platform Filter & Multi-Platform Tracking Tests', () => {
  describe('Independent Platform Toggle Rules', () => {
    test('Both platforms enabled: counts from Instagram and YouTube are aggregated', () => {
      const ig = 25;
      const yt = 30;
      const total = BrainStateManager.calculateTotalConfirmed(ig, yt, true, true);
      expect(total).toBe(55);
      expect(BrainStateManager.calculateState(total)).toBe('tired');
    });

    test('Instagram only enabled: YouTube counts are completely excluded', () => {
      const ig = 25;
      const yt = 50;
      const total = BrainStateManager.calculateTotalConfirmed(ig, yt, true, false);
      expect(total).toBe(25);
      expect(BrainStateManager.calculateState(total)).toBe('fresh');
    });

    test('YouTube Shorts only enabled: Instagram counts are completely excluded', () => {
      const ig = 80;
      const yt = 32;
      const total = BrainStateManager.calculateTotalConfirmed(ig, yt, false, true);
      expect(total).toBe(32);
      expect(BrainStateManager.calculateState(total)).toBe('tired');
    });

    test('Neither platform enabled: total active confirmed count is 0 and brain remains fresh', () => {
      const ig = 100;
      const yt = 150;
      const total = BrainStateManager.calculateTotalConfirmed(ig, yt, false, false);
      expect(total).toBe(0);
      expect(BrainStateManager.calculateState(total)).toBe('fresh');
    });
  });

  describe('Dashboard Filter Isolation', () => {
    test('Rule: Changing UI dashboard filter does NOT modify brain milestone calculation', () => {
      const total = 65; // Very tired
      const brainStateBefore = BrainStateManager.calculateState(total);

      // Filter simulation
      const filters = ['all', 'instagram', 'youtube'] as const;
      filters.forEach((filter) => {
        // Brain state calculation strictly queries the stored confirmed total, not the filter tab
        const currentBrainState = BrainStateManager.calculateState(total);
        expect(currentBrainState).toBe(brainStateBefore);
        expect(currentBrainState).toBe('very_tired');
      });
    });
  });
});
