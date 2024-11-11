import { ReactNode } from 'react';

export interface FAQDetails {
  serviceTitle: string;
  serviceLabel: string;
  answerLine1: JSX.Element | string | string[];
  answerLine2: JSX.Element[] | ReactNode[];
  answerLine3: JSX.Element | string;
}

export interface FaqHeaderCardDetails {
  title: string;
  description: string;
}

export interface FaqTopicDetails {
  topicType: FaqTopicType;
  faqTopicHeaderDetails: FaqHeaderCardDetails;
  faqTopCardDetails: FAQDetails[];
  faqBottomCardDetails?: FAQDetails[];
  faqType?: string;
}

export enum FaqTopicType {
  BenefitsAndCoverage = 'BenefitsAndCoverage',
  Claims = 'Claims',
  IdCards = 'IdCards',
  MyPlanInformation = 'MyPlanInformation',
  Pharmacy = 'Pharmacy',
  PriorAuthorization = 'PriorAuthorization',
  SharingPermisionsSecurity = 'SharingPermisionsSecurity',
}

export const OtherFaqTopicDetails = [
  'Benefits & Coverage',
  'Claims',
  'ID Cards',
  'My Plan Information',
  'Pharmacy',
  'Prior Authorization',
  'Sharing, Permissions & Security',
];
