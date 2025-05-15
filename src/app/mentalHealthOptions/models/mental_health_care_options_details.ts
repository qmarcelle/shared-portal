import { Session } from 'next-auth';
export interface VirtualHealthCareDetails {
  healthcareType: string;
  icon?: string;
  healthCareName: string;
  description: string;
  link: string;
  itemData: string[];
  itemDataTitle: string;
  url?: string;
  redirectLink?: (groupId: Session | null) => string;
  sessionData?: Session | null;
}
