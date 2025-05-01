/**
 * pharmacy/pharmacyClaims
 * Pharmacy claims
 */
export const metadata = {
  title: 'Pharmacy claims | Consumer Portal',
  description: 'Pharmacy claims'
};

'use client';

import { Column } from '@/components/foundation/Column';
import { PharmacyDrugInformation } from './components/PharmacyDrugInformation';

const pharmacyClaims = () => {
  return (
    <main className="flex flex-col justify-center items-center page">
      <Column className="app-content app-base-font-color">
        <section className="flex-row items-start app-body" id="Filter">
          <Column className="flex-grow page-section-63_33 items-stretch mt-4">
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
        </section>

        <Column className=" flex-grow page-section-36_67 items-stretch">
          <></>
        </Column>
      </Column>
    </main>
  );
};

export default pharmacyClaims;
