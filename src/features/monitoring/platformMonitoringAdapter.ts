/**
 * RotBrain PlatformMonitoringAdapter
 * Unified TypeScript bridge decoupling shared React Native UI from native
 * Kotlin (Android) and Swift (iOS) monitoring services.
 */

import { Platform, NativeModules } from 'react-native';
import { PlatformType, PermissionStatus } from '../../types/platform';
import { DetectionMethod } from '../../types/session';

export interface MonitoringEventCallback {
  onVideoDetected: (platform: PlatformType, isConfirmed: boolean) => void;
  onSessionStarted: (platform: PlatformType, method: DetectionMethod) => void;
  onSessionEnded: (platform: PlatformType, durationSeconds: number) => void;
}

export interface IPlatformMonitoringAdapter {
  checkUsagePermission(): Promise<PermissionStatus>;
  requestUsagePermission(): Promise<PermissionStatus>;
  checkOverlayPermission(): Promise<PermissionStatus>;
  requestOverlayPermission(): Promise<PermissionStatus>;
  startForegroundMonitoring(platforms: PlatformType[]): Promise<boolean>;
  stopForegroundMonitoring(): Promise<void>;
  updateFloatingBrainCount(count: number, state: string): Promise<void>;
  setFloatingBrainVisible(visible: boolean): Promise<void>;
}

class CrossPlatformMonitoringAdapter implements IPlatformMonitoringAdapter {
  private isAndroid = Platform.OS === 'android';
  private isIOS = Platform.OS === 'ios';

  public async checkUsagePermission(): Promise<PermissionStatus> {
    if (this.isAndroid) {
      if (NativeModules.RotBrainUsageStatsModule) {
        return await NativeModules.RotBrainUsageStatsModule.checkPermission();
      }
      return 'granted'; // Default simulation state in JS runner
    }

    if (this.isIOS) {
      if (NativeModules.RotBrainScreenTimeModule) {
        return await NativeModules.RotBrainScreenTimeModule.checkAuthorization();
      }
      return 'granted';
    }

    return 'unsupported';
  }

  public async requestUsagePermission(): Promise<PermissionStatus> {
    if (this.isAndroid && NativeModules.RotBrainUsageStatsModule) {
      return await NativeModules.RotBrainUsageStatsModule.requestPermission();
    }
    return 'granted';
  }

  public async checkOverlayPermission(): Promise<PermissionStatus> {
    if (this.isAndroid) {
      if (NativeModules.RotBrainOverlayModule) {
        return await NativeModules.RotBrainOverlayModule.checkPermission();
      }
      return 'granted';
    }
    return 'unsupported'; // iOS does not support persistent system-wide overlays
  }

  public async requestOverlayPermission(): Promise<PermissionStatus> {
    if (this.isAndroid && NativeModules.RotBrainOverlayModule) {
      return await NativeModules.RotBrainOverlayModule.requestPermission();
    }
    return 'unsupported';
  }

  public async startForegroundMonitoring(platforms: PlatformType[]): Promise<boolean> {
    if (this.isAndroid && NativeModules.RotBrainAccessibilityModule) {
      return await NativeModules.RotBrainAccessibilityModule.startMonitoring(platforms);
    }
    return true;
  }

  public async stopForegroundMonitoring(): Promise<void> {
    if (this.isAndroid && NativeModules.RotBrainAccessibilityModule) {
      await NativeModules.RotBrainAccessibilityModule.stopMonitoring();
    }
  }

  public async updateFloatingBrainCount(count: number, state: string): Promise<void> {
    if (this.isAndroid && NativeModules.RotBrainOverlayModule) {
      await NativeModules.RotBrainOverlayModule.updateCount(count, state);
    }
  }

  public async setFloatingBrainVisible(visible: boolean): Promise<void> {
    if (this.isAndroid && NativeModules.RotBrainOverlayModule) {
      await NativeModules.RotBrainOverlayModule.setVisible(visible);
    }
  }
}

export const PlatformMonitoring = new CrossPlatformMonitoringAdapter();
