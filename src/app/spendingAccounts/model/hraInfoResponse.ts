export interface HRAInfoResponse {
  hraAccumulatorSuffix: string;
  planYear: string;
  effectiveDate: string;
  terminationDate: string;
  familyDeductible: number;
  familyDeductibleAccumulator: number;
  allocationAmount: number;
  priorYearCarryoverAmount: number;
  hraPaidAmount: number;
  hraBalanceAvailable: number;
  carryoverCalcIndicator: string;
  carryoverCalculationIndDesc: string;
  carryoverPercent: number;
  memberAllocationInd: string;
  carryoverLimit: number;
  memberDeductible: number;
  memberAllocation: number;
  memberCarryoverLimit: number;
  currentPeriodPaidAmount: number;
  currentPeriodDebitAmount: number;
  priorYearCarryoverInd: string;
  hraClaimSubmissionInd: string;
  hraClaimSubmissionIndDesc: string;
  vbbHRACredit: number;
}
