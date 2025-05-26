'use server';
import { auth } from '@/auth';
import { MedicalPlanDetail } from '../models/service_responses/MedicalPlanDetail';
import { PlansRequest } from '../models/service_responses/PlansRequest';
import { convertFloatToString } from '../utils/PrimitiveUtils';
import { getDentalVisionPlans } from './getDentalVisionPlans';

export async function getDentalVisionPlanList(
  plansRequest: PlansRequest,
): Promise<{
  dentalPlanList: MedicalPlanDetail[];
  visionPlanList: MedicalPlanDetail[];
}> {
  console.log('Starting Dental & Vision plans list retrieving...');

  const session = await auth();
  const userID = session!.user.id;

  console.log(`getDentalVisionPlanList ${JSON.stringify(plansRequest)}`);

  try {
    const products = await getDentalVisionPlans(plansRequest, userID);

    console.log(`getDentalVisionPlanList Response ${JSON.stringify(products)}`);

    const dentalPlanList: MedicalPlanDetail[] = [];
    const visionPlanList: MedicalPlanDetail[] = [];

    if (!products || products.length === 0) {
      return { dentalPlanList, visionPlanList };
    }

    for (const product of products) {
      if (
        product.productType?.toLowerCase() === 'd' ||
        product.productType?.toLowerCase() === 'v'
      ) {
        const medicalPlan: MedicalPlanDetail = {
          deductible: product.deductible,
          metalLevel: product.metalLevel,
          network: product.network,
          offVisitCopay: product.officevisitcopay,
          oopMax: product.oopmax,
          planName: product.planName,
          planId: product.planId,
          prescriptionDrugs: product.prescriptioncoverage,
          rate: convertFloatToString(product.totalrate),
          specialistCopay: product.specialistcopay,
          SBCLocation: product.sbcEnglishLoc,
        };

        if (product.productType?.toUpperCase() === 'D') {
          console.log(`Dental Plan: ${product.planId}`);
          dentalPlanList.push(medicalPlan);
        } else {
          console.log(`Vision Plan: ${product.planId}`);
          visionPlanList.push(medicalPlan);
        }
      }
    }

    console.log(`Dental Plan Size: ${dentalPlanList.length}`);
    console.log(`Vision Plan Size: ${visionPlanList.length}`);

    return { dentalPlanList, visionPlanList };
  } catch (error) {
    console.error('Error in getDentalVisionPlanList', error);
    throw error;
  }
}
