'use client';

import { Column } from '@/components/foundation/Column';
import { Spacer } from '@/components/foundation/Spacer';
import { Title } from '@/components/foundation/Title';
import DentalIcon from '@/public/assets/dental_benefit.svg';
import OtherBenefit from '@/public/assets/other_benefit.svg';
import PharmacyIcon from '@/public/assets/pharmacy_benefit.svg';
import PrimaryCareIcon from '@/public/assets/primary_care.svg';
import VisionIcon from '@/public/assets/vision_benefit.svg';
import Image from 'next/image';

import { Filter } from '@/components/foundation/Filter';
import { externalIcon } from '@/components/foundation/Icons';
import { RichText } from '@/components/foundation/RichText';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { BenefitDropdownItem } from './actions/benefitsUtils';
import {
  ManageBenefitsItems,
  MedicalPharmacyDentalCard,
} from './components/MedicalPharmacyDentalCard';
import { MemberBenefitsBean } from './models/member_benefits_bean';
import { useBenefitsStore } from './stores/benefitsStore';

interface BenefitsProps {
  benefitsBean: MemberBenefitsBean;
  benefitsTypes: BenefitDropdownItem[];
  memberDropdownValues: { label: string; value: string; id: string }[];
}

const Benefits = ({
  benefitsBean,
  benefitsTypes,
  memberDropdownValues,
}: BenefitsProps) => {
  const [medicalBenefitsItems, setMedicalBenefitsItems] = useState<
    ManageBenefitsItems[]
  >([]);
  const [rxBenefitsItems, setRXBenefitsItems] = useState<ManageBenefitsItems[]>(
    [],
  );
  const [dentalBenefitsItems, setDentalBenefitsItems] = useState<
    ManageBenefitsItems[]
  >([]);
  const router = useRouter();

  const { setSelectedBenefitCategory, setSelectedBenefitsBean } =
    useBenefitsStore();

  useEffect(() => {
    if (benefitsBean.medicalBenefits) {
      const medBenefits: ManageBenefitsItems[] = [];
      benefitsBean.medicalBenefits.serviceCategories.forEach((item) => {
        medBenefits.push({
          title: item.category,
          body: '',
          externalLink: false,
          onClick: () => onBenefitSelected(item, benefitsBean.medicalBenefits),
        });
      });
      setMedicalBenefitsItems(medBenefits);

      const rxItems: ManageBenefitsItems[] = [
        {
          title: 'Prescription Drugs',
          body: '',
          externalLink: false,
          onClick: () =>
            onBenefitSelected(
              {
                id: 107,
                category: 'Prescription Drugs',
                comments: '',
                displaySortOrder: 0,
              },
              benefitsBean.medicalBenefits,
            ),
        },
      ];
      setRXBenefitsItems(rxItems);
    } else {
      setRXBenefitsItems([]);
      setMedicalBenefitsItems([]);
    }
    if (benefitsBean.dentalBenefits) {
      const denBenefits: ManageBenefitsItems[] = [];
      benefitsBean.dentalBenefits.serviceCategories.forEach((item) => {
        denBenefits.push({
          title: item.category,
          body: '',
          externalLink: false,
          onClick: () => onBenefitSelected(item, benefitsBean.dentalBenefits),
        });
      });
      setDentalBenefitsItems(denBenefits);
    }
  }, [benefitsBean]);

  function onBenefitSelected(
    serviceCategory: ServiceCategory,
    benefitsBean: BenefitDetailsBean | undefined,
  ) {
    if (benefitsBean === undefined || serviceCategory === undefined) {
      console.log('Selected benefit missing benefits bean or service category');
      return;
    }
    setSelectedBenefitCategory(serviceCategory);
    setSelectedBenefitsBean(benefitsBean);
    console.log(serviceCategory);
    console.log(benefitsBean);
    router.push('/benefits/details');
  }

  return (
    <main className="flex flex-col justify-center items-center page">
      <Column className="app-content app-base-font-color">
        <Spacer size={32} />
        <Title className="title-1" text="Benefits & Coverage" />
        <Spacer size={16} />
        <RichText
          spans={[
            <span key={0}>If you have questions, </span>,
            <span className="link font-bold" key={1}>
              start a chat
            </span>,
            <span key={2}> or call us at [1-800-000-000].</span>,
          ]}
        />
        <Spacer size={16} />
        <section className="flex flex-row items-start app-body" id="Filter">
          <Column className=" flex-grow page-section-36_67 items-stretch">
            <Filter
              className="large-section px-0 m-0"
              filterHeading="Filter Benefits"
              filterItems={[
                {
                  type: 'dropdown',
                  label: 'Member',
                  value: memberDropdownValues,
                  selectedValue: memberDropdownValues[0],
                  // onFilterChanged: (selectedValue) => {
                  //   setSelectedMember(selectedValue);
                  // },
                },
                {
                  type: 'dropdown',
                  label: 'Benefit Type',
                  value: benefitsTypes,
                  selectedValue: benefitsTypes[0],
                  // onFilterChanged: (selectedValue) => {
                  //   setSelectedBenefitType(selectedValue);
                  // },
                },
              ]}
            />
          </Column>
          <Column className="flex-grow page-section-63_33 items-stretch">
            {benefitsBean.medicalBenefits && (
              <MedicalPharmacyDentalCard
                className="small-section w-[672px] benefitsLink"
                heading="Medical"
                cardIcon={<Image src={PrimaryCareIcon} alt="link" />}
                manageBenefitItems={medicalBenefitsItems}
              />
            )}
            {benefitsBean.medicalBenefits && (
              <MedicalPharmacyDentalCard
                className="small-section w-[672px] "
                heading="Pharmacy"
                cardIcon={<Image src={PharmacyIcon} alt="link" />}
                manageBenefitItems={rxBenefitsItems}
              />
            )}
            {benefitsBean.dentalBenefits && (
              <MedicalPharmacyDentalCard
                className="small-section w-[672px] "
                heading="Dental"
                cardIcon={<Image src={DentalIcon} alt="link" />}
                manageBenefitItems={dentalBenefitsItems}
              />
            )}
            {benefitsBean.visionBenefits && (
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
            )}
            <MedicalPharmacyDentalCard
              className="small-section w-[672px] "
              heading="Other Benefits"
              cardIcon={<Image src={OtherBenefit} alt="link" />}
              manageBenefitItems={[
                {
                  title: 'Identity Protection Services',
                  body: 'Keeping your medical information secure is more important than ever. That’s why we offer identity theft protection with our eligible plans—free of charge.',
                  externalLink: false,
                  url: '/benefits/identityProtectionServices',
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
                  url: '/benefits/employerProvidedBenefits',
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
