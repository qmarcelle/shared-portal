export type SubmitMfaOtpResponse = {
  interactionId: string;
  interactionToken: string;
  accessToken: string;
  refreshToken: string;
  idToken: string;
  flowStatus: string;
  message?: string;
};