export interface DXAuthToken {
  user: string;
  time: number;
  memberCk?: string;
  subscriberId?: string;
  constituent?: 'member' | 'broker' | 'employer' | 'sharedhealth';
}
