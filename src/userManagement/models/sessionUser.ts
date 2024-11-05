import { VisibilityRules } from '@/visibilityEngine/rules';

export type SessionUser = {
  id: string;
  currUsr?: {
    umpi: string;
    fhirId: string;
    firstName: string;
    lastName: string;
    plan: {
      memCk: string;
      sbsbCk: string;
      grgrCk: string;
      grpId: string;
      subId: string;
      fhirId: string;
      coverageType: Array<string>;
      planName: string;
    };
  };
  rules?: string;
  vRules?: VisibilityRules;
};
