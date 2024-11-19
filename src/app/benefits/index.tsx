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
import {
  BenefitDropdownItem,
  getBenefitTypes,
  getMemberDropdownValues,
} from './actions/benefitsUtils';
import { getBenefitsData } from './actions/getBenefits';
import getUserInfo from './actions/getUserInfo';
import {
  ManageBenefitsItems,
  MedicalPharmacyDentalCard,
} from './components/MedicalPharmacyDentalCard';
import { MemberBenefitsBean } from './models/member_benefits_bean';
import { useBenefitsStore } from './stores/benefitsStore';

const Benefits = () => {
  const {
    currentUserBenefitData,
    setCurrentUserBenefitData,
    userInfo,
    setUserInfo,
    memberIndex,
    setMemberIndex,
    setSelectedBenefitCategory,
    setSelectedBenefitsBean,
  } = useBenefitsStore();

  // const [selectedBenefitType, setSelectedBenefitType] = useState<string>('M');
  const [selectedMember, setSelectedMember] = useState<string>('0');
  const selectedBenefitType = 'M';

  const [memberDropdownValues, setMemberDropDownValues] = useState<
    { label: string; value: string; id: string }[]
  >([]);

  const [benefitTypes, setBenefitTypes] = useState<BenefitDropdownItem[]>([]);
  const [medicalBenefitsItems, setMedicalBenefitsItems] = useState<
    ManageBenefitsItems[]
  >([]);
  const [rxBenefitsItems, setRXBenefitsItems] = useState<ManageBenefitsItems[]>(
    [],
  );
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const router = useRouter();

  const onMemberSelectionChange = (selectedMember: string) => {
    setSelectedMember(selectedMember);
    setMemberIndex(parseInt(selectedMember));
    const selectedMemberPlanDetails =
      userInfo.members[parseInt(selectedMember)].planDetails;

    setBenefitTypes(getBenefitTypes(selectedMemberPlanDetails));
  };

  //load initial member and screen
  useEffect(() => {
    const fetchInitialData = async () => {
      // load userInfo from service
      const userInfoData = await getUserInfo();
      setUserInfo(userInfoData);
      const memberDropdowns = getMemberDropdownValues(userInfoData.members);
      console.log(memberDropdowns);
      setMemberDropDownValues(memberDropdowns);
      onMemberSelectionChange(selectedMember);
      const response = await getBenefitsData(
        userInfoData.members[0],
        selectedBenefitType,
      );
      if (response.status === 200) {
        console.log('Successful response from service');
        if (response.data && response.data.memberCk > 0) {
          setCurrentUserBenefitData(response.data);
          setMedicalBenefitsFromResponse(response.data);
        } else {
          console.log('Error response from service');
        }
      }

      setIsLoading(false);
    };
    fetchInitialData();
  }, []); // Add empty dependency array to run only once

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

  useEffect(() => {
    const selectedMemberPlanDetails =
      userInfo.members[parseInt(selectedMember)].planDetails;
    setBenefitTypes(getBenefitTypes(selectedMemberPlanDetails));
  }, [selectedMember]); // Add dependencies to avoid unnecessary re-renders

  if (isLoading) {
    return <div>Loading...</div>;
  }

  function setMedicalBenefitsFromResponse(benefitsBean: MemberBenefitsBean) {
    if (benefitsBean.medicalBenefits) {
      const medBenefits: ManageBenefitsItems[] = [];
      benefitsBean.medicalBenefits.serviceCategories.forEach((item) => {
        medBenefits.push({
          title: item.category,
          body: '',
          externalLink: false,
          onClick: () => onBenefitSelected(item, benefitsBean.medicalBenefits),
        });
        benefitsBean.medicalBenefits?.coveredServices;
      });
      console.log(JSON.stringify(medBenefits));
      setMedicalBenefitsItems(medBenefits);
      //Pharmacy
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
      console.log('No data received from service');
      setRXBenefitsItems([]);
      setMedicalBenefitsItems([]);
    }
  }

  console.log(memberIndex);
  const currentBenefitsData = currentUserBenefitData;
  console.log(currentUserBenefitData);
  console.log(currentBenefitsData);

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
            {currentBenefitsData.medicalBenefits && (
              <MedicalPharmacyDentalCard
                className="small-section w-[672px] benefitsLink"
                heading="Medical"
                cardIcon={<Image src={PrimaryCareIcon} alt="link" />}
                manageBenefitItems={medicalBenefitsItems}
              />
            )}
            {currentBenefitsData.medicalBenefits && (
              <MedicalPharmacyDentalCard
                className="small-section w-[672px] "
                heading="Pharmacy"
                cardIcon={<Image src={PharmacyIcon} alt="link" />}
                manageBenefitItems={rxBenefitsItems}
              />
            )}
            {currentBenefitsData.dentalBenefits && (
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
            {currentBenefitsData.visionBenefits && (
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
