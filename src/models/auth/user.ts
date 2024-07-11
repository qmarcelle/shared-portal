import { DefaultSession } from 'next-auth';
import { UserProfile } from './user_profile';

export interface User {
  userName: string;
  name: string;
  umpi: string;
  fhirId: string;
  profiles: UserProfile[];
}

export type PortalUser = DefaultSession['user'] & User;
