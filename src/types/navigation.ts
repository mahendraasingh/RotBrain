/**
 * RotBrain Navigation Parameter Types
 */

import { PlatformType } from './platform';

export type RootStackParamList = {
  Onboarding: undefined;
  MainApp: undefined;
  SessionDetail: { sessionId: string };
  PermissionExplainer: { platform?: PlatformType };
};

export type OnboardingStackParamList = {
  Welcome: undefined;
  UnderstandScrolling: undefined;
  MeetYourBrain: undefined;
  ChoosePlatforms: undefined;
  EnablePermissions: undefined;
  ReadyToBegin: undefined;
};

export type AppTabsParamList = {
  Dashboard: undefined;
  Analytics: undefined;
  Settings: undefined;
};
