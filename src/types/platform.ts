/**
 * RotBrain Platform & Permission Types
 */

export type PlatformType = 'instagram' | 'youtube';

export type DashboardFilter = 'all' | 'instagram' | 'youtube';

export type PermissionStatus =
  | 'not_requested'
  | 'requested'
  | 'granted'
  | 'denied'
  | 'revoked'
  | 'unsupported'
  | 'requires_setup';

export interface PlatformConfig {
  id: PlatformType;
  displayName: string;
  shortName: string;
  iconName: string;
  brandColor: string;
  contentDescription: string;
}

export const PLATFORM_CONFIGS: Record<PlatformType, PlatformConfig> = {
  instagram: {
    id: 'instagram',
    displayName: 'Instagram Reels',
    shortName: 'Reels',
    iconName: 'instagram',
    brandColor: '#E1306C',
    contentDescription: 'Short-form vertical video reels inside Instagram.',
  },
  youtube: {
    id: 'youtube',
    displayName: 'YouTube Shorts',
    shortName: 'Shorts',
    iconName: 'youtube',
    brandColor: '#FF0000',
    contentDescription: 'Short-form vertical video clips inside YouTube.',
  },
};
