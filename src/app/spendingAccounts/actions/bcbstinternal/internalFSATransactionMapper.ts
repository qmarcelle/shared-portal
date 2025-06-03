import { Claim, ClaimsResponse } from '@/app/claims/models/api/claimsResponse';
import {
  StatusLabelEnum,
  StatusLabelStatus,
} from '@/components/foundation/StatusLabel';
import { ClaimStatus } from '@/models/claim_details';
import { TransactionDetails } from '@/models/transaction_details';
import { formatCurrency } from '@/utils/currency_formatter';
import { formatDateToLocale } from '@/utils/date_formatter';

export const internalFSATransactionMapper = (
  response: ClaimsResponse,
): TransactionDetails[] => {
  return response.claims.map((claim: Claim) => {
    const { status, description } = statusMapper(claim);
    return {
      id: claim.claimId,
      providerName: claim.providerName,
      serviceDate: formatDateToLocale(new Date(claim.claimHighServiceDate)),
      transactionTotal: claim.claimTotalChargeAmt ?? '',
      transactionStatus: status,
      transactionStatusDescription: description,
      transactionId: claim.claimId,
      disallowedAmount: claim.claimNonCoveredAmt ?? '',
      disallowedReason: claim.claimNonCoveredDescShortText,
      disallowedFlag: claim.claimNonCoveredAmt > 0,
      claimPaidAmt: claim.claimPaidAmt,
      formattedClaimPaidAmt: formatCurrency(claim.claimPaidAmt) ?? '',
      formattedDisallowedAmount: formatCurrency(claim.claimNonCoveredAmt) ?? '',
      formattedTransactionTotal: `-${formatCurrency(claim.claimTotalChargeAmt) ?? ''}`,
      isWithdrawal: true,
    };
  });
};

function statusMapper(claim: Claim): {
  status: StatusLabelStatus;
  description: string;
} {
  if (claim.claimNonCoveredAmt > 0) {
    return claim.claimPaidAmt > 0
      ? {
          status: StatusLabelEnum.SUCCESS,
          description: 'Partially Approved',
        }
      : {
          status: StatusLabelEnum.ERROR,
          description: 'Denied',
        };
  }
  if (
    claim.claimStatusDescription === ClaimStatus.COMPLETED ||
    claim.claimStatusDescription === ClaimStatus.PROCESSED
  ) {
    return {
      status: StatusLabelEnum.SUCCESS,
      description: ClaimStatus.PROCESSED,
    };
  }
  if (claim.claimStatusDescription === ClaimStatus.IN_PROCESS) {
    return {
      status: StatusLabelEnum.NEUTRAL,
      description: ClaimStatus.IN_PROCESS,
    };
  }
  return {
    status: StatusLabelEnum.EMPTY,
    description: '',
  };
}
