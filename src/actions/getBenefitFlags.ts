'use server';

import { LoggedInMember } from '@/models/app/loggedin_member';
import { portalSvcsApi } from '@/utils/api/portalApi';
import { logger } from '@/utils/logger';

export interface BenefitResponse {
  networks: BenefitNetwork[];
  listOfFlag: BenefitFlag[];
  serviceError: ServiceError;
}

export interface BenefitNetwork {
  networkType: string;
  networkName: string;
}

export interface BenefitFlag {
  flagName: string;
  flagValue: string;
}

export interface ServiceError {
  desc: string;
  id: string;
}

export async function getBenefitFlags(
  memberData: LoggedInMember,
): Promise<BenefitResponse> {
  try {
    let planId = memberData.mpdpdId;
    let productType = 'M';
    const flagsFor = 'Vitals';
    if (memberData.isMedical) {
      planId = memberData.mpdpdId;
      productType = 'M';
    } else if (memberData.isDental) {
      planId = memberData.dpdpdId;
      productType = 'D';
    } else if (memberData.isVision) {
      planId = memberData.vpdpdId;
      productType = 'V';
    }
    const resp = await portalSvcsApi.get<BenefitResponse>(
      `/memberservice/api/member/v1/members/byMemberCk/${memberData.memeCk}/benefits/flags/${productType}/${planId}/${flagsFor}`,
    );

    return resp.data;
  } catch (error) {
    logger.error('getBenefitFlags API Failed', error);
    throw error;
  }
}

export async function getFacilityNetworkName(
  benefitFlags: BenefitResponse,
): Promise<string> {
  let networkName;
  try {
    if (benefitFlags?.networks?.length) {
      networkName = benefitFlags.networks.find(
        (network) => network.networkType === 'FACILITY',
      )?.networkName;
    }
  } catch (error) {
    logger.error('getFacilityNetworkName Failed', error);
  }
  return networkName ?? '';
}

export async function getRxNetworkName(
  benefitFlags: BenefitResponse,
): Promise<string> {
  let networkName;
  try {
    if (benefitFlags?.networks?.length) {
      networkName = benefitFlags.networks.find(
        (network) =>
          network.networkType === 'PHARMACY' &&
          network.networkName.startsWith('RX'),
      )?.networkName;
    }
  } catch (error) {
    logger.error('getRxNetworkName Failed', error);
  }
  return networkName ?? '';
}
