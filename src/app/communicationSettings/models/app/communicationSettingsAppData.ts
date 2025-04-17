import { VisibilityRules } from '@/visibilityEngine/rules';

export type CommunicationSettingsAppData = {
  emailAddress: string;
  mobileNumber: string;
  visibilityRules?: VisibilityRules;
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
  ImportantPlanInformation = 'ImportantPlanInformation',
  ClaimsInformation = 'ClaimsInformation',
  HealthWellness = 'HealthWellness',
}

export interface Preferences {
  hText: string;
  pText: string;
  selected: boolean;
  category?: string;
  method?: string;
  childCheckBox?: Map<AlertType, Preferences>;
}

export const PreferenceCommunication: Map<
  AlertType,
  { category: string; method: string }
> = new Map([
  [AlertType.ImportantPlanInformation, { category: 'PLIN', method: 'EML' }],
  [AlertType.ClaimsInformation, { category: 'CLMS', method: 'EML' }],
  [AlertType.HealthWellness, { category: 'HLTW', method: 'EML' }],
]);
