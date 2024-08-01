import { Column } from '@/components/foundation/Column';
import { Spacer } from '@/components/foundation/Spacer';
import { Title } from '@/components/foundation/Title';
import Image from 'next/image';
import DentalIcon from '../../../public/assets/dental_benefit.svg';
import PharmacyIcon from '../../../public/assets/pharmacy_benefit.svg';
import PrimaryCareIcon from '../../../public/assets/primary_care.svg';
import { MedicalPharmacyDentalCard } from './components/MedicalPharmacyDentalCard';

const BenefitsAndCoverage = () => {
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
          </Column>
        </section>
      </Column>
    </main>
  );
};

export default BenefitsAndCoverage;
