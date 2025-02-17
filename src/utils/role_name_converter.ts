import { UserRole } from '@/userManagement/models/sessionUser';

/**
 * Returns the View Role Text for the giver profile
 * For eg. if Role is PR it returns
 * 'View as Personal Representative'
 * @param role The Profile Role
 * @returns Views as Role Text
 */
export function getViewAsRoleNameFromType(role: UserRole) {
  switch (role) {
    case UserRole.AUTHORIZED_USER:
      return 'View as Authorized User:';
    case UserRole.PERSONAL_REP:
      return 'View as Personal Representative:';
    case UserRole.MEMBER:
    case UserRole.NON_MEM:
      return 'My Profile';
  }
}

/**
 * Converts the selected User role enum to the
 * actual name of the user role.
 * For eg. UserRole.PERSONAL_REP ->
 * Personal Representative
 * @param role The User Role selected
 * @returns The actual name of the User Role
 */
export function computeRoleNameFromType(role: UserRole) {
  switch (role) {
    case UserRole.AUTHORIZED_USER:
      return 'Authorized User';
    case UserRole.PERSONAL_REP:
      return 'Personal Representative';
    case UserRole.MEMBER:
    case UserRole.NON_MEM:
      return 'My Profile';
  }
}
