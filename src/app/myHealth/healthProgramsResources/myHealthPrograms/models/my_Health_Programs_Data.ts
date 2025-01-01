import { Session } from 'next-auth';

export type MyHealthProgramsData = {
  careTNAccessCode: string;
  sessionData: Session | null;
};
