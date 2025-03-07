'use server';

import {
  BenefitResponse,
  getBenefitFlags,
  getFacilityNetworkName,
} from '@/actions/getBenefitFlags';
import { getPCPInfo } from '@/app/findcare/primaryCareOptions/actions/pcpInfo';
import { LoggedInMember } from '@/models/app/loggedin_member';
import { formatDateString } from '@/utils/date_formatter';
import { logger } from '@/utils/logger';
import {
  getPlanId,
  getSubscriberSuffix,
  isEligible,
} from '@/utils/member_utils';
import { formatZip } from '@/utils/zipcode_formatter';
import {
  SSO_COPAY,
  SSO_DED,
  SSO_DOB,
  SSO_FIRST_NAME,
  SSO_GROUP_NUMBER,
  SSO_LAST_NAME,
  SSO_MEMBER_ID,
  SSO_NETWORK,
  SSO_PCP_PHYSICIAN_ID,
  SSO_PLAN_ID,
  SSO_PREFIX,
  SSO_SANITAS,
  SSO_SUBJECT,
  SSO_SUBSCRIBER_ID,
  SSO_TARGET_RESOURCE,
  SSO_TELEHEALTH,
  SSO_ZIP_CODE,
  TELEHEALTH_CD,
  TELEHEALTH_PROD_TYPE,
  TELEHEALTH_URL,
  TELEHEALTH_VENDCD,
} from '../ssoConstants';

export default async function generateProviderDirectorySSOMap(
  memberData: LoggedInMember,
  searchParams?: { [k: string]: string },
): Promise<Map<string, string>> {
  try {
    console.log('generateProviderDirectorySSOMap entered !!!');
    const ssoParamMap = new Map<string, string>();

    if (memberData == null || memberData == undefined) {
      throw new Error('Member not found');
    }

    const pcpID = await getPCPInfo();
    const { network, copay, deductible } = await getCopayDeductible(memberData);
    const subscriberId = getSubscriberSuffix(
      memberData.subscriberId,
      memberData.suffix,
    );

    //Need to get from RequestParam
    const redirectLink = decodeURIComponent(searchParams?.redirectLink ?? '');
    const pcpSearch =
      searchParams?.isPCPSearchRedirect?.toLocaleLowerCase() == 'true'
        ? true
        : false;
    let target = process.env.PROVIDER_DIRECTORY_VITALS_SSO_TARGET ?? '';
    if (redirectLink) {
      target += decodeURI(redirectLink);
    } else if (pcpSearch) {
      target = process.env.PROVIDER_DIRECTORY_PCP_SSO_TARGET ?? '';
    }

    ssoParamMap.set(SSO_SUBSCRIBER_ID, subscriberId);
    ssoParamMap.set(
      SSO_FIRST_NAME,
      memberData.firstName.toLocaleUpperCase().trim(),
    );
    ssoParamMap.set(
      SSO_LAST_NAME,
      memberData.lastName.toLocaleUpperCase().trim(),
    );
    ssoParamMap.set(SSO_PREFIX, memberData.networkPrefix);
    ssoParamMap.set(SSO_NETWORK, network);
    ssoParamMap.set(SSO_PLAN_ID, getPlanId(memberData));
    ssoParamMap.set(SSO_GROUP_NUMBER, memberData.groupId);
    ssoParamMap.set(SSO_ZIP_CODE, formatZip(memberData.contact.zipcode));
    ssoParamMap.set(SSO_COPAY, copay);
    ssoParamMap.set(SSO_DED, deductible);
    ssoParamMap.set(
      SSO_SANITAS,
      isEligible(memberData, 'SANITAS_ELIGIBLE') ? 'Y' : 'N',
    );

    ssoParamMap.set(SSO_PCP_PHYSICIAN_ID, pcpID.physicianId);

    ssoParamMap.set(
      SSO_DOB,
      formatDateString(memberData.dateOfBirth, 'MM/dd/yyyy', 'yyyy-MM-dd'),
    );
    ssoParamMap.set(SSO_MEMBER_ID, subscriberId);

    ssoParamMap.set(SSO_TELEHEALTH, addTeladocHealthParams(memberData));

    ssoParamMap.set(SSO_TARGET_RESOURCE, target);
    ssoParamMap.set(SSO_SUBJECT, subscriberId);

    console.log('generateProviderDirectorySSOMap exited !!!');
    return ssoParamMap;
  } catch (error) {
    logger.error('Error Response from Provider Directory IMpl', error);
    throw error;
  }
}

const addTeladocHealthParams = (memberData: LoggedInMember): string => {
  let teladoc = '';
  const teladocArray: Map<string, string>[] = [];
  let isMDLiveEligible = false;
  if (isEligible(memberData, 'RX_ESSENTIAL_PLUS_ELIGIBLE')) {
    teladocArray.push(
      getTeladocParams('Y', 'AMPH', 'M', process.env.TELEHEALTH_URL_AMPH ?? ''),
    );
    if (isEligible(memberData, 'MedicalWellnesswithIncentives')) {
      isMDLiveEligible = true;
    }
    if (isEligible(memberData, 'HINGE_HEALTH_ELIGIBLE')) {
      teladocArray.push(
        getTeladocParams(
          'Y',
          'AMHG',
          'MB',
          process.env.TELEHEALTH_URL_AMHG ?? '',
        ),
      );
    }
    if (isEligible(memberData, 'LIVONGODMP')) {
      teladocArray.push(
        getTeladocParams(
          'Y',
          'AMLV',
          'MB',
          process.env.TELEHEALTH_URL_AMLV ?? '',
        ),
      );
    }
    if (isEligible(memberData, 'FIHEALTHYMATERNITY')) {
      teladocArray.push(
        getTeladocParams(
          'Y',
          'AMHM',
          'MB',
          process.env.TELEHEALTH_URL_AMHM ?? '',
        ),
      );
    }
    if (isEligible(memberData, 'MENTAL_HEALTH_SUPPORT')) {
      teladocArray.push(
        getTeladocParams(
          'Y',
          'AMBH',
          'MB',
          process.env.TELEHEALTH_URL_AMBH ?? '',
        ),
      );
    }
  }
  if (isEligible(memberData, 'TELADOC') || isMDLiveEligible) {
    teladocArray.push(
      getTeladocParams(
        'Y',
        'TDUC',
        'MB',
        process.env.TELEHEALTH_URL_TDUC ?? '',
      ),
    );
  }
  if (teladocArray.length > 0) {
    teladoc = JSON.stringify(teladocArray);
  }
  return teladoc;
};

const getTeladocParams = (
  teleHealthCd: string,
  teleHealthVendCd: string,
  teleHealthProdType: string,
  teleHealthUrl: string,
): Map<string, string> => {
  const teladocParam = new Map<string, string>();
  teladocParam.set(TELEHEALTH_CD, teleHealthCd);
  teladocParam.set(TELEHEALTH_VENDCD, teleHealthVendCd);
  teladocParam.set(TELEHEALTH_PROD_TYPE, teleHealthProdType);
  teladocParam.set(TELEHEALTH_URL, teleHealthUrl);
  return teladocParam;
};

const getCopayDeductible = async (
  memberData: LoggedInMember,
): Promise<{
  network: string;
  copay: string;
  deductible: string;
}> => {
  let copay = '';
  let deductible = '';

  const benefitResponse: BenefitResponse = await getBenefitFlags(memberData);
  const network = await getFacilityNetworkName(benefitResponse);

  if (benefitResponse.listOfFlag && benefitResponse.listOfFlag.length > 0) {
    benefitResponse.listOfFlag.forEach((flag) => {
      if (
        flag &&
        flag.flagName?.toLocaleUpperCase() === 'VITALS_COPAY_EX_IND'
      ) {
        copay = flag.flagValue;
      } else if (
        flag &&
        flag.flagName?.toLocaleUpperCase() === 'VITALS_DEDUCT_EX_IND'
      ) {
        deductible = flag.flagValue;
      }
    });
  }
  return { network, copay, deductible };
};
