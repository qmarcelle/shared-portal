import { ReactNode } from 'react';

export interface FAQDetails {
  serviceTitle: string;
  serviceLabel: string;
  para1: JSX.Element | string | string[];
  bulletPoints: JSX.Element[] | ReactNode[];
  para2: string;
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
