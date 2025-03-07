'use client';
import { VirtualMentalHealthCareSection } from '@/app/mentalHealthOptions/components/VirtualMentalHealthCareSection';
import { VirtualHealthCareDetails } from '@/app/mentalHealthOptions/models/mental_health_care_options_details';
import { AppLink } from '@/components/foundation/AppLink';
import { Column } from '@/components/foundation/Column';
import { Header } from '@/components/foundation/Header';
import { Spacer } from '@/components/foundation/Spacer';
import { TextBox } from '@/components/foundation/TextBox';
import {
  isBloodPressureManagementEligible,
  isCareManagementEligiblity,
  isDiabetesPreventionEligible,
  isHingeHealthEligible,
  isNewMentalHealthSupportAbleToEligible,
  isNewMentalHealthSupportMyStrengthCompleteEligible,
  isNurseChatEligible,
  isQuestSelectEligible,
  isSilverAndFitnessEligible,
  isTeladocPrimary360Eligible,
  isTeladocSecondOpinionAdviceAndSupportEligible,
} from '@/visibilityEngine/computeVisibilityRules';
import { VisibilityRules } from '@/visibilityEngine/rules';
import { myHealthProgramsandResourcesDetails } from './models/health_programs_resources_details';
import { HealthProgramsResourcesName } from './models/health_programs_resources_names';

const healthPrograms = [
  {
    checkFunction: isNewMentalHealthSupportAbleToEligible,
    key: HealthProgramsResourcesName.AbleTo,
  },
  {
    checkFunction: isNewMentalHealthSupportMyStrengthCompleteEligible,
    key: HealthProgramsResourcesName.TeladocMentalHealth,
  },
  {
    checkFunction: isTeladocPrimary360Eligible,
    key: HealthProgramsResourcesName.TeladocHealthPrimaryCardProvider,
  },
  {
    checkFunction: isHingeHealthEligible,
    key: HealthProgramsResourcesName.HingeHealthBackAndJointCare,
  },
  {
    checkFunction: isNurseChatEligible,
    key: HealthProgramsResourcesName.TalkToNurse,
  },
  {
    checkFunction: isDiabetesPreventionEligible,
    key: HealthProgramsResourcesName.TeladocHealthDiabetesPreventionProgram,
  },
  {
    checkFunction: isCareManagementEligiblity,
    key: HealthProgramsResourcesName.CareTNOneOnOneHealthSupport,
  },
  {
    checkFunction: isTeladocSecondOpinionAdviceAndSupportEligible,
    key: HealthProgramsResourcesName.TeladocSecondOpinionAdviceAndSupport,
  },
  {
    checkFunction: isBloodPressureManagementEligible,
    key: HealthProgramsResourcesName.TeladocHealthBloodPressureManagementProgram,
  },
  {
    checkFunction: isSilverAndFitnessEligible,
    key: HealthProgramsResourcesName.SilverAndFitFitnessProgram,
  },
  {
    checkFunction: isQuestSelectEligible,
    key: HealthProgramsResourcesName.QuestSelectLowCostLabTesting,
  },
];

export type MyHealthProgramsResourcesProps = {
  visibilityRules?: VisibilityRules;
};
const MyHealthProgramsResources = ({
  visibilityRules,
}: MyHealthProgramsResourcesProps) => {
  const virtualHealthCareDetails: VirtualHealthCareDetails[] = [];

  healthPrograms.forEach(({ checkFunction, key }) => {
    if (visibilityRules && checkFunction(visibilityRules)) {
      const resource = myHealthProgramsandResourcesDetails.get(key);
      if (resource) virtualHealthCareDetails.push(resource);
    }
  });
  return (
    <div className="flex flex-col justify-center items-center page">
      <Spacer size={32} />
      <Column className="app-content app-base-font-color">
        <Header className="mt-4" text="Health Programs & Resources" />
        <div className="w-3/4">
          <Spacer size={16} />
          <TextBox
            className="mt-4 inline w-2/3"
            text="Your plan includes programs, guides and discounts to help make taking charge of your health easier and more affordable."
          ></TextBox>
          <AppLink
            label="View all your plan benefits here"
            displayStyle="inline-flex"
            className="pr-0"
          />
          .
        </div>
        <Spacer size={16} />
        <section className="flex flex-row items-start app-body">
          <Column className="flex-grow page-section-63_33 items-stretch">
            <VirtualMentalHealthCareSection
              mentalHealthCareOptions={virtualHealthCareDetails}
            />
          </Column>
        </section>
      </Column>
    </div>
  );
};

export default MyHealthProgramsResources;
