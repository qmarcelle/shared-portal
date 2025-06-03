import { MemberInfo } from '@/app/ihbc/models/service_responses/MemberInfo';
import { PlansRequest } from '@/app/ihbc/models/service_responses/PlansRequest';
import { LoggedInMember } from '@/models/app/loggedin_member';
import { IHBCSchema } from '../../rules/schema';
import { getAge } from '../../utils/DateUtils';

function mergeArrays<T>(
  arr1: T[] | null | undefined,
  arr2: T[] | null | undefined,
): T[] {
  const validArr1 = arr1 ?? [];
  const validArr2 = arr2 ?? [];
  return [...validArr1, ...validArr2];
}

export async function getPlanRequest(
  county: string,
  countycode: string,
  dependents: NonNullable<NonNullable<IHBCSchema['addDeps']>['dependents']>,
  existingDeps: NonNullable<NonNullable<IHBCSchema['addDeps']>['existingDeps']>,
  userInfoData: LoggedInMember,
  effectiveDate: string,
) {
  const memberInfoDependentsList: MemberInfo[] =
    dependents &&
    dependents?.map((val) => ({
      countyCode: countycode,
      age: getAge(val.dob, effectiveDate),
      memberID: val.firstName,
      gender: val.gender,
      dob: val.dob,
      relationship: val.relationship,
      tobaccoUse: val.tobaccoUse == 'Y' ? true : false,
      groupId: userInfoData.groupId,
    }));

  const memberInfoExistingList: MemberInfo[] =
    existingDeps &&
    existingDeps?.map((val) => ({
      countyCode: countycode,
      age: getAge(val.dob, effectiveDate),
      memberID: val.firstName,
      gender: val.gender,
      dob: val.dob,
      relationship: val.relationship,
      tobaccoUse: val.tobaccoUse == 'Y' ? true : false,
      groupId: userInfoData.groupId,
    }));

  const memberInfoList = mergeArrays(
    memberInfoDependentsList,
    memberInfoExistingList,
  );

  const plansRequest: PlansRequest = {
    groupId: userInfoData.groupId,
    effectiveDate: effectiveDate,
    county: county,
    memberInfoList: memberInfoList!,
  };
  console.log('plansRequest', plansRequest);
  return plansRequest;
}
