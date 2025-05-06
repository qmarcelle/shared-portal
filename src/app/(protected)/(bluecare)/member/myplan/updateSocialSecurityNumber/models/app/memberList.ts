export type MemberList = {
  members: Member[];
};

export type Member = {
  memberCk: number;
  firstName: string;
  lastName: string;
  birthDate: string;
  hasSocial: boolean;
};
