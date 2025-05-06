'use server';
import { getMemberDetails } from '@/actions/memberDetails';
import { ClaimDetails } from '@/models/claim_details';
import { esApi } from '@/utils/api/esApi';
import { logger } from '@/utils/logger';
import { MemberPriorAuthDetail } from '../models/priorAuthData';

export async function invokeSortData(): Promise<ClaimDetails> {
  try {
    const memberDetails = await getMemberDetails();
    let priorAuthresponse;
    const apiResponse = await esApi.get(
      `/memberPriorAuthDetails?memberKey=${memberDetails.member_ck}&fromDate=12/06/2022&toDate=08/06/2023`, // froDate and toDate is dependant on filter integration
    );
    if (
      apiResponse?.data?.data?.memberPriorAuthDetails?.memberPriorAuthDetail !=
      null
    ) {
      priorAuthresponse =
        apiResponse?.data?.data?.memberPriorAuthDetails?.memberPriorAuthDetail.map(
          (item: MemberPriorAuthDetail) => ({
            issuer: item['serviceGroupDescription'],
            claimStatus: item['statusDescription'],
            serviceDate: item['fromDate'],
            memberName: item['firstName'],
            columns: [
              {
                label: 'Referred by',
                value: item.getProviderReferredBy.name,
                defaultValue: 'N/A',
              },
              {
                label: 'Referred to',
                value: item.getProviderReferredTo.name,
                defaultValue: 'N/A',
              },
            ],
          }),
        );
    }
    return priorAuthresponse;
  } catch (error) {
    logger.error('Error Response from  memberPriorAuthDetails', error);
    throw error;
  }
}
