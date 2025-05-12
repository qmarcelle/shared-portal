export type PasswordResetRequest = {
  username: string;
  dateOfBirth: string;
  interactionId: string;
  interactionToken: string;
  newPassword: string;
  appId?: string;
};