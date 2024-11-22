export type EmailAppData = {
  email: string;
  phone: string;
  memberDetails: MemberDetails[];
};

export type MemberDetails = {
  fullName: string;
  memberCK: string;
};

export type EmailRequest = {
  memberEmail?: string;
  groupID?: string;
  category?: string;
  message?: string;
  name?: string;
  subscriberID?: string;
  planID?: string;
  contactNumber?: string;
  categoryValue?: string;
  memberDOB?: string;
  dependentName?: string;
  amplifyHealth?: boolean;
};
