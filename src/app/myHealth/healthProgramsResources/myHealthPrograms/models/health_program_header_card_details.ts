import { Session } from 'next-auth';
import { ReactNode } from 'react';

export interface HealthProgramHeaderCardDetails {
  title: string;
  description: string;
  serviceDesc: string;
  serviceDesc2?: ReactNode[];
  buttonText?: string;
  icon?: string;
  redirectLink?: (groupId: Session | null) => string;
}
