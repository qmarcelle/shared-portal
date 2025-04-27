import { LoginInteractionData } from '../app/login_interaction_data';

export type AccountDeactivationRequest = {
  primaryUserName: string | undefined;
  umpiId: string | undefined;
  userName: string;
  interactionData: LoginInteractionData | null;
};
