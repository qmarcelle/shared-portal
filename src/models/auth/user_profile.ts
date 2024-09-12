import { Member } from '../member/member';

export interface UserProfile {
  role: 'member' | 'personalRepresentative' | 'authorizedUser';
  accessLevel: 'limited' | 'full';
  member: Member;
}
