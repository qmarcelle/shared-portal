'use client';

import { Column } from '@/components/foundation/Column';
import { PharmacyDrugInformation } from './components/PharmacyDrugInformation';

const pharmacyClaims = () => {
  return (
    <main className="flex flex-col justify-center items-center page">
      <Column className="app-content app-base-font-color">
        <section className="flex flex-row items-start app-body">
          <Column className="flex-grow page-section-63_33 items-stretch">
            <PharmacyDrugInformation
              drugInformation={[
                {
                  name: 'Trulipsum',
                  daysSupply: 30,
                  quantity: 30,
                  strengthMG: 25,
                  form: 'Capsule',
                },
              ]}
            />
          </Column>
          <Column className=" flex-grow page-section-36_67 items-stretch">
            <></>
          </Column>
        </section>
      </Column>
    </main>
  );
};

export default pharmacyClaims;
