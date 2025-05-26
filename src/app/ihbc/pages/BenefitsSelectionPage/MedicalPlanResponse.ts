import { Product } from '../../models/Product';
import { MedicalPlanDetail } from '../../models/service_responses/MedicalPlanDetail';

export async function getMedicalPlanResponse(products: Product[]) {
  const medicalPlan: MedicalPlanDetail[] = products.map((val) => ({
    planId: val.planId,
    region: val.region,
    planName: val.planName!,
    rate: '$' + val.totalrate.toString(),
    oopMax: val.oopmax!,
    offVisitCopay: val.officevisitcopay!,
    specialistCopay: val.specialistcopay!,
    prescriptionDrugs: val.prescriptioncoverage!,
    SBCLocation: val.sbcEnglishLoc,
    effDate: val.effectiveDate!,
    termDate: val.termDate!,
    metalLevel: val.metalLevel,
    network: val.network,
    deductible: val.deductible,
    noLongerAvailable: false,
    prescriptioncoverage: val.prescriptioncoverage!,
  }));

  return medicalPlan;
}

export async function getSelectedPlan(
  plans: string[],
  products: MedicalPlanDetail[],
) {
  const selectedPlandetails =
    products && products.filter((val) => plans.includes(val.planId));
  // const selectedPlan: MedicalPlanDetail[] = selectedPlandetails.map((val) => ({
  //   planId: val.planId,
  //   region: val.region,
  //   planName: val.planName,
  //   rate: val.totalrate?.toString(),
  //   oopMax: val.oopmax,
  //   offVisitCopay: val.officevisitcopay,
  //   specialistCopay: val.specialistcopay,
  //   prescriptionDrugs: val.prescriptioncoverage,
  //   SBCLocation: val.sbcEnglishLoc,
  //   effDate: val.effectiveDate,
  //   termDate: val.termDate,
  //   metalLevel: val.metalLevel,
  //   network: val.network,
  //   deductible: val.deductible,
  //   noLongerAvailable: false,
  // }));

  return selectedPlandetails;
}
