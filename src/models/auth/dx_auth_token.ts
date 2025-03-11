export interface DXAuthToken {
  user: string;
  time: number;
  memberCk?: number;
  subscriberId?: string;
  constituent?: 'member' | 'broker' | 'employer' | 'sharedhealth';
}
