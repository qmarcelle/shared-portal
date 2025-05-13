'use client';
import { ViewCareOptions } from '@/app/findcare/components/ViewCareOptions';
import { VirtualCareOptions } from '@/app/findcare/components/VirtualCareOptions';
import { WelcomeBanner } from '@/components/composite/WelcomeBanner';
import { Column } from '@/components/foundation/Column';
import { RichText } from '@/components/foundation/RichText';
import SearchField from '@/components/foundation/SearchField';
import { Spacer } from '@/components/foundation/Spacer';
import {
  isEmboldHealthEligible,
  isHingeHealthEligible,
  isNewMentalHealthSupportAbleToEligible,
  isNewMentalHealthSupportMyStrengthCompleteEligible,
  isNurseChatEligible,
  isPharmacyBenefitsEligible,
  isTeladocEligible,
  isTeladocPrimary360Eligible,
  isVisionEligible,
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
  PROV_DIR_DEEPLINK_MAP,
  PROV_DIR_DENTAL,
  PROV_DIR_MEDICAL,
  PROV_DIR_MENTAL_HEALTH,
} from '../sso/ssoConstants';
import { FindCarePillBox } from './components/FindCarePillBox';
export type FindCareProps = { visibilityRules?: VisibilityRules };

const FindCare = ({ visibilityRules }: FindCareProps) => {
  const router = useRouter();
  return (
    <main className="flex flex-col justify-center items-center page">
      <WelcomeBanner
        className="px-4"
        titleText=""
        name="Find Care & Costs"
        body={
          <>
            <RichText
              spans={[
                <>
                  <span>
                    Looking for care or estimating costs for a procedure? Use
                    our{' '}
                  </span>
                  <span className="link !text-white" key={1}>
                    <a>Find Care & Costs tool.</a>
                  </span>
                </>,
              ]}
            />
            <Spacer size={16} />
            <RichText
              type="body-2"
              spans={[
                <span key={0}>
                  In case of medical emergency, call 911. In case of a mental
                  health crisis, call 988.
                </span>,
              ]}
            />
          </>
        }
      />
      <Spacer size={16}></Spacer>
      <Column className="app-content app-base-font-color md:p-0 p-4">
        <section className={'card-main mt-4'}>
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
                      router.push(
                        `/sso/launch?PartnerSpId=${process.env.NEXT_PUBLIC_IDP_PROVIDER_DIRECTORY}&alternateText=Find a PCP&isPCPSearchRedirect=true&TargetResource=${process.env.NEXT_PUBLIC_PROVIDER_DIRECTORY_PCP_SSO_TARGET}`,
                      );
                    },
                  },
                  {
                    label: 'Dentist',
                    callback: () => {
                      router.push(
                        `/sso/launch?PartnerSpId=${process.env.NEXT_PUBLIC_IDP_PROVIDER_DIRECTORY}&TargetResource=${process.env.NEXT_PUBLIC_PROVIDER_DIRECTORY_VITALS_SSO_TARGET!.replace('{DEEPLINK}', PROV_DIR_DEEPLINK_MAP.get(PROV_DIR_DENTAL)!)}`,
                      );
                    },
                  },
                  {
                    label: 'Mental Health Provider',
                    callback: () => {
                      router.push(
                        `/sso/launch?PartnerSpId=${process.env.NEXT_PUBLIC_IDP_PROVIDER_DIRECTORY}&TargetResource=${process.env.NEXT_PUBLIC_PROVIDER_DIRECTORY_VITALS_SSO_TARGET!.replace('{DEEPLINK}', PROV_DIR_DEEPLINK_MAP.get(PROV_DIR_MENTAL_HEALTH)!)}`,
                      );
                    },
                  },
                  isVisionEligible(visibilityRules)
                    ? {
                        label: 'Eye Doctor',
                        callback: () => {
                          router.push(
                            `/sso/launch?PartnerSpId=${process.env.NEXT_PUBLIC_IDP_EYEMED}&TargetResource=${process.env.NEXT_PUBLIC_EYEMED_SSO_TARGET!.replace('{DEEPLINK}', EYEMED_DEEPLINK_MAP.get(EYEMED_PROVIDER_DIRECTORY)!)}`,
                          );
                        },
                      }
                    : {
                        label: 'Eye Doctor',
                        callback: () => {
                          router.push('');
                        },
                      },
                  isPharmacyBenefitsEligible(visibilityRules)
                    ? {
                        label: 'Pharmacy',
                        callback: () => {
                          router.push(
                            `/sso/launch?PartnerSpId=${process.env.NEXT_PUBLIC_IDP_CVS_CAREMARK}&TargetResource=${process.env.NEXT_PUBLIC_CVS_SSO_TARGET?.replace('{DEEPLINK}', CVS_DEEPLINK_MAP.get(CVS_PHARMACY_SEARCH_FAST)!)}`,
                          );
                        },
                      }
                    : {
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
                      router.push('/member/findcare/virtualcare');
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
                    router.push(
                      `/sso/launch?PartnerSpId=${process.env.NEXT_PUBLIC_IDP_PROVIDER_DIRECTORY}&TargetResource=${process.env.NEXT_PUBLIC_PROVIDER_DIRECTORY_VITALS_SSO_TARGET!.replace('{DEEPLINK}', PROV_DIR_DEEPLINK_MAP.get(PROV_DIR_MEDICAL)!)}`,
                    );
                  },
                },
                {
                  label: 'Dental',
                  callback: () => {
                    router.push('/member/findcare/dentalcosts');
                  },
                },
                isPharmacyBenefitsEligible(visibilityRules)
                  ? {
                      label: 'Prescription Drugs',
                      callback: () => {
                        router.push(
                          `/sso/launch?PartnerSpId=${process.env.NEXT_PUBLIC_IDP_CVS_CAREMARK}&TargetResource=${process.env.NEXT_PUBLIC_CVS_SSO_TARGET?.replace('{DEEPLINK}', CVS_DEEPLINK_MAP.get(CVS_DRUG_SEARCH_INIT)!)}`,
                        );
                      },
                    }
                  : {
                      label: 'Prescription Drugs',
                      callback: () => {
                        router.push('');
                      },
                    },
                isVisionEligible(visibilityRules)
                  ? {
                      label: 'Vision',
                      callback: () => {
                        router.push(
                          `/sso/launch?PartnerSpId=${process.env.NEXT_PUBLIC_IDP_EYEMED}&TargetResource=${process.env.NEXT_PUBLIC_EYEMED_SSO_TARGET?.replace('{DEEPLINK}', EYEMED_DEEPLINK_MAP.get(EYEMED_VISION)!)}`,
                        );
                      },
                    }
                  : {
                      label: 'Vision',
                      callback: () => {
                        router.push('');
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
                  url: '/member/findcare/virtualcare/primarycare',
                  visible: isTeladocPrimary360Eligible(visibilityRules),
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
                  url: '/member/findcare/mentalHealthOptions',
                  visible:
                    isNewMentalHealthSupportAbleToEligible(visibilityRules) ||
                    isNewMentalHealthSupportMyStrengthCompleteEligible(
                      visibilityRules,
                    ),
                },
              ]}
            />
          </Column>
        </section>
        <Spacer size={32} />
        {(isNewMentalHealthSupportMyStrengthCompleteEligible(visibilityRules) ||
          isNewMentalHealthSupportAbleToEligible(visibilityRules) ||
          isHingeHealthEligible(visibilityRules) ||
          isTeladocPrimary360Eligible(visibilityRules) ||
          isTeladocEligible(visibilityRules) ||
          isNurseChatEligible(visibilityRules)) && (
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
                  title: 'Hinge Health Back & Joint Care',
                  description:
                    'You and your eligible family members can get help for back and joint issues with personalized therapy from the comfort of your home.',
                  url: 'null',
                },
                {
                  id: '3',
                  title: 'Talk to a Nurse',
                  description:
                    'Connect with a nurse anytime 24/7 at no cost to you. They can answer questions and help you make decisions about your care.',
                  url: '',
                },
                {
                  id: '4',
                  title: 'Teladoc Health General & Urgent Care',
                  description:
                    'Access to board-certified physicians 24/7 for the diagnosis and treatment of non-emergency conditions.',
                  url: 'null',
                },
                {
                  id: '5',
                  title: 'Teladoc Health Primary Care Provider',
                  description:
                    'With Primary 360, you can talk to a board-certified primary care doctor by video or phone, seven days a week.',
                  url: '',
                },
                {
                  id: '6',
                  title: 'Teladoc Mental Health',
                  description:
                    'Speak with a therapist, psychologist or psychiatrist seven days a week from anywhere.',
                  url: '',
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
