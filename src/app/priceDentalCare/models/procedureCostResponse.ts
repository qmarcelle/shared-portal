export interface CostEstimate {
  customaryCost: string;
  networkMinAllowance: string;
  networkMaxAllowance: string;
}

export interface ProcedureCostResponse {
  costEstimate?: CostEstimate;
}
