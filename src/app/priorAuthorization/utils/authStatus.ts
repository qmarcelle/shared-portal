const AuthStatus = {
  SUCCESS: 'success',
  ERROR: 'error',
  NEUTRAL: 'neutral',
  PARTIAL_APPROVAL: 'partialapproval',
  EMPTY: 'empty',
} as const;

export type AuthStatus = (typeof AuthStatus)[keyof typeof AuthStatus];

export function getAuthStatus(status: string): AuthStatus {
  const statusMap: Record<string, AuthStatus> = {
    Processed: AuthStatus.SUCCESS,
    Paid: AuthStatus.SUCCESS,
    Denied: AuthStatus.ERROR,
    Pending: AuthStatus.NEUTRAL,
    'Partial Approval': AuthStatus.PARTIAL_APPROVAL,
    Approved: AuthStatus.SUCCESS,
  };
  return statusMap[status] || AuthStatus.EMPTY;
}
