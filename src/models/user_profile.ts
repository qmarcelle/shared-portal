import { UserRole } from '@/userManagement/models/sessionUser';

export interface UserProfile {
  id: string;
  personFhirId: string;
  firstName: string;
  lastName: string;
  dob: string;
  type: UserRole;
  selected?: boolean;
  plans: Plan[];
  relationshipType?: string;
}

type Plan = {
  memCK: string;
  subscriberId?: string;
  patientFhirId: string;
  name?: string;
  policies?: string[];
  selected: boolean;
};
