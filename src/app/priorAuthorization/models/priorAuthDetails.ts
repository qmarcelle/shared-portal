export interface PriorAuthDetails {
  issuer: string;
  memberName: string;
  serviceDate: string;
  serviceDateFormatted: string;
  priorAuthStatus: string;
  priorAuthTotal: string | null;
  // TODO: Find the correct Model and type it here
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  priorAuthInfo: any;
  isMiniCard?: boolean;
  callBack?: (claimId: string) => void;
  columns?: ColumnInfo[];
  referenceId?: string;
  memberCk?: string;
}

export interface ColumnInfo {
  label: string;
  value: number | string | null;
  defaultValue: string;
  isValueBold?: boolean;
  isVisibleInMobile?: boolean;
}
