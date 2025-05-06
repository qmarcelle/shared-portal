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

import { Filter } from '@/components/foundation/Filter';
import { FilterItem } from '@/models/filter_dropdown_details';
import { Member } from '@/models/member/api/loggedInUserInfo';
import {
  isBlue365FitnessYourWayEligible,
  isMskEligible,
} from '@/visibilityEngine/computeVisibilityRules';
import { VisibilityRules } from '@/visibilityEngine/rules';
import { useRouter } from 'next/navigation';
import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  getBenefitTypes,
  getMemberDropdownValues,
} from './actions/benefitsUtils';
import loadBenefits from './actions/loadBenefits';
import { JointProcedureCard } from './components/JointProcedureCard';
import {
  ManageBenefitsItems,
  MedicalPharmacyDentalCard,
} from './components/MedicalPharmacyDentalCard';
import { BenefitType } from './models/benefitConsts';
import { MemberBenefitsBean } from './models/member_benefits_bean';
import { useBenefitsStore } from './stores/benefitsStore';
import { generateBenefitsItems } from './utils/generateBenefitsBeans';
import { generateRxBenefits } from './utils/generateRxBenefits';
import { showPharmacyOptions } from './utils/showPharmacyOptions';

interface BenefitsProps {
  memberInfo: Member[];
  benefitsBean: MemberBenefitsBean;
  otherBenefitItems: ManageBenefitsItems[];
  userGroupId: string;
  phoneNumber: string;
  visibilityRules?: VisibilityRules;
  loggedInMemeck: string;
}

const Benefits = ({
  memberInfo,
  benefitsBean,
  otherBenefitItems,
  userGroupId,
  phoneNumber,
  visibilityRules,
  loggedInMemeck,
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

  const {
    setSelectedBenefitDetails,
    currentUserBenefitData,
    setCurrentUserBenefitData,
    currentSelectedMember,
    setCurrentSelectedMember,
    currentSelectedBenefitType,
    setCurrentSelectedBenefitType,
  } = useBenefitsStore();

  const filterAndGroupByCategoryId = useCallback(
    (data: CoveredService[] | undefined, categoryId: number) => {
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
    },
    [],
  );

  useEffect(() => {
    setCurrentUserBenefitData(benefitsBean);
    const selectedMember = memberInfo.find(
      (member) => member.memberCk.toString() === loggedInMemeck,
    );
    if (selectedMember) setCurrentSelectedMember(selectedMember);
  }, [
    benefitsBean,
    memberInfo,
    setCurrentSelectedMember,
    setCurrentUserBenefitData,
  ]);

  const onBenefitSelected = useCallback(
    (
      networkTiers: NetWorksAndTierInfo[] | undefined,
      serviceCategory: { serviceDetails: ServiceDetails[] }[],
      category: { category: string; id: number },
      benefitType: string,
    ) => {
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
        benefitType: benefitType,
      });
      let path = pathName(category);

      router.push(`/member/myplan/benefits/${path}`);
    },
    [router, setSelectedBenefitDetails],
  );

  useEffect(() => {
    if (currentUserBenefitData.medicalBenefits) {
      setMedicalBenefitsItems(
        generateBenefitsItems(
          currentUserBenefitData.medicalBenefits,
          onBenefitSelected,
          filterAndGroupByCategoryId,
          BenefitType.MEDICAL,
        ),
      );
      if (showPharmacyOptions(userGroupId, currentSelectedMember.planDetails)) {
        setRXBenefitsItems(
          generateRxBenefits(
            currentUserBenefitData.medicalBenefits,
            onBenefitSelected,
          ),
        );
      }
    } else {
      setRXBenefitsItems([]);
      setMedicalBenefitsItems([]);
    }
    if (currentUserBenefitData.dentalBenefits) {
      const denBenefits: ManageBenefitsItems[] = [];
      setDentalBenefitsItems(
        generateBenefitsItems(
          currentUserBenefitData.dentalBenefits,
          onBenefitSelected,
          filterAndGroupByCategoryId,
          BenefitType.DENTAL,
        ),
      );
      setDentalBenefitsItems(denBenefits);
    }
  }, [currentUserBenefitData, onBenefitSelected, filterAndGroupByCategoryId]);

  const onMemberSelectionChange = useCallback(
    (selectedMember: string | undefined) => {
      if (selectedMember === undefined) {
        console.log('Selected member is undefined');
        return;
      }
      console.log(`Selected Member: ${selectedMember}`);
      const member = memberInfo.find(
        (item) => item.memberCk === parseInt(selectedMember),
      );
      if (member === undefined) {
        console.log('Selected member not found');
        return;
      }
      setCurrentSelectedMember(member);
    },
    [memberInfo, setCurrentSelectedMember],
  );

  const onBenefitTypeSelectChange = useCallback(
    (val: string | undefined): void => {
      if (val === undefined) {
        console.log('Selected benefit type is undefined');
        return;
      }
      console.log(`Selected Benefit Type: ${val}`);
      setCurrentSelectedBenefitType(val);
    },
    [setCurrentSelectedBenefitType],
  );

  useEffect(() => {
    // Fetch and update benefits data for the selected member
    if (currentSelectedMember) {
      // Assuming fetchMemberBenefits is a function that fetches benefits data for a member
      loadBenefits(currentSelectedMember)
        .then((data) => {
          if (data.status === 200 && data.data)
            setCurrentUserBenefitData(data.data);
        })
        .catch((error) => {
          console.error('Error fetching benefits data:', error);
        });
    }
  }, [currentSelectedMember, setCurrentUserBenefitData]);

  const memberDropdownValues = useMemo(
    () => getMemberDropdownValues(memberInfo),
    [memberInfo],
  );
  const benefitTypes = useMemo(
    () => getBenefitTypes(currentSelectedMember.planDetails),
    [currentSelectedMember.planDetails],
  );

  function pathName(category: { category: string; id: number }) {
    let path = category.category.replace(/\s/g, '').toLowerCase();
    if (path === 'medicalequipment/prosthetics/orthotics')
      path = 'medicalequipment';
    return path;
  }

  function onFilterSelectChange(index: number, data: FilterItem[]) {
    if (index == 0) onMemberSelectionChange(data[index].selectedValue?.value);
    else if (index == 1)
      onBenefitTypeSelectChange(data[index].selectedValue?.value);
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
            <span key={2}> or call us at [{phoneNumber}].</span>,
          ]}
        />
        <Spacer size={16} />
        <section className="flex flex-row items-start app-body" id="Filter">
          <Column className=" flex-grow page-section-36_67 items-stretch">
            <Filter
              className="filter-component"
              filterHeading="Filter Benefits"
              filterItems={[
                {
                  type: 'dropdown',
                  label: 'Member',
                  value: memberDropdownValues,
                  selectedValue:
                    currentSelectedMember === undefined
                      ? memberDropdownValues[0]
                      : memberDropdownValues.find(
                          (member) =>
                            member.value ===
                            currentSelectedMember.memberCk.toString(),
                        ),
                },
                {
                  type: 'dropdown',
                  label: 'Benefits',
                  value: benefitTypes,
                  selectedValue:
                    currentSelectedBenefitType === undefined
                      ? benefitTypes[0]
                      : benefitTypes.find(
                          (benefit) =>
                            benefit.value === currentSelectedBenefitType,
                        ),
                },
              ]}
              onSelectCallback={(index, data) => {
                console.log(
                  `Filter selection changed: index=${index}, data=${JSON.stringify(data)}`,
                );
                onFilterSelectChange(index, data);
              }}
              showReset={true}
              onReset={() => {
                onMemberSelectionChange(memberDropdownValues[0].value);
                onBenefitTypeSelectChange(benefitTypes[0].value);
              }}
            />
            {isMskEligible(visibilityRules) && (
              <JointProcedureCard
                className="mt-8 row-span-4 font-normal text-white lg:w-[300px] secondary-bg-blue-500 p-5 rounded-lg"
                phoneNumber={currentUserBenefitData.phoneNumber!}
              />
            )}
          </Column>
          <Column className="flex-grow page-section-63_33 items-stretch">
            {currentSelectedMember.planDetails.find(
              (item) => item.productCategory === BenefitType.MEDICAL,
            ) &&
              (currentSelectedBenefitType === BenefitType.MEDICAL ||
                currentSelectedBenefitType === BenefitType.ALL) && (
                <MedicalPharmacyDentalCard
                  className="small-section w-[672px] benefitsLink"
                  heading="Medical"
                  cardIcon={<Image src={PrimaryCareIcon} alt="link" />}
                  manageBenefitItems={medicalBenefitsItems}
                />
              )}
            {currentSelectedMember.planDetails.find(
              (item) => item.productCategory === BenefitType.MEDICAL,
            ) &&
              [BenefitType.RX.toString(), BenefitType.ALL.toString()].includes(
                currentSelectedBenefitType,
              ) && (
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
              [
                BenefitType.DENTAL.toString(),
                BenefitType.ALL.toString(),
              ].includes(currentSelectedBenefitType) && (
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
              [
                BenefitType.VISION.toString(),
                BenefitType.ALL.toString(),
              ].includes(currentSelectedBenefitType) && (
                <MedicalPharmacyDentalCard
                  className="small-section w-[672px] "
                  heading="Vision"
                  cardIcon={<Image src={VisionIcon} alt="link" />}
                  manageBenefitItems={[
                    {
                      title: 'Visit EyeMed',
                      body: 'We work with EyeMed to provide your vision benefits. To manage your vision plan, visit EyeMed.',
                      externalLink: true,
                      url:
                        '/sso/launch?PartnerSpId=' +
                        process.env.NEXT_PUBLIC_IDP_EYEMED,
                      icon: <Image src={externalIcon} alt="link" />,
                    },
                  ]}
                />
              )}
            {isBlue365FitnessYourWayEligible(visibilityRules) &&
              [
                BenefitType.OTHER.toString(),
                BenefitType.ALL.toString(),
              ].includes(currentSelectedBenefitType) && (
                <MedicalPharmacyDentalCard
                  className="small-section w-[672px] "
                  heading="Other Benefits"
                  cardIcon={<Image src={OtherBenefit} alt="link" />}
                  manageBenefitItems={otherBenefitItems}
                />
              )}
          </Column>
        </section>
      </Column>
    </main>
  );
};
export default Benefits;
