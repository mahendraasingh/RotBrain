/**
 * RotBrain PlatformMonitoringAdapter
 * Unified TypeScript bridge decoupling shared React Native UI from native
 * Kotlin (Android) and Swift (iOS) monitoring services.
 */

import { Platform, NativeModules, Linking } from 'react-native';
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
  checkAccessibilityPermission(): Promise<PermissionStatus>;
  requestAccessibilityPermission(): Promise<PermissionStatus>;
  checkOverlayPermission(): Promise<PermissionStatus>;
  requestOverlayPermission(): Promise<PermissionStatus>;
  openSystemSettings(): Promise<void>;
  startForegroundMonitoring(platforms: PlatformType[]): Promise<boolean>;
  stopForegroundMonitoring(): Promise<void>;
  updateFloatingBrainCount(count: number, state: string): Promise<void>;
  setFloatingBrainVisible(visible: boolean): Promise<void>;
}

class CrossPlatformMonitoringAdapter implements IPlatformMonitoringAdapter {
  private isAndroid = Platform.OS === 'android';
  private isIOS = Platform.OS === 'ios';

  public async openSystemSettings(): Promise<void> {
    try {
      if (Linking.openSettings) {
        await Linking.openSettings();
      } else {
        await Linking.openURL('app-settings:');
      }
    } catch (e) {
      console.warn('Unable to open system settings directly:', e);
    }
  }

  public async checkUsagePermission(): Promise<PermissionStatus> {
    if (this.isAndroid) {
      if (NativeModules.RotBrainUsageStatsModule?.checkPermission) {
        return await NativeModules.RotBrainUsageStatsModule.checkPermission();
      }
      return 'not_requested';
    }

    if (this.isIOS) {
      if (NativeModules.RotBrainScreenTimeModule?.checkAuthorization) {
        return await NativeModules.RotBrainScreenTimeModule.checkAuthorization();
      }
      return 'not_requested';
    }

    return 'granted'; // Web environment
  }

  public async requestUsagePermission(): Promise<PermissionStatus> {
    if (this.isAndroid) {
      if (NativeModules.RotBrainUsageStatsModule?.requestPermission) {
        return await NativeModules.RotBrainUsageStatsModule.requestPermission();
      }
      await this.openSystemSettings();
      return 'requested';
    }

    if (this.isIOS) {
      if (NativeModules.RotBrainScreenTimeModule?.requestAuthorization) {
        return await NativeModules.RotBrainScreenTimeModule.requestAuthorization();
      }
      await this.openSystemSettings();
      return 'requested';
    }

    return 'granted';
  }

  public async checkAccessibilityPermission(): Promise<PermissionStatus> {
    if (this.isAndroid && NativeModules.RotBrainAccessibilityModule?.checkPermission) {
      return await NativeModules.RotBrainAccessibilityModule.checkPermission();
    }
    return 'granted';
  }

  public async requestAccessibilityPermission(): Promise<PermissionStatus> {
    if (this.isAndroid) {
      if (NativeModules.RotBrainAccessibilityModule?.requestPermission) {
        return await NativeModules.RotBrainAccessibilityModule.requestPermission();
      }
      await this.openSystemSettings();
      return 'requested';
    }
    return 'granted';
  }

  public async checkOverlayPermission(): Promise<PermissionStatus> {
    if (this.isAndroid) {
      if (NativeModules.RotBrainOverlayModule?.checkPermission) {
        return await NativeModules.RotBrainOverlayModule.checkPermission();
      }
      return 'not_requested';
    }
    return 'unsupported'; // iOS does not support persistent system-wide overlays
  }

  public async requestOverlayPermission(): Promise<PermissionStatus> {
    if (this.isAndroid) {
      if (NativeModules.RotBrainOverlayModule?.requestPermission) {
        return await NativeModules.RotBrainOverlayModule.requestPermission();
      }
      await this.openSystemSettings();
      return 'requested';
    }
    return 'unsupported';
  }

  public async startForegroundMonitoring(platforms: PlatformType[]): Promise<boolean> {
    if (this.isAndroid && NativeModules.RotBrainAccessibilityModule?.startMonitoring) {
      return await NativeModules.RotBrainAccessibilityModule.startMonitoring(platforms);
    }
    return true;
  }

  public async stopForegroundMonitoring(): Promise<void> {
    if (this.isAndroid && NativeModules.RotBrainAccessibilityModule?.stopMonitoring) {
      await NativeModules.RotBrainAccessibilityModule.stopMonitoring();
    }
  }

  public async updateFloatingBrainCount(count: number, state: string): Promise<void> {
    if (this.isAndroid && NativeModules.RotBrainOverlayModule?.updateCount) {
      await NativeModules.RotBrainOverlayModule.updateCount(count, state);
    }
  }

  public async setFloatingBrainVisible(visible: boolean): Promise<void> {
    if (this.isAndroid && NativeModules.RotBrainOverlayModule?.setVisible) {
      await NativeModules.RotBrainOverlayModule.setVisible(visible);
    }
  }
}

export const PlatformMonitoring = new CrossPlatformMonitoringAdapter();
