export enum MfaMode {
  authenticator = 'totp',
  textNum = 'sms',
  callNum = 'voice',
  email = 'email',
}