'use client';
import { Column } from '@/components/foundation/Column';
import { Spacer } from '@/components/foundation/Spacer';
import { Title } from '@/components/foundation/Title';
import Image from 'next/image';
import DentalIcon from '../../../public/assets/dental_benefit.svg';
import OtherBenefit from '../../../public/assets/other-benefit.svg';
import PharmacyIcon from '../../../public/assets/pharmacy_benefit.svg';
import PrimaryCareIcon from '../../../public/assets/primary_care.svg';
import VisionIcon from '../../../public/assets/vision-benefit.svg';

import { externalIcon } from '@/components/foundation/Icons';
import { MedicalPharmacyDentalCard } from './components/MedicalPharmacyDentalCard';

const Benefits = () => {
  return (
    <main className="flex flex-col justify-center items-center page">
      <Column className="app-content app-base-font-color">
        <Spacer size={32} />
        <Title className="title-1" text="Benefits & Coverage" />
        <section className="flex flex-row items-start app-body" id="Filter">
          <Column className=" flex-grow page-section-36_67 items-stretch">
            <></>
          </Column>
          <Column className="flex-grow page-section-63_33 items-stretch">
            <MedicalPharmacyDentalCard
              className="small-section w-[672px] benefitsLink"
              heading="Medical"
              cardIcon={<Image src={PrimaryCareIcon} alt="link" />}
              manageBenefitItems={[
                {
                  title: 'Preventive Care',
                  body: '',
                  externalLink: false,
                  url: 'url',
                },
                {
                  title: 'Office Visits',
                  body: '',
                  externalLink: false,
                  url: 'url',
                },
                {
                  title: 'Allergy',
                  body: '',
                  externalLink: true,
                  url: 'url',
                },
                {
                  title: 'Emergency',
                  body: '',
                  externalLink: true,
                  url: 'url',
                },
                {
                  title: 'Inpatient Services',
                  body: '',
                  externalLink: true,
                  url: 'url',
                },
                {
                  title: 'Outpatient Services',
                  body: '',
                  externalLink: true,
                  url: 'url',
                },
                {
                  title: 'Medical Equipment / Prosthetics / Orthotics',
                  body: '',
                  externalLink: true,
                  url: 'url',
                },
                {
                  title: 'Behavioral Health',
                  body: '',
                  externalLink: true,
                  url: 'url',
                },
                {
                  title: 'Other Services',
                  body: '',
                  externalLink: true,
                  url: 'url',
                },
              ]}
            />
            <MedicalPharmacyDentalCard
              className="small-section w-[672px] "
              heading="Pharmacy"
              cardIcon={<Image src={PharmacyIcon} alt="link" />}
              manageBenefitItems={[
                {
                  title: 'Prescription Drugs',
                  body: '',
                  externalLink: false,
                  url: 'url',
                },
              ]}
            />

            <MedicalPharmacyDentalCard
              className="small-section w-[672px] "
              heading="Dental"
              cardIcon={<Image src={DentalIcon} alt="link" />}
              manageBenefitItems={[
                {
                  title: 'Anesthesia',
                  body: '',
                  externalLink: false,
                  url: 'url',
                },
                {
                  title: 'Basic',
                  body: '',
                  externalLink: false,
                  url: 'url',
                },
                {
                  title: 'Diagnostic & Preventive',
                  body: '',
                  externalLink: false,
                  url: 'url',
                },
                {
                  title: 'Endodontics',
                  body: '',
                  externalLink: false,
                  url: 'url',
                },
                {
                  title: 'Major',
                  body: '',
                  externalLink: true,
                  url: 'url',
                },
                {
                  title: 'Occlusal Guard',
                  body: '',
                  externalLink: true,
                  url: 'url',
                },
                {
                  title: 'Oral Surgery',
                  body: '',
                  externalLink: true,
                  url: 'url',
                },
                {
                  title: 'Orthodontic Treatment',
                  body: '',
                  externalLink: true,
                  url: 'url',
                },
                {
                  title: 'Periodontics',
                  body: '',
                  externalLink: true,
                  url: 'url',
                },
                {
                  title: 'TMJ Services',
                  body: '',
                  externalLink: true,
                  url: 'url',
                },
              ]}
            />
            <MedicalPharmacyDentalCard
              className="small-section w-[672px] "
              heading="Vision"
              cardIcon={<Image src={VisionIcon} alt="link" />}
              manageBenefitItems={[
                {
                  title: 'Visit EyeMed',
                  body: 'We work with EyeMed to provide your vision benefits. To manage your vision plan, visit EyeMed.',
                  externalLink: false,
                  url: 'url',
                  icon: <Image src={externalIcon} alt="link" />,
                },
              ]}
            />
            <MedicalPharmacyDentalCard
              className="small-section w-[672px] "
              heading="Other Benefits"
              cardIcon={<Image src={OtherBenefit} alt="link" />}
              manageBenefitItems={[
                {
                  title: 'Identity Protection Services',
                  body: 'Keeping your medical information secure is more important than ever. That’s why we offer identity theft protection with our eligible plans—free of charge.',
                  externalLink: false,
                  url: 'url',
                },
                {
                  title: 'Health Programs & Resources',
                  body: 'Your plan includes programs, guides and discounts to help make taking charge of your health easier and more affordable.',
                  externalLink: false,
                  url: 'url',
                },
                {
                  title: 'Shop Over-the-Counter Items',
                  body: 'You get a quarterly allowance for over-the-counter (OTC) items. You can spend it on things like cold medicine, vitamins and more. And once you set up an account, you can even shop for those items online. Set up or log in to your online account to get OTC items shipped right to your door.',
                  externalLink: false,
                  url: 'https://www.cvs.com/benefits/account/create-account/email',
                  icon: <Image src={externalIcon} alt="link" />,
                },
                {
                  title: 'Member Discounts',
                  body: 'Your plan includes programs, guides and discounts to help make taking charge of your health easier and more affordable.',
                  externalLink: false,
                  url: 'url',
                  icon: <Image src={externalIcon} alt="link" />,
                },
                {
                  title: 'Employer Provided Benefits',
                  body: 'Your employer offers even more programs and benefits you can explore here.',
                  externalLink: false,
                  url: 'url',
                },
              ]}
            />
          </Column>
        </section>
      </Column>
    </main>
  );
};

export default Benefits;
