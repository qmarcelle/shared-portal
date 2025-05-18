import { VisibilityRules } from '@/visibilityEngine/rules';

export type CommunicationSettingsAppData = {
  emailAddress: string;
  mobileNumber: string;
  visibilityRules?: VisibilityRules;
  contactPreferences?: {
    optOut: string;
    communicationCategory: string;
    communicationMethod: string;
  }[];
  tierOne?: {
    communicationCategory: string;
    communicationMethod: string;
    hasTierTwo: boolean;
    description: {
      type: string;
      texts: string;
    }[];
  }[];
  tierOneDescriptions: TierDescriptions[];
  dutyToWarn?: { texts: string[] }[];
  phoneNumber?: string;
};

export interface TierDescriptions {
  hTexts: string[];
  pTexts: string[];
}
export interface CommunicationSettingsSaveRequest {
  memberKey: string | undefined;
  subscriberKey: string | undefined;
  emailAddress: string;
  mobileNumber: string;
  groupKey: string;
  lineOfBusiness: string;
  contactPreference: {
    optOut: string;
    communicationCategory: string;
    communicationMethod: string;
  }[];
}

export interface CommunicationSettingsSaveResponse {
  componentStatus: string;
}

export interface ContactPreference {
  optOut: string;
  communicationCategory: string;
  communicationMethod: string;
}

export enum AlertType {
  ReceiveTextAlerts = 'ReceiveTextAlerts',
  ReceiveEmailAlerts = 'ReceiveEmailAlerts',
}

export interface Preferences {
  hText: string;
  pText: string;
  selected: boolean;
  category?: string;
  method?: string;
  childCheckBox?: Map<AlertType, Preferences>;
}
