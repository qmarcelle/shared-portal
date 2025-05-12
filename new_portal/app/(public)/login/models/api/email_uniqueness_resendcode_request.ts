export type EmailUniquenessResendCodeRequest = {
  interactionId: string;
  interactionToken: string;
  appId?: string;
};

export interface EmailUniquenessResendCodeResponse {
  message: string;
  interactionId: string;
  interactionToken: string;
  email?: string;
}

export enum EmailUniquenessResendCodeStatus {
  RESEND_OTP,
  INVALID_OTP,
  EXPIRED_OTP,
  ERROR,
}