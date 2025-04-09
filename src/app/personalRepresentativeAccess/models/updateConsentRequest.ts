export interface UpdateConsentRequest {
  consentId: string | undefined;
  policyId: string | undefined;
  effectiveOn: string | undefined;
  expiresOn: string | undefined;
  requestType: string;
}
