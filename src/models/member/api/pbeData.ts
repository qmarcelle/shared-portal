import { AccessStatus } from '@/models/app/getSharePlanDetails';

export type PBEData = {
  getPBEmessage: string;
  getConsentmessage: string;
  getPBECorrelationId: string;
  consentCorrelationId: string;
  getPBEDetails: GetPBEDetail[];
  consentDetails: ConsentDetail[];
};

export type ConsentDetail = {
  id: string;
  name: string;
  description: string;
  status: string;
  performer: string;
  requester: string;
  requestee: string;
  policyId: string;
  policyBusinessIdentifier: string;
  type: string;
  effectiveOn: string;
  expiresOn: string;
  signedOn: string;
  modifiedAt: string;
  accessControl: string;
  options: Option[];
};

export type Option = {
  id: string;
  businessIdentifier: string;
  caption: string;
  mappings: Mapping[];
};

export type Mapping = {
  criteria: string;
  key: string;
  value: string;
};

export type GetPBEDetail = {
  umpid: string;
  userName: string;
  personFHIRID: string;
  firstName: string;
  middleName: string;
  lastName: string;
  suffix: string;
  address1: string;
  address2: string;
  phoneNumber: string;
  city: string;
  state: string;
  zip: number;
  dob: string;
  gender: string;
  email: string;
  relationshipInfo: RelationshipInfo[];
};

export type RelationshipInfo = {
  personRoleType: string;
  org: string;
  roleTermDate: string;
  nativeId: string;
  primaryPlanFlag: boolean;
  patientFHIRID: string;
  userName: string;
  memeCk: string;
  clientId: string;
  multiPlanConfirmed: boolean;
  multiPlanConfirmedDate: string;
  approvalRequestId: string;
  relatedPersons: RelatedPerson[];
};

export type RelatedPerson = {
  relatedPersonUMPID: string;
  relatedPersonFirstName: string;
  relatedPersonLastName: string;
  relatedPersonMiddleName: string;
  relatedPersonSuffix: string;
  relatedPersonNativeId: string;
  relatedPersonFHIRID: string;
  relatedPersonPatientFHIRID: string;
  relatedPersonRelationshipTermDate: string;
  relatedPersonRoleType: string;
  relatedPersonDob: string;
  relatedPersonApprovalRequestId: string;
  relatedPersonMemeCk: string;
  id: string;
  expiresOn: string;
  effectiveOn: string;
  policyId: string;
  name: AccessStatus;
};
