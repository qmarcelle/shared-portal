'use client';

import { ServicesRenderedSection } from '@/app/claimServiceRendered/components/ServicesRenderedSection';
import { Column } from '@/components/foundation/Column';
import { Spacer } from '@/components/foundation/Spacer';
import { PayProvider } from './components/PayProvider';

const ClaimServiceRendered = () => {
  return (
    <main className="flex flex-col justify-center items-center page">
      <Spacer size={32}></Spacer>
      <Column className="app-content app-base-font-color">
        <section className="flex flex-row items-start app-body">
          <Column className="flex-grow page-section-63_33 items-stretch">
            <ServicesRenderedSection
              serviceTitle="Immunization"
              className="large-section"
              service={[
                {
                  serviceLabel: 'Office Visit',
                  serviceSubLabel: 'Your share',
                  serviceSubLabelValue: 30.24,
                  serviceCode: '345678',
                  labelText1: 'Amount Billed',
                  labelValue1: 145.0,
                  labelText2: 'Plan Discount',
                  labelValue2: 114.76,
                  labelText3: 'Plan Paid',
                  labelValue3: 0.0,
                },
                {
                  serviceLabel: 'Lab Work',
                  serviceSubLabel: 'Your share',
                  serviceSubLabelValue: 30.24,
                  serviceCode: '345678',
                  labelText1: 'Amount Billed',
                  labelValue1: 145.0,
                  labelText2: 'Plan Discount',
                  labelValue2: 114.76,
                  labelText3: 'Plan Paid',
                  labelValue3: 0.0,
                },
                {
                  serviceLabel: 'Immunization',
                  serviceSubLabel: 'Your share',
                  serviceSubLabelValue: 30.24,
                  serviceCode: '345678',
                  labelText1: 'Amount Billed',
                  labelValue1: 145.0,
                  labelText2: 'Plan Discount',
                  labelValue2: 114.76,
                  labelText3: 'Plan Paid',
                  labelValue3: 0.0,
                },
                {
                  serviceLabel: 'Medical Service',
                  serviceSubLabel: 'Your share',
                  serviceSubLabelValue: 30.24,
                  serviceCode: '345678',
                  labelText1: 'Amount Billed',
                  labelValue1: 145.0,
                  labelText2: 'Plan Discount',
                  labelValue2: 114.76,
                  labelText3: 'Plan Paid',
                  labelValue3: 0.0,
                },
              ]}
            />
          </Column>
          <Column className=" flex-grow page-section-36_67 items-stretch">
            <PayProvider className="large-section" balanceAmount={30.24} />
          </Column>
        </section>
      </Column>
    </main>
  );
};

export default ClaimServiceRendered;
