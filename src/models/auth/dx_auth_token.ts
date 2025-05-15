export interface DXAuthToken {
  user: string;
  time: number;
  admin?: string;
  memberCk?: string;
  subscriberId?: string;
  constituent?: 'member' | 'broker' | 'employer' | 'sharedhealth';
}
