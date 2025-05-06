export type VerifyEmailOtpRequest = {
  emailOtp: string;
  interactionId: string;
  interactionToken: string;
  policyId?: string;
  appId?: string;
  username: string;
};
