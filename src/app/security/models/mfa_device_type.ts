export enum MfaDeviceType {
  authenticator = 'totp',
  text = 'sms',
  voice = 'voice',
  email = 'email',
}

export enum MfaDeviceSetUpAnalytics {
  totp = 'authenticator app setup',
  sms = 'text message setup',
  voice = 'voice call setup',
  email = 'email setup',
}
export enum MfaDeviceTypeAnalytics {
  totp = 'authenticator app',
  sms = 'text message',
  voice = 'voice call',
  email = 'email message',
}
