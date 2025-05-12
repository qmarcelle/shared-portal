export type SubmitMfaOtpRequest = {
  otp: string;
  interactionId: string;
  interactionToken: string;
};