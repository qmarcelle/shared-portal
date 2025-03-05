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
  isDiabetesManagementEligible,
  isDiabetesPreventionEligible,
  isHingeHealthEligible,
  isNewMentalHealthSupportAbleToEligible,
  isNewMentalHealthSupportMyStrengthCompleteEligible,
  isNurseChatEligible,
  isSilverAndFitnessEligible,
  isTeladocPrimary360Eligible,
  isTeladocSecondOpinionAdviceAndSupportEligible,
} from '@/visibilityEngine/computeVisibilityRules';
import { VisibilityRules } from '@/visibilityEngine/rules';
import { myHealthProgramsandResourcesDetails } from './models/health_programs_resources_details';
import { HealthProgramsResourcesName } from './models/health_programs_resources_names';

export type MyHealthProgramsResourcesProps = {
  visibilityRules?: VisibilityRules;
};
const MyHealthProgramsResources = ({
  visibilityRules,
}: MyHealthProgramsResourcesProps) => {
  const virtualHealthCareDetails: VirtualHealthCareDetails[] = [];

  if (isNewMentalHealthSupportAbleToEligible(visibilityRules)) {
    const ableTo = myHealthProgramsandResourcesDetails.get(
      HealthProgramsResourcesName.AbleTo,
    );
    if (ableTo) virtualHealthCareDetails.push(ableTo);
  }
  if (isNewMentalHealthSupportMyStrengthCompleteEligible(visibilityRules)) {
    const teladocMentalHealth = myHealthProgramsandResourcesDetails.get(
      HealthProgramsResourcesName.TeladocMentalHealth,
    );
    if (teladocMentalHealth) virtualHealthCareDetails.push(teladocMentalHealth);
  }
  if (isTeladocPrimary360Eligible(visibilityRules)) {
    const teladocHealthPrimaryCardProvider =
      myHealthProgramsandResourcesDetails.get(
        HealthProgramsResourcesName.TeladocHealthPrimaryCardProvider,
      );
    if (teladocHealthPrimaryCardProvider)
      virtualHealthCareDetails.push(teladocHealthPrimaryCardProvider);
  }
  if (isHingeHealthEligible(visibilityRules)) {
    const hingeHealth = myHealthProgramsandResourcesDetails.get(
      HealthProgramsResourcesName.HingeHealthBackAndJointCare,
    );
    if (hingeHealth) virtualHealthCareDetails.push(hingeHealth);
  }
  if (isNurseChatEligible(visibilityRules)) {
    const nurseChat = myHealthProgramsandResourcesDetails.get(
      HealthProgramsResourcesName.TalkToNurse,
    );
    if (nurseChat) virtualHealthCareDetails.push(nurseChat);
  }
  if (isDiabetesManagementEligible(visibilityRules)) {
    const diabetesManagement = myHealthProgramsandResourcesDetails.get(
      HealthProgramsResourcesName.TeladocHealthDiabetesManagementProgram,
    );
    if (diabetesManagement) virtualHealthCareDetails.push(diabetesManagement);
  }
  if (isDiabetesPreventionEligible(visibilityRules)) {
    const diabetesPrevention = myHealthProgramsandResourcesDetails.get(
      HealthProgramsResourcesName.TeladocHealthDiabetesPreventionProgram,
    );
    if (diabetesPrevention) virtualHealthCareDetails.push(diabetesPrevention);
  }
  if (isCareManagementEligiblity(visibilityRules)) {
    const careManagement = myHealthProgramsandResourcesDetails.get(
      HealthProgramsResourcesName.CareTNOneOnOneHealthSupport,
    );
    if (careManagement) virtualHealthCareDetails.push(careManagement);
  }
  if (isTeladocSecondOpinionAdviceAndSupportEligible(visibilityRules)) {
    const teladocSecondOpinion = myHealthProgramsandResourcesDetails.get(
      HealthProgramsResourcesName.TeladocSecondOpinionAdviceAndSupport,
    );
    if (teladocSecondOpinion)
      virtualHealthCareDetails.push(teladocSecondOpinion);
  }

  if (isBloodPressureManagementEligible(visibilityRules!)) {
    const teladocBpmCard = myHealthProgramsandResourcesDetails.get(
      HealthProgramsResourcesName.TeladocHealthBloodPressureManagementProgram,
    );
    if (teladocBpmCard) {
      virtualHealthCareDetails.push(teladocBpmCard);
    }
  }
  if (isSilverAndFitnessEligible(visibilityRules!)) {
    const silverFitCard = myHealthProgramsandResourcesDetails.get(
      HealthProgramsResourcesName.SilverAndFitFitnessProgram,
    );
    if (silverFitCard) {
      virtualHealthCareDetails.push(silverFitCard);
    }
  }

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
