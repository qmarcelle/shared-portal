'use server';

import { auth } from '@/auth';
import { ActionResponse } from '@/models/app/actionResponse';
import { LoggedInMember } from '@/models/app/loggedin_member';

import { getLoggedInMember } from '@/actions/memberDetails';
import { memberService } from '@/utils/api/memberService';
import {
  formatDate,
  formatDateToJavaStandard,
  getNextYearJanuaryFirstJavaStandard,
} from '@/utils/date_formatter';
import { logger } from '@/utils/logger';
import { AxiosError } from 'axios';
import { Session } from 'next-auth';
import {
  HipaaFindResponse,
  HipaaUserConsentRequest,
  HipaaUserConsentResponse,
} from '../models/hippaConsent';
import { SendEmailRequest } from '../models/sendEmail';
import { sendEmail } from './sendEmail';

const application = 'MedicarePrescriptionPaymentPlan';
export async function hipaaFindConsent(): Promise<
  ActionResponse<number, HipaaFindResponse>
> {
  try {
    const session = await auth();
    const memberCk: string = session?.user.currUsr?.plan?.memCk ?? '';
    const response = await memberService.get<HipaaFindResponse>(
      `/api/member/v1/members/byMemberCk/${memberCk}/hipaaConsent/${application}`,
    );
    logger.info('HIPAA Find Consent Data', response?.data);
    return { status: 200, data: response.data };
  } catch (error) {
    logger.error('Error Response from HIPAA Find Consent API', error);
    if (
      error instanceof AxiosError &&
      error.response?.data?.errorCode == 'FIND_HIPAA-404'
    ) {
      return {
        status: 200,
        error: {
          errorCode: error.response?.data?.errorCode,
        },
      };
    } else {
      return { status: 400 };
    }
  }
}

export async function hipaaUpdateConsent(
  isUpdate: boolean = false,
): Promise<ActionResponse<number, HipaaUserConsentResponse>> {
  try {
    let response;
    const session = await auth();
    const memberCk: string = session?.user.currUsr?.plan?.memCk ?? '';
    const request: HipaaUserConsentRequest = {
      memberCk,
      application: application,
      consent: true,
      effDate: formatDateToJavaStandard(new Date()),
      termDate: getNextYearJanuaryFirstJavaStandard(),
    };

    if (!isUpdate) {
      response = await memberService.post<HipaaUserConsentResponse>(
        `/api/member/v1/members/byMemberCk/${memberCk}/hipaaConsent`,
        request,
      );
    } else {
      response = await memberService.put<HipaaUserConsentResponse>(
        `/api/member/v1/members/byMemberCk/${memberCk}/hipaaConsent`,
        request,
      );
    }

    logger.info('HIPAA Update/Insert Consent Data', response?.data);
    sendHipaaEmail(session ?? undefined);
    return { status: 200, data: response.data };
  } catch (error) {
    logger.error('Error Response from HIPAA Update/Insert Consent API', error);
    return { status: 400 };
  }
}

export async function sendHipaaEmail(sessionData?: Session): Promise<void> {
  try {
    const session = sessionData ?? (await auth());
    const loggedInMember = await getLoggedInMember(session);
    const request: SendEmailRequest = {
      portal: 'Member',
      appName: application,
      subject: 'M3P Authorization: Agreement',
      recipients: 'M3P_TermsandConditions@bcbst.com',
      bodyText: getHipaaEmailBody(loggedInMember),
    };
    const response = await sendEmail(request);
    logger.info('Send Hipaa Email Data', response);
  } catch (error) {
    logger.error('Error Response from Send Hipaa Email API', error);
  }
}

const getHipaaEmailBody = (loggedInMember: LoggedInMember): string => {
  return `
    <p>
      I understand that BlueCross BlueShield of Tennessee, Inc., and its affiliates, will disclose to WIPRO, LLC any and all necessary information about me so that WIPRO, LLC can administer my participation in the Medicare Prescription Payment Plan program, including, but not limited to, my name, Medicare Beneficiary Identifier, mailing address, and status as a member of my Health Plan offered or administered by BlueCross BlueShield of Tennessee, Inc., or any of its affiliates.
    </p>

    <p>
      I authorize BlueCross BlueShield of Tennessee, Inc., or any of its affiliates, to redirect me to the WIPRO, LLC website, an external beneficiary portal, in order for me to apply for, request, opt-in or opt-out of, or otherwise access participation into the Medicare Prescription Payment Plan program. I further certify that if I am accepted to the Medicare Prescription Payment Program, I have the capability to and shall pay my monthly bills. If I do not pay my monthly bills for the Medicare Prescription Payment Program, I agree to any and all consequences thereof, including without limitation disenrollment and payment of any amounts due and owing to BlueCross BlueShield of Tennessee, Inc. or any of its affiliates. I authorize BlueCross BlueShield of Tennessee, Inc., any of its affiliates or WIPRO, LLC to send email, text, and other forms of communication. Unencrypted email or text messages may possibly be intercepted and read by people other than those it's addressed to. Message and data rates may apply. I further agree that my participation in the Medicare Prescription Payment Program is subject to all terms, conditions, and requirements outlined in the applicable Terms and Conditions, my Evidence of Coverage, and applicable law, regulation, or regulatory guidance.
    </p>

    <p>
      I read, considered, understand and agree to the contents above. I understand that, by clicking on the 'I AGREE' button, below, I am confirming my authorization for the use, disclosure of information about me and redirection to WIPRO, LLC, as described herein.
    </p>

    <p>
      I have read and agree to the Medicare Prescription Payment Plan Terms and Conditions.
    </p>

    <br />

    <p><strong>Member First Name:</strong> ${loggedInMember.firstName}</p>
    <p><strong>Member Last Name:</strong> ${loggedInMember.lastName}</p>
    <p><strong>Subscriber ID:</strong> ${loggedInMember.subscriberId}</p>
    <p><strong>Timestamp of signed Terms and Condition:</strong> ${formatDate('MM-dd-yyyy HH:mm:ss')}</p>
  `;
};
