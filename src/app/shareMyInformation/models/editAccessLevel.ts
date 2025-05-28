export interface EditAccessLevel {
  memberName: string;
  targetType?: string;
  isMaturedMinor?: boolean;
  expiresOn?: string;
  effectiveOn?: string;
  performer?: string;
  requester?: string;
  requestees?: string[];
  type?: string;
  firstName?: string;
  lastName?: string;
  implicit?: boolean;
  isMatureMinorMember?: boolean | undefined;
  isAdult?: boolean | undefined;
  personRoleType?: string | undefined;
  isMinorMember?: boolean | undefined;
  policyBusinessIdentifier?: string;
  status?: string;
}
