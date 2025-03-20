import { UserRole } from '@/userManagement/models/sessionUser';

export const checkPersonalRepAccess = (
  userRole: UserRole | undefined,
): boolean => {
  return userRole !== UserRole.PERSONAL_REP;
};
