'use client';
import { ViewCareOptions } from '@/app/findcare/components/ViewCareOptions';
import { VirtualCareOptions } from '@/app/findcare/components/VirtualCareOptions';
import { Column } from '@/components/foundation/Column';
import SearchField from '@/components/foundation/SearchField';
import { Spacer } from '@/components/foundation/Spacer';
import {
  isEmboldHealthEligible,
  isHingeHealthEligible,
  isNewMentalHealthSupportAbleToEligible,
  isNewMentalHealthSupportMyStrengthCompleteEligible,
  isNurseChatEligible,
  isTeladocEligible,
  isTeledocPrimary360Eligible,
} from '@/visibilityEngine/computeVisibilityRules';
import { VisibilityRules } from '@/visibilityEngine/rules';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import EstimateCost from '../../../public/assets/estimate_cost.svg';
import findCareIcon from '../../../public/assets/find_care_search.svg';
import MentalCareIcon from '../../../public/assets/mental_health.svg';
import PrimaryCareIcon from '../../../public/assets/primary_care.svg';
import { FindMedicalProvidersComponent } from '../dashboard/components/FindMedicalProvidersComponent';
import {
  CVS_DEEPLINK_MAP,
  CVS_DRUG_SEARCH_INIT,
  CVS_PHARMACY_SEARCH_FAST,
  EYEMED_DEEPLINK_MAP,
  EYEMED_PROVIDER_DIRECTORY,
  EYEMED_VISION,
} from '../sso/ssoConstants';
import { FindCarePillBox } from './components/FindCarePillBox';
export type FindCareProps = {
  visibilityRules?: VisibilityRules;
};

const FindCare = ({ visibilityRules }: FindCareProps) => {
  const router = useRouter();
  return (
    <main className="flex flex-col justify-center items-center page">
      <Column className="app-content app-base-font-color md:p-0 p-4">
        <section className={'card-main max-sm:mt-24 mt-8 '}>
          <SearchField
            onSearch={() => null}
            hint="Search by procedure, specialty, facility or provider name..."
          />
        </section>
        <section className="flex flex-row items-start app-body">
          <Column className="flex-grow page-section-63_33 items-stretch">
            {isEmboldHealthEligible(visibilityRules) && (
              <FindMedicalProvidersComponent
                className="!mt-8"
                isButtonHorizontal={true}
              />
            )}
            {!isEmboldHealthEligible(visibilityRules) && (
              <FindCarePillBox
                className="my-8  p-4"
                // className="md:w-[480px] md:h-[200px] md:my-8 p-4 w-11/12 "
                title="Looking for care? Find a:"
                icon={
                  <Image
                    src={findCareIcon}
                    className="w-[40px] h-[40px]"
                    alt=""
                  />
                }
                pillObjects={[
                  {
                    label: 'Primary Care Provider',
                    callback: () => {
                      console.log('Clicked Pill PCP');
                    },
                  },
                  {
                    label: 'Dentist',
                    callback: () => {
                      console.log('Clicked Pill Dentist');
                    },
                  },
                  {
                    label: 'Mental Health Provider',
                    callback: () => {
                      console.log('Clicked Pill Mental Health Provider');
                    },
                  },
                  {
                    label: 'Eye Doctor',
                    callback: () => {
                      router.push(
                        `/sso/launch?PartnerSpId=${process.env.NEXT_PUBLIC_IDP_EYEMED}&TargetResource=${process.env.NEXT_PUBLIC_EYEMED_SSO_TARGET?.replace('{DEEPLINK}', EYEMED_DEEPLINK_MAP.get(EYEMED_PROVIDER_DIRECTORY)!)}`,
                      );
                    },
                  },
                  {
                    label: 'Pharmacy',
                    callback: () => {
                      router.push(
                        `/sso/launch?PartnerSpId=${process.env.NEXT_PUBLIC_IDP_CVS_CAREMARK}&TargetResource=${process.env.NEXT_PUBLIC_CVS_SSO_TARGET?.replace('{DEEPLINK}', CVS_DEEPLINK_MAP.get(CVS_PHARMACY_SEARCH_FAST)!)}`,
                      );
                    },
                  },
                  {
                    label: 'Virtual Care',
                    callback: () => {
                      console.log('Clicked Pill Virtual Care');
                    },
                  },
                ]}
              />
            )}
          </Column>
          <Column className="flex-grow page-section-36_67 items-stretch">
            <FindCarePillBox
              className="my-8  p-4"
              //className="md:w-[480px] md:h-[164px] my-8 p-4 w-11/12"
              title="Planning for a procedure? Estimate costs for:"
              icon={
                <Image
                  src={EstimateCost}
                  className="w-[40px] h-[40px]"
                  alt=""
                />
              }
              pillObjects={[
                {
                  label: 'Medical',
                  callback: () => {
                    console.log('Clicked Pill Medical');
                  },
                },
                {
                  label: 'Dental',
                  callback: () => {
                    console.log('Clicked Pill Dental');
                  },
                },
                {
                  label: 'Prescription Drugs',
                  callback: () => {
                    router.push(
                      `/sso/launch?PartnerSpId=${process.env.NEXT_PUBLIC_IDP_CVS_CAREMARK}&TargetResource=${process.env.NEXT_PUBLIC_CVS_SSO_TARGET?.replace('{DEEPLINK}', CVS_DEEPLINK_MAP.get(CVS_DRUG_SEARCH_INIT)!)}`,
                    );
                  },
                },
                {
                  label: 'Vision',
                  callback: () => {
                    router.push(
                      `/sso/launch?PartnerSpId=${process.env.NEXT_PUBLIC_IDP_EYEMED}&TargetResource=${process.env.NEXT_PUBLIC_EYEMED_SSO_TARGET?.replace('{DEEPLINK}', EYEMED_DEEPLINK_MAP.get(EYEMED_VISION)!)}`,
                    );
                  },
                },
              ]}
            />
          </Column>
        </section>
        <section className="flex flex-row items-start app-body mt-4">
          <Column className="flex-grow page-section-63_33 items-stretch">
            <ViewCareOptions
              options={[
                {
                  title: 'Primary Care Options',
                  description:
                    'Learn more about Primary Care Providers and view your options.',
                  image: (
                    <Image
                      className="max-md:w-[80px] max-md:h-[80px]"
                      src={PrimaryCareIcon}
                      alt="Primary Care"
                    />
                  ),
                  url: '/findcare/primaryCareOptions',
                },
                {
                  title: 'Mental Care Options',
                  description:
                    'Learn more about Mental Health Providers and view your options.',
                  image: (
                    <Image
                      className="max-md:w-[80px] max-md:h-[80px]"
                      src={MentalCareIcon}
                      alt="Mental Care"
                    />
                  ),
                  url: '',
                },
              ]}
            />
          </Column>
        </section>
        <Spacer size={32} />
        {isNewMentalHealthSupportMyStrengthCompleteEligible(visibilityRules) &&
          isNewMentalHealthSupportAbleToEligible(visibilityRules) &&
          isHingeHealthEligible(visibilityRules) &&
          isTeledocPrimary360Eligible(visibilityRules) &&
          isTeladocEligible(visibilityRules) &&
          isNurseChatEligible(visibilityRules) && (
            <section>
              <VirtualCareOptions
                className="p-8"
                options={[
                  {
                    id: '1',
                    title: 'AbleTo',
                    description:
                      // eslint-disable-next-line quotes
                      "AbleTo's personalized and focused 8-week programs help you with sleep, stress, anxiety and more. Get the help you need.",
                    url: 'null',
                  },
                  {
                    id: '2',
                    title: 'Blue of Tennessee Medical Centers Virtual Visits ',
                    description:
                      'At Blue of Tennessee Medical Centers, you can see a primary care provider, some specialists and get urgent care help. You can even get help with your health plan. ',
                    url: 'null',
                  },
                  {
                    id: '3',
                    title: 'Hinge Health Back & Joint Care',
                    description:
                      'You and your eligible family members can get help for back and joint issues with personalized therapy from the comfort of your home.',
                    url: 'null',
                  },
                  {
                    id: '4',
                    title: 'yyt',
                    description: 'xxx',
                    url: 'null',
                  },
                ]}
              />
            </section>
          )}
      </Column>
      <Spacer size={32}></Spacer>
    </main>
  );
};

export default FindCare;
