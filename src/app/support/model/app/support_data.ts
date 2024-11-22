export interface SupportData {
  memberDetails: SupportMemberDetails | null;
}

interface SupportMemberDetails {
  groupId: string;
  digitalId: string;
}
