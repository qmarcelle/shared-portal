import { SessionUser } from '@/userManagement/models/sessionUser';
import { DefaultSession } from 'next-auth';
import { AdapterUser } from 'next-auth/adapters';

export type PortalUser = DefaultSession['user'] & SessionUser & AdapterUser;
