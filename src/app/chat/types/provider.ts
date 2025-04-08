/**
 * Provider Types
 * Defines types for chat provider configuration and interfaces
 */

export interface ProviderConfig {
  endPoint: string;
  token: string;
  opsPhone: string;
  userID: string;
  memberFirstname: string;
  memberLastname: string;
  memberId: string;
  groupId: string;
  planId: string;
  planName: string;
  environment: 'production' | 'development';
}

export interface GenesysUserData {
  memberId: string;
  planId: string;
  groupId: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  config?: Record<string, unknown>;
  preferences?: {
    notifications: boolean;
    theme: 'light' | 'dark';
    fontSize: 'small' | 'medium' | 'large';
  };
}

export interface GenesysHeaderConfig {
  title: string;
  closeButton: boolean;
  minimizeButton: boolean;
}

export interface GenesysStyling {
  primaryColor: string;
  fontFamily: string;
  borderRadius: string;
}

export interface GenesysFeatures {
  typing: boolean;
  fileUpload?: boolean;
  emoji?: boolean;
}

export interface GenesysWidgetConfig {
  dataURL: string;
  userData: Partial<GenesysUserData>;
  containerEl: HTMLElement;
  headerConfig: GenesysHeaderConfig;
  styling: GenesysStyling;
  features: GenesysFeatures;
}
