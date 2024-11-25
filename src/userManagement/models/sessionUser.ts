import { VisibilityRules } from '@/visibilityEngine/rules';

export enum UserRole {
  MEMBER,
  PERSONAL_REP,
  AUTHORIZED_USER,
}

export type SessionUser = {
  id: string;
  currUsr?: {
    umpi: string;
    fhirId: string;
    role: UserRole;
    plan: {
      memCk: string;
      sbsbCk: string;
      grgrCk: string;
      grpId: string;
      subId: string;
      fhirId: string;
    };
  };
  rules?: string;
  vRules?: VisibilityRules;
};
