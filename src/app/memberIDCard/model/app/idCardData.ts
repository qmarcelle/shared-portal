export type IdCardData = {
  idCardSvgFrontData: string | null;
  idCardSvgBackData: string | null;
  memberDetails: IdCardMemberDetails | null;
};

export interface IdCardMemberDetails {
  contact: MemberContactInfo;
  memberRelation: string;
  noOfDependents: number;
  first_name: string;
  last_name: string;
}

export interface MemberContactInfo {
  address1: string;
  city: string;
  state: string;
  zipcode: string;
}
