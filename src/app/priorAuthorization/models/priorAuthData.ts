export interface MemberPriorAuthDetail {
  referenceId: string;
  memberName: string;
  firstName?: string;
  lastName: string;
  memberId: string;
  claimType?: string;
  authorizationIndicator: string;
  referenceIndicator: string;
  statusCode: string;
  claimStatus: string;
  statusDescription?: string;
  issuer: string;
  serviceGroupDescription?: string;
  serviceGroupId: string;
  fromDate: string;
  toDate: string;
  priorAuthFlag: string;
  getProviderReferredTo: GetProviderReferredTo;
  getProviderReferredBy: GetProviderReferredBy;
  getProviderFacilityId?: GetProviderFacilityId;
}

export interface PriorAuthorizationResponse {
  memberPriorAuthDetails: MemberPriorAuthDetails;
}

export interface MemberPriorAuthDetails {
  memberPriorAuthDetail: MemberPriorAuthDetail[];
}
export interface GetProviderReferredTo {
  providerId: string;
  name: string;
  city: string;
  postalCode: string;
  state: string;
  streetAddress1: string;
  streetAddress2: string;
  phoneNumber: string;
}
export interface GetProviderReferredBy {
  providerId: string;
  name: string;
  city: string;
  postalCode: string;
  state: string;
  streetAddress1: string;
  streetAddress2: string;
  phoneNumber: string;
}
export interface GetProviderFacilityId {
  providerId?: string;
  name?: string;
  city?: string;
  postalCode?: string;
  state?: string;
  streetAddress1?: string;
  streetAddress2?: string;
  phoneNumber?: string;
}
