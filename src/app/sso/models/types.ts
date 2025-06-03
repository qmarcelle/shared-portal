import { LoggedInMember } from '@/models/app/loggedin_member';

/**
 * Base interface for all SSO parameter objects
 */
export interface BaseSSOParameters {
  subscriberId?: string;
  firstName?: string;
  lastName?: string;
  dateOfBirth?: string;
  memberId?: string;
  subject?: string;
  targetResource?: string;
}

/**
 * Base interface for all SSO providers
 */
export interface SSOProvider {
  /**
   * Generate the parameters needed for SSO with this provider
   */
  generateParameters(
    member: LoggedInMember,
    searchParams?: Record<string, string>,
  ): Promise<BaseSSOParameters>;

  /**
   * Get the display name of this SSO provider
   */
  getName(): string;

  /**
   * Whether this provider supports drop-off SSO
   */
  supportsDropOff(): boolean;

  /**
   * Get the provider ID
   */
  getProviderId(): string;
}

/**
 * Provider-specific parameter interfaces
 */
export interface ProviderDirectoryParameters extends BaseSSOParameters {
  prefix?: string;
  network?: string;
  planId?: string;
  groupNumber?: string;
  zipCode?: string;
  copay?: string;
  deductible?: string;
  sanitas?: string;
  pcpPhysicianId?: string;
  telehealth?: string;
}

export interface TeladocParameters extends BaseSSOParameters {
  groupNumber?: string;
  planId?: string;
}

export interface EyemedParameters extends BaseSSOParameters {
  clientId?: string;
  targetResource?: string;
}

export interface ChipRewardsParameters extends BaseSSOParameters {
  // Simple parameters, only uses subject/memberId
}

export interface HealthEquityParameters extends BaseSSOParameters {
  accountType?: string;
  employerCode?: string;
  personId?: string;
}

export interface Blue365Parameters extends BaseSSOParameters {
  clientId?: string;
  targetResource?: string;
}

export interface CVSCaremarkParameters extends BaseSSOParameters {
  clientId?: string;
  firstName?: string;
  lastName?: string;
  planId?: string;
  targetResource?: string;
}

export interface ElectronicPaymentBOAParameters extends BaseSSOParameters {
  accountNumber?: string;
  currentBalance?: string;
  currentStatementBalance?: string;
  dateTime?: string;
  partnerId?: string;
  partnerKey?: string;
  partnerSessionId?: string;
  partnerSignatureKey?: string;
  paymentDueDate?: string;
  timeStamp?: string;
}

export interface EmboldParameters extends BaseSSOParameters {
  clientId?: string;
  gender?: string;
  lastName?: string;
}

export interface HSABankParameters extends BaseSSOParameters {
  firstName?: string;
  lastName?: string;
}

export interface InstamedParameters extends BaseSSOParameters {
  amountDue?: string;
  claimNumber?: string;
  claimReferenceNumber?: string;
  patientFirstName?: string;
  patientId?: string;
  patientLastName?: string;
  patientServiceBeginDate?: string;
  patientServiceEndDate?: string;
  payToProviderAddress?: string;
  payToProviderCity?: string;
  payToProviderName?: string;
  payToProviderState?: string;
  payToProviderZip?: string;
  providerBillingTin?: string;
  renderingProvider?: string;
}

export interface M3PParameters extends BaseSSOParameters {
  clientId?: string;
  programId?: string;
  target?: string;
}

export interface OnLifeParameters extends BaseSSOParameters {
  challengeId?: string;
  targetParam?: string;
}

export interface PinnacleBankParameters extends BaseSSOParameters {
  accountType?: string;
}

export interface PremiseHealthParameters extends BaseSSOParameters {
  employerId?: string;
  employeeId?: string;
  birthYear?: string;
  zipCode?: string;
}

export interface VitalsPRPParameters extends BaseSSOParameters {
  // Uses standard parameters
  planId?: string;
}
