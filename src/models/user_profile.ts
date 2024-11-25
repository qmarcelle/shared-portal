export enum UserType {
  Primary = 'Primary',
  PersonalRepresentative = 'Personal Representative',
  AuthorizedUser = 'Authorized User',
}
export interface UserProfile {
  id: string;
  name: string;
  dob: string;
  type?: UserType;
}
