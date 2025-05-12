import { User } from './auth/user';
import { MemberUser } from './auth/member_user';

export interface UserProfile {
  user: User;
  selectedMember: MemberUser | null;
  email: string;
  phoneNumber?: string;
  address?: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
  };
  preferences?: {
    communicationPreferences: {
      email: boolean;
      sms: boolean;
      push: boolean;
    };
    notifications: {
      claims: boolean;
      appointments: boolean;
      benefits: boolean;
    };
  };
}