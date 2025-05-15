export interface GenesysChatConfig {
  // Required fields
  isChatAvailable: string;
  deploymentId: string;
  orgId: string;
  chatMode: 'legacy' | 'cloud';
  firstname: string;
  lastname: string;
  chatHours: string;
  rawChatHrs: string;
  isChatEligibleMember: string;
  isDemoMember: string;
  isAmplifyMem: string;
  isCobrowseActive: string;
  // Optional fields
  selfServiceLinks?: Array<any>;
  genesysWidgetUrl?: string; // Required for legacy mode
  // Any other fields your API might return
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any;
}
