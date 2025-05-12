export type PasswordResetResponse = {
  message: string;
  accessToken: string;
  refreshToken: string;
  idToken: string;
  interactionId: string;
  interactionToken: string;
  sessionToken: string;
  email: string;
  userId: string;
  userToken?: string;
};