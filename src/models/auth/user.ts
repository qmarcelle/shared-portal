import { SessionUser } from '@/userManagement/models/sessionUser';
import { DefaultSession } from 'next-auth';
import { AdapterUser } from 'next-auth/adapters';
import { UserProfile } from './user_profile';

export interface User {
  id: string;
  name: string;
  umpi?: string;
  fhirId?: string;
  profiles?: UserProfile[];
}

export type PortalUser = DefaultSession['user'] & SessionUser & AdapterUser;
