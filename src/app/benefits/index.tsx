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
import { loggedInUserInfoMockResp } from '@/mock/loggedInUserInfoMockResp';
import {
  LoggedInUserInfo,
  Member,
  PlanDetail,
} from '@/models/member/api/loggedInUserInfo';
import { capitalizeName } from '@/utils/capitalizeName';
import { useEffect, useState } from 'react';
import { getBenefitsData } from './actions/getBenefits';
import { MedicalPharmacyDentalCard } from './components/MedicalPharmacyDentalCard';
import { MemberBenefitsBean } from './models/member_benefits_bean';

export const getMemberDropdownValues = (members: Member[]) => {
  return members.map((member) => ({
    label: `${capitalizeName(member.firstName)} ${capitalizeName(member.lastName)}`,
    value: member.memberCk.toString(),
    id: member.memberCk.toString(),
  }));
};

const getBenefitTypes = (planDetails: PlanDetail[]) => {
  const benefitTypes = new Set<string>();
  benefitTypes.add('All Types');
  interface benefitItem {
    label: string;
    value: string;
    id: string;
  }
  const items: benefitItem[] = [];
  planDetails.forEach((plan) => {
    switch (plan.productCategory) {
      case 'M':
        items.push({
          label: 'Medical',
          value: 'M',
          id: '0',
        });
        items.push({
          label: 'Pharmacy',
          value: 'R',
          id: '0',
        });
        break;
      case 'D':
        items.push({
          label: 'Dental',
          value: 'D',
          id: '0',
        });
        break;
      case 'V':
        items.push({
          label: 'Vision',
          value: 'V',
          id: '0',
        });
        break;
      case 'S':
        items.push({
          label: 'Other',
          value: 'S',
          id: '0',
        });
        break;
      default:
        break;
    }
  });

  const orderedBenefitTypes = [
    'All Types',
    'Medical',
    'Pharmacy',
    'Dental',
    'Vision',
    'Other',
  ];
  const sortedItems = items.sort((a, b) => a.label.localeCompare(b.label));
  return orderedBenefitTypes
    .filter((type) => benefitTypes.has(type))
    .map((type, index) => {
      const item = sortedItems.find((item) => item.label === type);
      return {
        label: type,
        value: (index + 1).toString(),
        id: item
          ? sortedItems.indexOf(item).toString()
          : (index + 1).toString(),
      };
    });
};

const Benefits = () => {
  // const [selectedBenefitType, setSelectedBenefitType] = useState<string>('');
  // const [selectedMember, setSelectedMember] = useState<string>('1');

  const selectedBenefitType = 'M';
  const selectedMember = '1';
  const [benefitsData, setBenefitsData] = useState<MemberBenefitsBean>({
    memberCk: 0,
  });

  let memberDropdownValues: { label: string; value: string; id: string }[] =
    getMemberDropdownValues(loggedInUserInfoMockResp.members);

  const selectedMemberIndex = parseInt(selectedMember);
  const selectedMemberPlanDetails =
    loggedInUserInfoMockResp.members[selectedMemberIndex].planDetails;
  const benefitTypes = getBenefitTypes(selectedMemberPlanDetails);

  useEffect(() => {
    const fetchBenefitsData = async () => {
      const loggedInUserInfo: LoggedInUserInfo = loggedInUserInfoMockResp;
      memberDropdownValues = getMemberDropdownValues(
        loggedInUserInfoMockResp.members,
      );
      const response = await getBenefitsData(
        loggedInUserInfo.members[selectedMemberIndex],
        selectedBenefitType,
      );
      if (response.status === 200) {
        console.log('Successful response from service');
        if (response.data && response.data.memberCk > 0) {
          setBenefitsData(response.data);
        } else {
          console.log('No data received from service');
        }
      } else {
        console.log('Error response from service');
      }
    };

    fetchBenefitsData();
  }, [selectedMember, selectedBenefitType]);

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
                  value: benefitTypes,
                  selectedValue: benefitTypes[0],
                  // onFilterChanged: (selectedValue) => {
                  //   setSelectedBenefitType(selectedValue);
                  // },
                },
              ]}
            />
          </Column>
          <Column className="flex-grow page-section-63_33 items-stretch">
            {benefitsData.medicalBenefits && (
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
                    url: 'benefits/officeVisits',
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
            )}
            {benefitsData.medicalBenefits && (
              <MedicalPharmacyDentalCard
                className="small-section w-[672px] "
                heading="Pharmacy"
                cardIcon={<Image src={PharmacyIcon} alt="link" />}
                manageBenefitItems={[
                  {
                    title: 'Prescription Drugs',
                    body: '',
                    externalLink: false,
                    url: '/benefits/prescriptionDrugs',
                  },
                ]}
              />
            )}
            {benefitsData.dentalBenefits && (
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
            )}
            {benefitsData.visionBenefits && (
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
