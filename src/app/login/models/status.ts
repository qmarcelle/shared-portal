export enum LoginStatus {
  LOGIN_OK,
  MFA_REQUIRED,
  VERIFY_EMAIL,
  INVALID_CREDENTIALS,
  VALIDATION_FAILURE,
  ERROR,
}

export enum SelectMFAStatus {
  OK,
  VALIDATION_FAILURE,
  ERROR,
}

export enum SubmitMFAStatus {
  OTP_OK,
  OTP_INVALID,
  VALIDATION_FAILURE,
  ERROR,
}
