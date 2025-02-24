export interface SDKResponse {
  interactionId: string;
  companyId: string;
  connectorId: string;
  capabilityName: string;
  access_token: string;
  token_type: string;
  expires_in: number;
  skProxyApiEnvironmentId: string;
  success: boolean;
  authorizationEndpoint: string;
}
