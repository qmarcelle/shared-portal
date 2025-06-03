'use client';
import { getFindCarePillOptions } from '@/app/dashboard/actions/getFindCarePillOptions';
import { FindMedicalProvidersComponent } from '@/app/dashboard/components/FindMedicalProvidersComponent';
import { ViewCareOptions } from '@/app/findcare/components/ViewCareOptions';
import { VirtualCareOptions } from '@/app/findcare/components/VirtualCareOptions';
import { WelcomeBanner } from '@/components/composite/WelcomeBanner';
import { Column } from '@/components/foundation/Column';
import { RichText } from '@/components/foundation/RichText';
import SearchField from '@/components/foundation/SearchField';
import { Spacer } from '@/components/foundation/Spacer';
import EstimateCost from '@/public/assets/estimate_cost.svg';
import findCareIcon from '@/public/assets/find_care_search.svg';
import MentalCareIcon from '@/public/assets/mental_health.svg';
import PrimaryCareIcon from '@/public/assets/primary_care.svg';
import {
  isBlueCareEligible,
  isBlueCareNotEligible,
  isEmboldHealthEligible,
  isHingeHealthEligible,
  isLifePointGrp,
  isNewMentalHealthSupportAbleToEligible,
  isNewMentalHealthSupportMyStrengthCompleteEligible,
  isNurseChatEligible,
  isTeladocEligible,
  isTeladocPrimary360Eligible,
} from '@/visibilityEngine/computeVisibilityRules';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { getProcedurePillOptions } from '../dashboard/actions/getProcedurePillOptions';
import { FindCarePillBox } from './components/FindCarePillBox';
import { FindCareData } from './models/find_care_data';
import { PrimaryCareProvider } from './primaryCareOptions/components/PrimaryCareProvider';
export type FindCareProps = { findCareData: FindCareData };

const FindCare = ({ findCareData }: FindCareProps) => {
  const router = useRouter();
  const { visibilityRules, primaryCareProvider } = findCareData;
  const findCarePillOptions = getFindCarePillOptions(
    findCareData.visibilityRules!,
    router,
  );
  const procedurePillOptions = getProcedurePillOptions(
    findCareData.visibilityRules!,
    router,
  );
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
            {!isEmboldHealthEligible(visibilityRules) &&
              findCarePillOptions && (
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
                  pillObjects={findCarePillOptions}
                />
              )}
          </Column>
          {procedurePillOptions && isBlueCareNotEligible(visibilityRules) && (
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
                pillObjects={procedurePillOptions}
              />
            </Column>
          )}
          {isBlueCareEligible(visibilityRules) && primaryCareProvider && (
            <Column className="flex-grow page-section-36_67 items-stretch">
              <PrimaryCareProvider
                className="my-8  p-5"
                providerDetails={primaryCareProvider ?? null}
                label="Primary Care Provider"
                linkLabel="View or Update Primary Care Provider"
                title="My Primary Care Provider"
              />
            </Column>
          )}
        </section>
        {isBlueCareNotEligible(visibilityRules) && (
          <>
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
                          alt=""
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
                          alt=""
                        />
                      ),
                      url: '/member/findcare/mentalHealthOptions',
                      visible:
                        isNewMentalHealthSupportAbleToEligible(
                          visibilityRules,
                        ) ||
                        isNewMentalHealthSupportMyStrengthCompleteEligible(
                          visibilityRules,
                        ),
                    },
                  ]}
                />
              </Column>
            </section>
            <Spacer size={32} />
          </>
        )}
        {(isNewMentalHealthSupportMyStrengthCompleteEligible(visibilityRules) ||
          isNewMentalHealthSupportAbleToEligible(visibilityRules) ||
          isHingeHealthEligible(visibilityRules) ||
          isTeladocPrimary360Eligible(visibilityRules) ||
          isTeladocEligible(visibilityRules) ||
          isNurseChatEligible(visibilityRules)) &&
          isBlueCareNotEligible(visibilityRules) &&
          !isLifePointGrp(visibilityRules) && (
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
