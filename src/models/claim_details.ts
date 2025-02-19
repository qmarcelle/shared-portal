import { PlanType } from './plan_type';

export interface ClaimDetails {
  id: string;
  claimType: PlanType;
  type?: string;
  issuer: string;
  memberId: string;
  memberName: string;
  serviceDate: string;
  claimTotal: string | null;
  claimStatus: string;
  claimStatusCode: number;
  // TODO: Find the correct Model and type it here
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  claimInfo: any;
  isMiniCard?: boolean;
  callBack?: (claimId: string) => void;
  columns?: ColumnInfo[];
}

export interface ColumnInfo {
  label: string;
  value: number | string | null;
  isDollar?: boolean;
  defaultValue: string;
  isValueBold?: boolean;
  isVisibleInMobile?: boolean;
}
