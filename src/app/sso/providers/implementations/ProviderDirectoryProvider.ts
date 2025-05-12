'use server';

import {
  BenefitResponse,
  getBenefitFlags,
  getFacilityNetworkName,
} from '@/actions/getBenefitFlags';
import { getPCPInfo } from '@/app/findcare/primaryCareOptions/actions/pcpInfo';
import { LoggedInMember } from '@/models/app/loggedin_member';
import { formatDateString } from '@/utils/date_formatter';
import {
  getPlanId,
  getSubscriberSuffix,
  isEligible,
} from '@/utils/member_utils';
import { formatZip } from '@/utils/zipcode_formatter';
import { ProviderDirectoryParameters } from '../../models/types';
import {
  TELEHEALTH_CD,
  TELEHEALTH_PROD_TYPE,
  TELEHEALTH_URL,
  TELEHEALTH_VENDCD,
} from '../../ssoConstants';
import { BaseProvider } from '../BaseProvider';

/**
 * SSO provider implementation for Provider Directory
 */
export default class ProviderDirectoryProvider extends BaseProvider {
  constructor() {
    super(
      process.env.NEXT_PUBLIC_IDP_PROVIDER_DIRECTORY || 'provider-directory',
      'Find a Doctor',
    );
  }

  /**
   * Generate the parameters needed for Provider Directory SSO
   */
  async generateParameters(
    member: LoggedInMember,
    searchParams?: Record<string, string>,
  ): Promise<ProviderDirectoryParameters> {
    return this.withErrorHandling(async () => {
      if (!member) {
        throw new Error('Member not found');
      }

      const pcpID = await getPCPInfo();
      const { network, copay, deductible } =
        await this.getCopayDeductible(member);
      const subscriberId = getSubscriberSuffix(
        member.subscriberId,
        member.suffix,
      );

      // Handle redirect logic
      const redirectLink = searchParams?.redirectLink
        ? decodeURIComponent(searchParams.redirectLink)
        : '';
      const pcpSearch =
        searchParams?.isPCPSearchRedirect?.toLocaleLowerCase() === 'true';

      let target = process.env.PROVIDER_DIRECTORY_VITALS_SSO_TARGET || '';
      if (redirectLink) {
        target += decodeURI(redirectLink);
      } else if (pcpSearch) {
        target = process.env.PROVIDER_DIRECTORY_PCP_SSO_TARGET || '';
      }

      const params: ProviderDirectoryParameters = {
        subscriberId: subscriberId,
        firstName: member.firstName.toLocaleUpperCase().trim(),
        lastName: member.lastName.toLocaleUpperCase().trim(),
        prefix: member.networkPrefix,
        network: network,
        planId: getPlanId(member),
        groupNumber: member.groupId,
        zipCode: formatZip(member.contact.zipcode),
        copay: copay,
        deductible: deductible,
        sanitas: isEligible(member, 'SANITAS_ELIGIBLE') ? 'Y' : 'N',
        pcpPhysicianId: pcpID.physicianId,
        dateOfBirth: formatDateString(
          member.dateOfBirth,
          'MM/dd/yyyy',
          'yyyy-MM-dd',
        ),
        memberId: subscriberId,
        telehealth: this.addTeladocHealthParams(member),
        targetResource: target,
        subject: subscriberId,
      };

      return params;
    }, 'Error generating Provider Directory SSO parameters');
  }

  /**
   * Helper method to build telehealth parameters
   */
  private addTeladocHealthParams(member: LoggedInMember): string {
    let teladoc = '';
    const teladocArray: Map<string, string>[] = [];
    let isMDLiveEligible = false;

    if (isEligible(member, 'RX_ESSENTIAL_PLUS_ELIGIBLE')) {
      teladocArray.push(
        this.getTeladocParams(
          'Y',
          'AMPH',
          'M',
          process.env.TELEHEALTH_URL_AMPH || '',
        ),
      );

      if (isEligible(member, 'MedicalWellnesswithIncentives')) {
        isMDLiveEligible = true;
      }

      if (isEligible(member, 'HINGE_HEALTH_ELIGIBLE')) {
        teladocArray.push(
          this.getTeladocParams(
            'Y',
            'AMHG',
            'MB',
            process.env.TELEHEALTH_URL_AMHG || '',
          ),
        );
      }

      if (isEligible(member, 'LIVONGODMP')) {
        teladocArray.push(
          this.getTeladocParams(
            'Y',
            'AMLV',
            'MB',
            process.env.TELEHEALTH_URL_AMLV || '',
          ),
        );
      }

      if (isEligible(member, 'FIHEALTHYMATERNITY')) {
        teladocArray.push(
          this.getTeladocParams(
            'Y',
            'AMHM',
            'MB',
            process.env.TELEHEALTH_URL_AMHM || '',
          ),
        );
      }

      if (isEligible(member, 'MENTAL_HEALTH_SUPPORT')) {
        teladocArray.push(
          this.getTeladocParams(
            'Y',
            'AMBH',
            'MB',
            process.env.TELEHEALTH_URL_AMBH || '',
          ),
        );
      }
    }

    if (isEligible(member, 'TELADOC') || isMDLiveEligible) {
      teladocArray.push(
        this.getTeladocParams(
          'Y',
          'TDUC',
          'MB',
          process.env.TELEHEALTH_URL_TDUC || '',
        ),
      );
    }

    if (teladocArray.length > 0) {
      teladoc = JSON.stringify(teladocArray);
    }

    return teladoc;
  }

  /**
   * Helper method to build a teladoc parameter map
   */
  private getTeladocParams(
    teleHealthCd: string,
    teleHealthVendCd: string,
    teleHealthProdType: string,
    teleHealthUrl: string,
  ): Map<string, string> {
    const teladocParam = new Map<string, string>();
    teladocParam.set(TELEHEALTH_CD, teleHealthCd);
    teladocParam.set(TELEHEALTH_VENDCD, teleHealthVendCd);
    teladocParam.set(TELEHEALTH_PROD_TYPE, teleHealthProdType);
    teladocParam.set(TELEHEALTH_URL, teleHealthUrl);
    return teladocParam;
  }

  /**
   * Helper method to get copay and deductible information
   */
  private async getCopayDeductible(member: LoggedInMember): Promise<{
    network: string;
    copay: string;
    deductible: string;
  }> {
    let copay = '';
    let deductible = '';

    const benefitResponse: BenefitResponse = await getBenefitFlags(member);
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
  }

  supportsDropOff(): boolean {
    return true;
  }
}
