import { VisibilityRules } from '@/visibilityEngine/rules';

export enum UserRole {
  MEMBER = 'MEM',
  PERSONAL_REP = 'PR',
  AUTHORIZED_USER = 'AU',
  NON_MEM = 'NM',
}

export type SessionUser = {
  id: string;
  currUsr: {
    umpi: string;
    fhirId: string;
    role: UserRole;
    plan:
      | {
          memCk: string;
          sbsbCk: string;
          grgrCk: string;
          grpId: string;
          subId: string;
          fhirId: string;
          ntwkId: string;
        }
      | undefined;
  };
  rules?: string;
  vRules?: VisibilityRules;
  subscriberId?: string;
};
