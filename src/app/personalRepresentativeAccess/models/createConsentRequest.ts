export interface CreateConsentRequest {
  performer: string | undefined;
  requester: string | undefined;
  requestees: string[] | undefined;
  policyBusinessIdentifier: string | undefined;
  type: string | undefined;
  effectiveOn: string | undefined;
  expiresOn: string | undefined;
  firstName: string | undefined;
  lastName: string | undefined;
}
