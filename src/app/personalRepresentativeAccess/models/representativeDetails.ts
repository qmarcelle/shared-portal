import { VisibilityRules } from '@/visibilityEngine/rules';

export interface RepresentativeData {
  memberName: string;
  DOB: string;
  isOnline: boolean;
  fullAccess: boolean;
}

export type RepresentativeViewDetails = {
  representativeData: RepresentativeData[] | null;
  visibilityRules?: VisibilityRules;
  isRepresentativeLoggedIn: boolean;
};
