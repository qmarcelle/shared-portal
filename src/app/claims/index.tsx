'use client';

import { Column } from '@/components/foundation/Column';
import { Header } from '@/components/foundation/Header';
import { Spacer } from '@/components/foundation/Spacer';
import { TextBox } from '@/components/foundation/TextBox';
import { ClaimFormsCard } from './components/claimForms';
import { UnderstandingClaimsReimbursementCard } from './components/understandingClaimsReimbursementCard';

const SubmitClaim = () => {
  return (
    <div className="flex flex-col justify-center items-center page">
      <Column className="app-content app-base-font-color">
        <Header className="font-bold" text="Submit a Claim" />
        <Spacer size={16} />
        <TextBox
          text="Fill out the appropriate form to ask us to reimburse or pay your claim."
          ariaLabel="You can update the Social Security Number (SSN) we have on file here."
        ></TextBox>
        <Spacer size={32} />
        <section className="flex flex-row items-start app-body">
          <Column className="flex-grow  page-section-63_33 items-stretch">
            <ClaimFormsCard
              claimFormsDetails={[
                {
                  title: 'Medical Claim Form',
                  description:
                    'If you paid out of pocket for a medical provider who isn’t in your network, you may be able to get some of your money back.',
                  url: process.env.NEXT_PUBLIC_MEDICAL_CLAIM_FORM ?? '',
                },
                {
                  title: 'Prescription Claim Form',
                  description:
                    'Use this form if you paid out of pocket for a prescription drug.',
                  url: process.env.NEXT_PUBLIC_PRESCRIPTION_CLAIM_FORM ?? '',
                },
                {
                  title: 'Dental Claim Form',
                  description:
                    'Use this form if you paid out of pocket for care from a dental provider who isn’t in your network.',
                  url: process.env.NEXT_PUBLIC_DENTAL_CLAIM_FORM ?? '',
                },
                {
                  title: 'Vision Claim Form',
                  description:
                    'Use this form if you paid out of pocket for care from a vision provider who isn’t in your network.',

                  url: process.env.NEXT_PUBLIC_VISION_CLAIM_FORM ?? '',
                },
                {
                  title: 'Breast Pump Claim Form',
                  description:
                    'If you paid out of pocket for a breast pump, you may be able to get some of your money back.',
                  url: process.env.NEXT_PUBLIC_BREAST_PUMP_CLAIM_FORM ?? '',
                },
              ]}
            />
          </Column>
          <Column className="flex-grow page-section-36_67 items-stretch">
            <UnderstandingClaimsReimbursementCard />
          </Column>
        </section>
      </Column>
    </div>
  );
};

export default SubmitClaim;
