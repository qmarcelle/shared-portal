export interface ClaimDetails {
  id: string;
  claimType: 'Medical' | 'Pharmacy' | 'Dental' | 'Vision';
  issuer: string;
  memberName: string;
  serviceDate: string;
  claimTotal: string | null;
  claimStatus: string;
  // TODO: Find the correct Model and type it here
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  claimInfo: any;
  isMiniCard?: boolean;
  callBack?: (claimId: string) => void;
  columns?: ColumnInfo[];
}

export interface ColumnInfo {
  label: string;
  value: string | null;
  defaultValue: string;
  isValueBold?: boolean;
  isVisibleInMobile?: boolean;
}
