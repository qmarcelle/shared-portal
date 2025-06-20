import { VisibilityRules } from '@/visibilityEngine/rules';

export type ProfileSettingsAppData = {
  email: string;
  phone: string;
  memberDetails: MemberDetails;
  visibilityRules?: VisibilityRules;
};

export type MemberDetails = {
  fullName: string;
  dob: string;
};
