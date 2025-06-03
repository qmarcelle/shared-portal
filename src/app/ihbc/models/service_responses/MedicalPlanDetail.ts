import { PlanBean } from '../PlanBean';

export interface MedicalPlanDetail extends PlanBean {
  planId: string;
  region?: string;
  planName: string;
  rate?: string;
  oopMax?: string;
  offVisitCopay?: string;
  specialistCopay?: string;
  prescriptionDrugs?: string;
  SBCLocation?: string;
  effDate?: number;
  termDate?: number;
  noLongerAvailable?: boolean;
}
