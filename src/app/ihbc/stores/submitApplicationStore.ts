import { formatDateToIntlLocale } from '@/utils/date_formatter';
import { createWithEqualityFn } from 'zustand/traditional';
import { callSubmitApplication } from '../actions/submitApplication';
import { BenefitChangeInfo } from '../models/BenefitChangeInfo';
import { InitialSelectionEnum } from '../models/InitialSelectionEnum';
import { SpecialEnrolmentEventEnum } from '../models/SpecialEnrolmentEventEnum';
import { TerminatePolicyEnum } from '../models/terminatePolicyEnum';
import { IHBCSchema } from '../rules/schema';
import { formatPlanId } from '../utils/request_creation_utils/plan_request_utils';
import { useBenefitSelectionStore } from './benefitSelectionStore';
import { useIhbcMainStore } from './ihbcMainStore';
import { useInitialSelectionStore } from './initialSelectionStore';
import { useNavigationStore } from './navigationStore';
import { useSpecialEnrolmentPeriodStore } from './specialEnrolmentPeriodStore';
import { useTerminatePolicyStore } from './terminatePolicyStore';

type State = {
  applicationId: string | undefined;
};

type Actions = {
  submitApplication: (formData: IHBCSchema) => Promise<void>;
  restartForm: () => void;
};

const initialState: State = {
  applicationId: undefined,
};

export const useSubmitApplicationStore = createWithEqualityFn<State & Actions>(
  (set, get) => ({
    ...initialState,
    submitApplication: async (data) => {
      try {
        const policyState = useBenefitSelectionStore.getState();
        const terminatePolicyState = useTerminatePolicyStore.getState();
        const initialSelectionState = useInitialSelectionStore.getState();
        const sepState = useSpecialEnrolmentPeriodStore.getState();
        const isOpenEnrollment = useIhbcMainStore.getState().isOEActive;

        //Compute Vision Plan
        const visionPlan =
          policyState.selectedVisionPlan ?? policyState.currentVisionPlan[0];

        //Compute Dental Plan
        const dentalPlan =
          policyState.selectedDentalPlan ?? policyState.currentDentalPlan[0];

        //Medical Plan
        const medicalPlan =
          policyState.selectedMedicalPlan ?? policyState.medicalPlan[0];

        const reqData: BenefitChangeInfo = {
          userId: undefined,
          applicationId: '',
          groupId: undefined,
          repId: '', // broker
          userType: '', // broker
          representativeName: '', // broker
          representativeEmail: '', // broker
          subscriberId: undefined, //
          subscriberLastName: undefined,
          subscriberFirstName: undefined,
          subscriberMiddleName: '',
          subscriberDateOfBirth: undefined,
          updatedSubscriberLastName:
            data.changePersonalInfo?.changeName?.lastName,
          updatedSubscriberFirstName:
            data.changePersonalInfo?.changeName?.firstName,
          updatedSubscriberMiddleName: '',
          subscriberReasonForNameChange:
            data.changePersonalInfo?.changeName?.reason,
          changePhoneInd: data.changePersonalInfo?.changePhone ? 'T' : 'F', // boolean
          emailAddress: data.changePersonalInfo?.changeEmailAddress,
          subscriberPolicyCancelDate:
            data.terminatePolicy?.terminatePrimaryApplicant?.terminationDate,
          subscriberPolicyCancelReason:
            data.terminatePolicy?.terminatePrimaryApplicant?.terminationReason,
          subscriberMedicalCancelDate:
            data.terminatePolicy?.cancelMedicalPolicy?.terminationDate,
          subscriberMedicalCancelReason:
            data.terminatePolicy?.cancelMedicalPolicy?.terminationReason,
          subscriberDentalCancelDate:
            data.terminatePolicy?.cancelDentalPolicy?.terminationDate,
          subscriberDentalCancelReason:
            data.terminatePolicy?.cancelDentalPolicy?.terminationReason,
          subscriberVisionCancelDate:
            data.terminatePolicy?.cancelVisionPolicy?.terminationDate,
          subscriberVisionCancelReason:
            data.terminatePolicy?.cancelVisionPolicy?.terminationReason,
          cancelDentalVisionInd: terminatePolicyState.selections.includes(
            TerminatePolicyEnum.keepDentalVisionPolicy,
          )
            ? 'F'
            : 'T',
          tobaccoUsageInd:
            data.changePersonalInfo?.changeTobaccoUse != null ? 'T' : 'F', //boolean
          tobaccoUsageSubscriberInd:
            data.changePersonalInfo?.changeTobaccoUse?.primaryApplicant == 'Y'
              ? 'T'
              : 'F',
          tobaccoUsageSpouseInd:
            data.changePersonalInfo?.changeTobaccoUse?.spouse == 'Y'
              ? 'T'
              : 'F',
          termSubscriberInd: data.terminatePolicy?.terminatePrimaryApplicant
            ? 'T'
            : 'F', //terminate
          termSubscriberNewIdRsnCd: '', // reason code
          termSubscriberNewIdRsnDesc: '',
          subscAddDelSecInd: undefined, // park
          termLifeCovInd: undefined, // looking
          addDelAncPrdInd: undefined, //add del ancillary vision/dental master checkbox ->49
          subscriberVisionInd: visionPlan != null ? 'T' : 'F', //
          subscriberVisionChangeInd:
            policyState.selectedVisionPlan != null ? 'T' : 'F', // to check
          subscriberVisionExamOnlyInd: undefined,
          subscriberVisExamMatrlsInd: undefined,
          dentalInd: dentalPlan != null ? 'T' : 'F',
          dentalAddInd: 'F', //check - 05/19
          dentalRemInd: 'F', //check - 05/19
          changeBenInd: initialSelectionState.selections.includes(
            InitialSelectionEnum.changeMyBenefits,
          )
            ? 'T'
            : 'F',
          benifitPlan: formatPlanId(medicalPlan?.planId), // plan name
          benefitNetwork: '', // *
          benefitChangeEventDate: sepState.selectedEffectiveDate,
          rsnOpenEnrollInd: isOpenEnrollment ? 'T' : 'F',
          rsnBrthAdpStrCrInd:
            sepState.event == SpecialEnrolmentEventEnum.birthOrAdoption
              ? 'T'
              : 'F',
          rsnPermanentMoveInd:
            sepState.event == SpecialEnrolmentEventEnum.permanentMove
              ? 'T'
              : 'F',
          rsnNonCalyrPolExpInd:
            sepState.event == SpecialEnrolmentEventEnum.lossOfCoverage
              ? 'T'
              : 'F',
          rsnMrgInd:
            sepState.event == SpecialEnrolmentEventEnum.marriage ? 'T' : 'F',
          rsnLossOfDepInd:
            sepState.event == SpecialEnrolmentEventEnum.lossOfDep ? 'T' : 'F',
          rsnLossOfMnHlthInd: undefined,
          rsnRedOfHrsInd: undefined,
          rsnGainDepInd:
            sepState.event == SpecialEnrolmentEventEnum.gainDep ? 'T' : 'F',
          rsnAccessToICHRAInd: undefined,
          stdEffGuidelinesInd: undefined, // to check
          firstMonthEffDateInd: undefined,
          eventDateInd: sepState.eventDate != null ? 'T' : 'F',
          firstDayMthFollowingSubmInd: undefined,
          changePInfoInd: data.changePersonalInfo != null ? 'T' : 'F', //personalInfo
          changeNameInd:
            data.changePersonalInfo?.changeName != null ? 'T' : 'F',
          changeEmailAddrInd:
            data.changePersonalInfo?.changeEmailAddress != null ? 'T' : 'F',
          subscriberDaytimePhone: 'string',
          termPolicyInd: initialSelectionState.selections.includes(
            InitialSelectionEnum.terminatePolicy,
          )
            ? 'T'
            : 'F',
          addRemDepInd:
            initialSelectionState.selections.includes(
              InitialSelectionEnum.addDeps,
            ) ||
            initialSelectionState.selections.includes(
              InitialSelectionEnum.terminateDeps,
            )
              ? 'Y'
              : 'N',
          applSubmittedDate: formatDateToIntlLocale(new Date()),
          applStatusCode: 'string',
          medicalRatePerMonth: medicalPlan ? +medicalPlan.rate! : undefined,
          dentalRatePerMonth: dentalPlan ? +dentalPlan.rate! : undefined,
          visionRatePerMonth: visionPlan ? +visionPlan.rate! : undefined,
          dependents: undefined,
          addresses: undefined, // residence, billing, etc
          planSearchMembers: [], // members on plan
          updated: undefined,
          action: undefined,
          medicalPlanName: medicalPlan?.planName,
          dentalPlanName: dentalPlan?.planName,
          visionPlanName: visionPlan?.planName,
          changePolicyind: undefined,
          changeAddressind:
            data.changePersonalInfo?.changeAddress != null ? 'T' : 'F',
          visionDelInd:
            data.terminatePolicy?.cancelVisionPolicy != null ? 'T' : 'F', //cancel vision
          medicalSBCLoc: medicalPlan?.SBCLocation, // medical plan info
          dentalSBCLoc: dentalPlan?.SBCLocation, // dental plan
          visionSBCLoc: visionPlan?.SBCLocation, //vision plan
          serviceError: undefined,
        };
        const resp = await callSubmitApplication(reqData, data);
        console.log('Benefit Change Info resp', resp);
        if (!resp) {
          throw 'error occurred';
        }
        console.log('Form Data', data);
        set({ applicationId: resp?.applicationId });
      } catch (err) {
        console.error('Submit Application Failed');
        throw err;
      }
    },
    restartForm: () => {
      //TODO: Reset all stores
      useNavigationStore.getState().restart();
    },
  }),
);
