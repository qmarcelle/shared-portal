'use server';

import { getLoggedInUserInfo } from '@/actions/loggedUserInfo';
import { auth } from '@/auth';
import {
  APP_STATUS_SUBMITTED,
  benefitChangeService,
  RESOURCE_API,
  SAVE_APP,
  UPDATE_APP,
  USER_HEADER,
} from '@/utils/api/benefitChangeService';
import { convertDatesOfObject } from '@/utils/date_formatter';
import { Address } from '../models/Address';
import { BenefitChangeInfo } from '../models/BenefitChangeInfo';
import { Dependent } from '../models/Dependent';
import { BenefitChangeResponse } from '../models/service_responses/BenefitChangeResponse';
import { IHBCSchema } from '../rules/schema';
import { createAddress } from '../utils/request_creation_utils/address_creation';

export async function callSubmitApplication(
  request: BenefitChangeInfo,
  formData: IHBCSchema,
) {
  const session = await auth();
  const loggedInUserInfo = await getLoggedInUserInfo(
    session!.user.currUsr.plan!.memCk,
  );

  const addDependents: Partial<Dependent>[] =
    formData.addDeps?.dependents?.map((item, index) => ({
      applicationId: request.applicationId,
      appSubmittedDate: request.applSubmittedDate,
      dependentChangeTypeInd: 'A',
      dependentDateOfBirth: item.dob,
      dependentFirstName: item.firstName,
      dependentGender: item.gender,
      dependentSeqNum: index.toString(),
      dependentTobaccoUsageInd: item.tobaccoUse,
      dependentRelationShipDesc: item.relationship,
      userId: session?.user.id,
      subscriberId: loggedInUserInfo.subscriberID,
    })) ?? [];

  const remDependents: Partial<Dependent>[] =
    formData.removeDeps?.dependents?.map((item, index) => ({
      applicationId: request.applicationId,
      appSubmittedDate: request.applSubmittedDate,
      dependentChangeTypeInd: 'D',
      dependentDateOfBirth: item.dob,
      dependentFirstName: item.firstName,
      dependentSeqNum: index.toString(),
      userId: session?.user.id,
      subscriberId: loggedInUserInfo.subscriberID,
      dependentTermReason: item.terminationReason,
      dependentTermDate: item.terminationDate,
    })) ?? [];

  let apiRequest: BenefitChangeInfo = {
    ...request,
    userId: session?.user.id,
    applicationId: '',
    groupId: session?.user.currUsr.plan?.grpId,
    subscriberId: session?.user.currUsr.plan?.subId, //
    subscriberLastName: loggedInUserInfo.subscriberLastName,
    subscriberFirstName: loggedInUserInfo.subscriberFirstName,
    subscriberMiddleName: '',
    subscriberDateOfBirth: loggedInUserInfo.subscriberDateOfBirth,
    addresses: [
      {
        type: 'residence',
        data: formData.changePersonalInfo?.changeAddress?.residence,
      },
      {
        type: 'billing',
        data: formData.changePersonalInfo?.changeAddress?.billing,
      },
      {
        type: 'mailing',
        data: formData.changePersonalInfo?.changeAddress?.mailing,
      },
    ]
      .map((item) =>
        createAddress({
          type: item.type,
          data: item.data,
          applicationDate: '',
          applicationId: '',
          subscriberId: loggedInUserInfo.subscriberID,
          userId: session!.user.id,
        }),
      )
      .filter(Boolean) as Address[],
    dependents: [...addDependents, ...remDependents],
    planSearchMembers: [
      ...(formData.addDeps?.existingDeps ? formData.addDeps?.existingDeps : []),
      ...(formData.addDeps?.dependents ? formData.addDeps?.dependents : []),
    ].map((item, index) => ({
      applicationId: request.applicationId,
      appSubmittedDate: request.applSubmittedDate,
      countyName: formData.addDeps?.county,
      dateofBirth: item.dob,
      dependentSeqNum: index.toString(),
      firstName: item.firstName,
      gender: item.gender,
      subscriberId: loggedInUserInfo.subscriberID,
      tobaccoUsageInd: item.tobaccoUse,
      zipcode: formData.addDeps?.zip,
      userId: session?.user.id,
      relationShipTypeDesc: item.relationship,
    })),
  };

  apiRequest = convertDatesOfObject(apiRequest);

  console.log('Benefit Change Request', apiRequest);

  const attested = (apiRequest.applStatusCode = APP_STATUS_SUBMITTED);
  apiRequest.action = attested ? 'Submit' : 'Save';
  try {
    const response = apiRequest.applicationId
      ? await benefitChangeService.put(RESOURCE_API + UPDATE_APP, apiRequest, {
          headers: {
            [USER_HEADER]: apiRequest.userId,
          },
        })
      : await benefitChangeService.post(RESOURCE_API + SAVE_APP, apiRequest, {
          headers: {
            [USER_HEADER]: apiRequest.userId,
          },
        });

    const resp: BenefitChangeResponse = response.data;

    console.log('Save Application Resp', resp);

    if (resp.serviceError) {
      console.error(`Save Application Call failed: ${resp.serviceError}`);
      throw new Error(
        `Save Application Failed: ${resp.serviceError.id} - ${resp.serviceError.description}`,
      );
    }

    return resp;
  } catch (error) {
    console.error('Save Application Resp Error', error);
    console.error(`Save Application Call failed: ${error}`);
  }
}
