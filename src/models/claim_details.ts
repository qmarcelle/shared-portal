import { PlanType } from './plan_type';

export interface ClaimDetails {
  id: string;
  encryptedClaimId?: string;
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
  providerId?: string;
}

export interface ColumnInfo {
  label: string;
  value: number | string | null;
  isDollar?: boolean;
  defaultValue: string;
  isValueBold?: boolean;
  isVisibleInMobile?: boolean;
}

export const ClaimStatus = {
  ADJUSTED_ENCOUNTER: 'Adjusted Encounter',
  AWAITING_PROCESSING: 'Awaiting Processing',
  CLOSED: 'Closed',
  COMPLETED: 'Completed',
  ENCOUNTER_PROCESSED: 'Encounter Processed',
  ENCOUNTER_REPROCESSED: 'Encounter Reprocessed',
  HISTORY: 'History',
  IN_PROCESS: 'In Process',
  ORIGINAL_CLAIM_ADJUSTED: 'Original Claim Adjusted',
  PREDETERMINATION_COMPLETE: 'Predetermination Complete',
  PREDETERMINATION_PENDED: 'Predetermination Pended',
  PROCESSED: 'Processed',
} as const;

export type ClaimStatus = typeof ClaimStatus[keyof typeof ClaimStatus];
