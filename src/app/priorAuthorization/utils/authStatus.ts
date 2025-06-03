import {
  StatusLabelEnum,
  StatusLabelStatus,
} from '@/components/foundation/StatusLabel';

export function getAuthStatus(status: string): StatusLabelStatus {
  const statusMap: Record<string, StatusLabelStatus> = {
    Processed: StatusLabelEnum.SUCCESS,
    Paid: StatusLabelEnum.SUCCESS,
    Denied: StatusLabelEnum.ERROR,
    Pending: StatusLabelEnum.NEUTRAL,
    'Partial Approval': StatusLabelEnum.PARTIAL_APPROVAL,
    Approved: StatusLabelEnum.SUCCESS,
  };
  return statusMap[status] || StatusLabelEnum.EMPTY;
}
