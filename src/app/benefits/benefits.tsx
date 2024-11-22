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

import { externalIcon } from '@/components/foundation/Icons';
import { RichText } from '@/components/foundation/RichText';

import { Card } from '@/components/foundation/Card';
import { FilterHead, FilterTile } from '@/components/foundation/Filter';
import { Header } from '@/components/foundation/Header';
import { RichDropDown } from '@/components/foundation/RichDropDown';
import { FilterDetails } from '@/models/filter_dropdown_details';
import { Member } from '@/models/member/api/loggedInUserInfo';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import {
  getBenefitTypes,
  getMemberDropdownValues,
} from './actions/benefitsUtils';
import {
  ManageBenefitsItems,
  MedicalPharmacyDentalCard,
} from './components/MedicalPharmacyDentalCard';
import { MemberBenefitsBean } from './models/member_benefits_bean';
import { useBenefitsStore } from './stores/benefitsStore';

interface BenefitsProps {
  memberInfo: Member[];
  benefitsBean: MemberBenefitsBean;
}

const Benefits = ({ memberInfo, benefitsBean }: BenefitsProps) => {
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

  const {
    setSelectedBenefitDetails,
    currentUserBenefitData,
    setCurrentUserBenefitData,
    currentSelectedMember,
    setCurrentSelectedMember,
    currentSelectedBenefitType,
    setCurrentSelectedBenefitType,
  } = useBenefitsStore();

  function filterAndGroupByCategoryId(
    data: CoveredService[] | undefined,
    categoryId: number,
  ) {
    if (data === undefined) {
      return [];
    }
    return data
      .map((item) => {
        return {
          serviceDetails: item.serviceDetails.filter(
            (detail) => detail.categoryId === categoryId,
          ),
        };
      })
      .filter((item) => item.serviceDetails.length > 0);
  }

  useEffect(() => {
    setCurrentUserBenefitData(benefitsBean);
    setCurrentSelectedMember(memberInfo[0]);
  }, [benefitsBean, memberInfo]);

  useEffect(() => {
    if (currentUserBenefitData.medicalBenefits) {
      const medBenefits: ManageBenefitsItems[] = [];
      currentUserBenefitData.medicalBenefits.serviceCategories.forEach(
        (item) => {
          medBenefits.push({
            title: item.category,
            body: '',
            externalLink: false,
            onClick: () =>
              onBenefitSelected(
                currentUserBenefitData.medicalBenefits?.networkTiers,
                filterAndGroupByCategoryId(
                  currentUserBenefitData.medicalBenefits?.coveredServices,
                  item.id,
                ),
                { category: item.category, id: item.id },
              ),
          });
        },
      );
      setMedicalBenefitsItems(medBenefits);

      const rxItems: ManageBenefitsItems[] = [
        {
          title: 'Prescription Drugs',
          body: '',
          externalLink: false,
          onClick: () =>
            onBenefitSelected(
              currentUserBenefitData.medicalBenefits?.networkTiers,
              filterAndGroupByCategoryId(
                currentUserBenefitData.medicalBenefits?.coveredServices,
                107,
              ),
              { category: 'Prescription Drugs', id: 107 },
            ),
        },
      ];
      setRXBenefitsItems(rxItems);
    } else {
      setRXBenefitsItems([]);
      setMedicalBenefitsItems([]);
    }
    if (currentUserBenefitData.dentalBenefits) {
      const denBenefits: ManageBenefitsItems[] = [];
      currentUserBenefitData.dentalBenefits.serviceCategories.forEach(
        (item) => {
          denBenefits.push({
            title: item.category,
            body: '',
            externalLink: false,
            onClick: () =>
              onBenefitSelected(
                currentUserBenefitData.dentalBenefits?.networkTiers,
                filterAndGroupByCategoryId(
                  currentUserBenefitData.dentalBenefits?.coveredServices,
                  item.id,
                ),
                { category: item.category, id: item.id },
              ),
          });
        },
      );
      setDentalBenefitsItems(denBenefits);
    }

    function onBenefitSelected(
      networkTiers: NetWorksAndTierInfo[] | undefined,
      serviceCategory: { serviceDetails: ServiceDetails[] }[],
      category: { category: string; id: number },
    ) {
      if (networkTiers === undefined || serviceCategory === undefined) {
        console.log(
          'Selected benefit missing benefits bean or service category',
        );
        return;
      }
      setSelectedBenefitDetails({
        networkTiers: networkTiers,
        coveredServices: serviceCategory,
        serviceCategory: category,
      });
      router.push('/benefits/details');
    }
  }, [currentUserBenefitData]);

  const onMemberSelectionChange = (selectedMember: string) => {
    console.log(`Selected Member: ${selectedMember}`);
    const member = memberInfo.find(
      (item) => item.memberCk === parseInt(selectedMember),
    );
    if (member === undefined) {
      console.log('Selected member not found');
      return;
    }
    setCurrentSelectedMember(member);
  };

  function onBenefitTypeSelectChange(val: string): void {
    console.log(`Selected Benefit Type: ${val}`);
    setCurrentSelectedBenefitType(val);
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
            <Card className="small-section">
              <>
                <Header className="title-2" text="Filter Benefits" />
                <Spacer size={32} />
                <div className="body-1">Member</div>
                <RichDropDown<FilterDetails>
                  headBuilder={(val) => <FilterHead user={val} />}
                  itemData={
                    getMemberDropdownValues(memberInfo) as FilterDetails[]
                  }
                  itemsBuilder={(data, index) => (
                    <FilterTile user={data} key={index} />
                  )}
                  selected={
                    getMemberDropdownValues(memberInfo)[0] as FilterDetails
                  }
                  onSelectItem={(val) => {
                    onMemberSelectionChange(val.value);
                  }}
                />
                <Spacer size={16} />
                <div className="body-1">Benefit Type</div>
                <RichDropDown<FilterDetails>
                  headBuilder={(val) => <FilterHead user={val} />}
                  itemData={
                    getBenefitTypes(
                      currentSelectedMember.planDetails,
                    ) as FilterDetails[]
                  }
                  itemsBuilder={(data, index) => (
                    <FilterTile user={data} key={index} />
                  )}
                  selected={
                    getBenefitTypes(
                      currentSelectedMember.planDetails,
                    )[0] as FilterDetails
                  }
                  onSelectItem={(val) => {
                    onBenefitTypeSelectChange(val.value);
                  }}
                />
              </>
            </Card>
          </Column>
          <Column className="flex-grow page-section-63_33 items-stretch">
            {currentSelectedMember.planDetails.find(
              (item) => item.productCategory === 'M',
            ) &&
              (currentSelectedBenefitType === 'M' ||
                currentSelectedBenefitType === 'A') && (
                <MedicalPharmacyDentalCard
                  className="small-section w-[672px] benefitsLink"
                  heading="Medical"
                  cardIcon={<Image src={PrimaryCareIcon} alt="link" />}
                  manageBenefitItems={medicalBenefitsItems}
                />
              )}
            {currentSelectedMember.planDetails.find(
              (item) => item.productCategory === 'M',
            ) &&
              (currentSelectedBenefitType === 'R' ||
                currentSelectedBenefitType === 'A') && (
                <MedicalPharmacyDentalCard
                  className="small-section w-[672px] "
                  heading="Pharmacy"
                  cardIcon={<Image src={PharmacyIcon} alt="link" />}
                  manageBenefitItems={rxBenefitsItems}
                />
              )}
            {currentSelectedMember.planDetails.find(
              (item) => item.productCategory === 'D',
            ) &&
              (currentSelectedBenefitType === 'D' ||
                currentSelectedBenefitType === 'A') && (
                <MedicalPharmacyDentalCard
                  className="small-section w-[672px] "
                  heading="Dental"
                  cardIcon={<Image src={DentalIcon} alt="link" />}
                  manageBenefitItems={dentalBenefitsItems}
                />
              )}
            {currentSelectedMember.planDetails.find(
              (item) => item.productCategory === 'V',
            ) &&
              (currentSelectedBenefitType === 'V' ||
                currentSelectedBenefitType === 'A') && (
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
            {(currentSelectedBenefitType === 'S' ||
              currentSelectedBenefitType === 'A') && (
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
            )}
          </Column>
        </section>
      </Column>
    </main>
  );
};
export default Benefits;
