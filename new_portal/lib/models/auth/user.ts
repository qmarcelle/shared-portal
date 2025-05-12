import { MemberUser } from './member_user';

export interface User {
  id: string;
  name: string;
  members: MemberUser[];
}