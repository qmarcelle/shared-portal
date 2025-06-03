import { Address } from './Address';
import { Dependent } from './Dependent';
import { PlanSearchMember } from './PlanSearchMember';
import { ServiceError } from './service_responses/ServiceError';

export interface BenefitChangeInfo {
  userId: string | undefined;
  applicationId: string | undefined;
  groupId: string | undefined;
  repId: string | undefined; // broker
  userType: string | undefined; // broker
  representativeName: string | undefined; // broker
  representativeEmail: string | undefined; // broker
  subscriberId: string | undefined; //
  subscriberLastName: string | undefined;
  subscriberFirstName: string | undefined;
  subscriberMiddleName: string | undefined;
  subscriberDateOfBirth: string | undefined;
  updatedSubscriberLastName: string | undefined;
  updatedSubscriberFirstName: string | undefined;
  updatedSubscriberMiddleName: string | undefined;
  subscriberReasonForNameChange: string | undefined;
  changePhoneInd: string | undefined; // string
  emailAddress: string | undefined;
  subscriberPolicyCancelDate: string | undefined;
  subscriberPolicyCancelReason: string | undefined;
  subscriberMedicalCancelDate: string | undefined;
  subscriberMedicalCancelReason: string | undefined;
  subscriberDentalCancelDate: string | undefined;
  subscriberDentalCancelReason: string | undefined;
  subscriberVisionCancelDate: string | undefined;
  subscriberVisionCancelReason: string | undefined;
  cancelDentalVisionInd: string | undefined;
  tobaccoUsageInd: string | undefined; //string
  tobaccoUsageSubscriberInd: string | undefined;
  tobaccoUsageSpouseInd: string | undefined;
  termSubscriberInd: string | undefined; //terminate
  termSubscriberNewIdRsnCd: string | undefined; // reason code
  termSubscriberNewIdRsnDesc: string | undefined;
  subscAddDelSecInd: string | undefined; // park
  termLifeCovInd: string | undefined; // looking
  addDelAncPrdInd: string | undefined; //add del ancillary vision/dental master checkbox ->49
  subscriberVisionInd: string | undefined; //
  subscriberVisionChangeInd: string | undefined; // to check
  subscriberVisionExamOnlyInd: string | undefined;
  subscriberVisExamMatrlsInd: string | undefined;
  dentalInd: string | undefined;
  dentalAddInd: string | undefined;
  dentalRemInd: string | undefined;
  changeBenInd: string | undefined;
  benifitPlan: string | undefined; // plan name
  benefitNetwork: string | undefined; // *
  benefitChangeEventDate: string | undefined;
  rsnOpenEnrollInd: string | undefined;
  rsnBrthAdpStrCrInd: string | undefined;
  rsnPermanentMoveInd: string | undefined;
  rsnNonCalyrPolExpInd: string | undefined;
  rsnMrgInd: string | undefined;
  rsnLossOfDepInd: string | undefined;
  rsnLossOfMnHlthInd: string | undefined;
  rsnRedOfHrsInd: string | undefined;
  rsnGainDepInd: string | undefined;
  rsnAccessToICHRAInd: string | undefined;
  stdEffGuidelinesInd: string | undefined; // to check
  firstMonthEffDateInd: string | undefined;
  eventDateInd: string | undefined;
  firstDayMthFollowingSubmInd: string | undefined;
  changePInfoInd: string | undefined; //personalInfo
  changeNameInd: string | undefined;
  changeEmailAddrInd: string | undefined;
  subscriberDaytimePhone: string | undefined;
  termPolicyInd: string | undefined;
  addRemDepInd: string | undefined;
  applSubmittedDate: string | undefined;
  applStatusCode: string | undefined;
  medicalRatePerMonth: number | undefined;
  dentalRatePerMonth: number | undefined;
  visionRatePerMonth: number | undefined;
  dependents: Partial<Dependent>[] | undefined;
  addresses: Address[] | undefined; // residence, billing, etc
  planSearchMembers: Partial<PlanSearchMember>[] | undefined; // members on plan
  updated: string | undefined;
  action: string | undefined;
  medicalPlanName: string | undefined;
  dentalPlanName: string | undefined;
  visionPlanName: string | undefined;
  changePolicyind: string | undefined;
  changeAddressind: string | undefined;
  visionDelInd: string | undefined; //cancel vision
  medicalSBCLoc: string | undefined; // medical plan info
  dentalSBCLoc: string | undefined; // dental plan
  visionSBCLoc: string | undefined; //vision plan
  serviceError?: ServiceError | undefined;
}
