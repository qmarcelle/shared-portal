import { MemberInfo } from './MemberInfo';

export interface PlansRequest {
  groupId: string;
  effectiveDate: string;
  county: string;
  memberInfoList: MemberInfo[];
}
