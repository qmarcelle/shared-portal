'use client';

import { Column } from '@/components/foundation/Column';
import PharmacyBenefits from './components/PharmacyBenefits';

const Pharmacy = () => {
  return (
    <main className="flex flex-col justify-center items-center page">
      <Column className="app-content app-base-font-color">
        <section className="flex flex-row items-start app-body ">
          <Column>
            <PharmacyBenefits />
          </Column>
        </section>
      </Column>
    </main>
  );
};

export default Pharmacy;
