'use client';
import { BenefitTypeDetails } from '../components/BenefitTypeDetails';
import { BenefitType } from '../models/benefit_type';
import { BenefitTypeMap } from '../models/benefit_type_map';

const OfficeVisits = () => {
  return (
    <main className="flex flex-col justify-center items-center page">
      <BenefitTypeDetails
        benefitTypeDetails={BenefitTypeMap.get(BenefitType.OfficeVisits)}
      />
    </main>
  );
};

export default OfficeVisits;
