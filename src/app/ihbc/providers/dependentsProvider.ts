import { MemberData } from '@/actions/loggedUserInfo';
import { createContext } from 'react';

export const DependentsContext = createContext<{
  members: MemberData[];
  setMembers: () => void;
}>({} as any);
