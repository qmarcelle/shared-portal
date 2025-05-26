import { PlanBean } from './PlanBean';

export interface Product extends PlanBean {
  planId: string;
  region?: string;
  effectiveDate?: number;
  termDate?: number;
  groupId: string;
  planName: string;
  officevisitcopay?: string;
  specialistcopay?: string;
  oopmax?: string;
  prescriptioncoverage?: string;
  totalrate: number;
  sbcEnglishLoc: string;
  productType?: string;
  ratingArea: number;
  sbcPlanId?: string;
}
