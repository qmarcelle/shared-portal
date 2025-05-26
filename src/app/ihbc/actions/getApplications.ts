'use server';
import { auth } from '@/auth';
import {
  APP_STATUS_SUBMITTED,
  APPLICATIONS,
  benefitChangeService,
  RESOURCE_API,
  USER_HEADER,
} from '@/utils/api/benefitChangeService';
import { logger } from '@/utils/logger';
import { applicationListMock } from '../mock/applicationList';
import { OpenAppInfoBean } from '../models/OpenAppInfoBean';
import { Applications } from '../models/service_responses/Applications';
import { convertDateToString } from '../utils/DateUtils';

export const getApplicationListForSubscriber = async (): Promise<
  OpenAppInfoBean[]
> => {
  try {
    const session = await auth();
    const userId = session!.user.id;
    const subscriberId = session!.user.currUsr.plan?.subId;
    const response = await benefitChangeService.post(
      RESOURCE_API + APPLICATIONS,
      subscriberId,
      {
        headers: {
          [USER_HEADER]: userId,
        },
      },
    );
    if (response.data.serviceError) {
      throw new Error(
        `Get Applications Call failed: ${response.data.serviceError}`,
      );
    }
    const applications = response.data as Applications;
    let appInfoList: OpenAppInfoBean[] = [];
    if (
      applications.applicationList &&
      applications.applicationList.length > 0
    ) {
      appInfoList = new Array(applications.applicationList.length);
      console.info(
        `getApplications() -> list size = ${applications.applicationList.length}`,
      );
      applications.applicationList.forEach(async (application, index) => {
        let url = '';
        if (
          application.applStatusCode.toLowerCase() ===
          APP_STATUS_SUBMITTED.toLowerCase()
        )
          //TODO: Implement the processUrl to get pdf url for application
          url = '';
        const appInfo: OpenAppInfoBean = {
          applicationID: application.applicationId,
          status: application.applStatusCode,
          PDFUrl: url,
          submittedDate: convertDateToString(
            new Date(application.applSubmittedDate),
          ),
        };
        appInfoList[index] = appInfo;
      });
    }
    return appInfoList;
  } catch (err) {
    logger.error('GetApplication list api failed', err);
    return applicationListMock.map((application) => ({
      applicationID: application.applicationId,
      status: application.applStatusCode,
      PDFUrl: '',
      submittedDate: convertDateToString(
        new Date(application.applSubmittedDate),
      ),
    }));
  }
};
