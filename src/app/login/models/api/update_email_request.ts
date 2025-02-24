export type UpdateEmailRequest = {
  newEmail: string;
  interactionId: string;
  interactionToken: string;
  appId?: string;
};
