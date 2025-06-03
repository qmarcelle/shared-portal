import { LoggedInMember } from '@/models/app/loggedin_member';
import { createContext } from 'react';

export const LoggedInMemberContext = createContext<LoggedInMember>({} as any);
