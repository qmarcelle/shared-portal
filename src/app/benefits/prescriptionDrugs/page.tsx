'use client';
import { BenefitTypeDetails } from '../components/BenefitTypeDetails';
import { BenefitType } from '../models/benefit_type';
import { BenefitTypeMap } from '../models/benefit_type_map';

const PrescriptionDrugs = () => {
  return (
    <main className="flex flex-col justify-center items-center page">
      <BenefitTypeDetails
        benefitTypeDetails={BenefitTypeMap.get(BenefitType.PrescriptionDrugs)}
      />
    </main>
  );
};

export default PrescriptionDrugs;
