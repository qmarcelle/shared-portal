import {
  PBEData,
  RelatedPerson,
  RelationshipInfo,
} from '@/models/member/api/pbeData';
import { UserProfile } from '@/models/user_profile';
import { UserRole } from '@/userManagement/models/sessionUser';
import { formatDateString } from './date_formatter';
import { logger } from './logger';

/**
 * Computes the UserProfiles available in a given PBE.
 * It makes a list of all user profiles where each user
 * profile contains a list of all the plans for the role.
 * @param pbe PBE Response of user
 * @param selectedUserId current userId selected
 * @returns List of User Profiles with plans
 */
export function computeUserProfilesFromPbe(
  pbe: PBEData,
  selectedUserId?: string,
  selectedPlanId?: string,
): UserProfile[] {
  try {
    const profiles: UserProfile[] = [];

    pbe.getPBEDetails[0].relationshipInfo.forEach((relationship) => {
      const memberProfile = findMemberRoleInProfiles(profiles);
      if (['Subscriber', 'Dependent'].includes(relationship.personRoleType)) {
        if (memberProfile == null) {
          addMemberToProfiles(
            profiles,
            pbe,
            selectedUserId,
            relationship,
            selectedPlanId,
          );
        } else {
          memberProfile?.plans.push({
            memCK: relationship.memeCk,
            selected: relationship.memeCk == selectedPlanId,
            patientFhirId: relationship.patientFHIRID,
          });
        }
      } else {
        const relatedPerson = relationship.relatedPersons[0];
        addAUOrPRToProfiles(
          profiles,
          relatedPerson,
          relationship,
          selectedUserId,
          selectedPlanId,
        );
      }
    });

    if (findMemberRoleInProfiles(profiles) == null) {
      addNonMemberToProfiles(profiles, pbe, selectedUserId);
    }

    return profiles;
  } catch (err) {
    logger.error('Compute User Profiles Error', err);
    throw err;
  }
}

function findMemberRoleInProfiles(profiles: UserProfile[]) {
  return profiles.find((item) => item.type == UserRole.MEMBER);
}

function addNonMemberToProfiles(
  profiles: UserProfile[],
  pbe: PBEData,
  selectedUserId: string | undefined,
) {
  profiles.unshift({
    id: pbe.getPBEDetails[0].umpid,
    personFhirId: pbe.getPBEDetails[0].personFHIRID,
    firstName: pbe.getPBEDetails[0].firstName,
    lastName: pbe.getPBEDetails[0].lastName,
    dob: formatDateString(pbe.getPBEDetails[0].dob, 'yyyy-mm-dd', 'mm/dd/yyyy'),
    type: UserRole.NON_MEM,
    selected: selectedUserId == pbe.getPBEDetails[0].umpid,
    plans: [],
  });
}

function addAUOrPRToProfiles(
  profiles: UserProfile[],
  relatedPerson: RelatedPerson,
  relationship: RelationshipInfo,
  selectedUserId: string | undefined,
  selectedPlanId: string | undefined,
) {
  profiles.push({
    id: relatedPerson.relatedPersonUMPID,
    personFhirId: relatedPerson.relatedPersonFHIRID,
    firstName: relatedPerson.relatedPersonFirstName,
    lastName: relatedPerson.relatedPersonLastName,
    dob: formatDateString(
      relatedPerson.relatedPersonDob,
      'yyyy-mm-dd',
      'mm/dd/yyyy',
    ),
    type:
      relationship.personRoleType == 'PR'
        ? UserRole.PERSONAL_REP
        : UserRole.AUTHORIZED_USER,
    selected: selectedUserId == relatedPerson.relatedPersonUMPID,
    plans: relationship.relatedPersons.map((relatedPerson) => ({
      memCK: relatedPerson.relatedPersonMemeCk,
      patientFhirId: relatedPerson.relatedPersonPatientFHIRID,
      selected: relatedPerson.relatedPersonMemeCk == selectedPlanId,
    })),
  });
}

function addMemberToProfiles(
  profiles: UserProfile[],
  pbe: PBEData,
  selectedUserId: string | undefined,
  relationship: RelationshipInfo,
  selectedPlanId: string | undefined,
) {
  profiles.push({
    id: pbe.getPBEDetails[0].umpid,
    personFhirId: pbe.getPBEDetails[0].personFHIRID,
    firstName: pbe.getPBEDetails[0].firstName,
    lastName: pbe.getPBEDetails[0].lastName,
    dob: formatDateString(pbe.getPBEDetails[0].dob, 'yyyy-mm-dd', 'mm/dd/yyyy'),
    type: UserRole.MEMBER,
    selected: selectedUserId == pbe.getPBEDetails[0].umpid,
    plans: [
      {
        memCK: relationship.memeCk,
        selected: relationship.memeCk == selectedPlanId,
        patientFhirId: relationship.patientFHIRID,
      },
    ],
  });
}
