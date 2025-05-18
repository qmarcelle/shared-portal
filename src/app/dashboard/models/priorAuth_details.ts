export interface DashboardPriorAuthDetails {
  priorAuthType: 'Medical' | 'Pharmacy' | 'Dental';
  priorAuthName: string;
  dateOfVisit: string;
  priorAuthStatus: string;
  member: string;
  referenceId: string;
}
