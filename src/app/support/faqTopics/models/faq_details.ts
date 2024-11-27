import { ReactNode } from 'react';

export interface FAQDetails {
  serviceTitle: string;
  serviceLabel: string;
  para1: JSX.Element | string | string[];
  bulletPoints: JSX.Element[] | ReactNode[];
  para2: JSX.Element | string;
}

export interface FaqHeaderCardDetails {
  title: string;
  description: string;
}

export interface FaqTopicDetails {
  topicType: FaqTopicType;
  faqTopicHeaderDetails: FaqHeaderCardDetails;
  faqTopCardDetails: FAQDetails[];
  faqSecondCardDetails?: FAQDetails[];
  faqThirdCardDetails?: FAQDetails[];
  faqType?: string;
}

export enum FaqTopicType {
  BenefitsAndCoverage = 'Benefits & Coverage',
  Claims = 'Claims',
  IdCards = 'ID Cards',
  MyPlanInformation = 'My Plan Information',
  Pharmacy = 'Pharmacy',
  PriorAuthorization = 'Prior Authorization',
  SharingPermisionsSecurity = 'Sharing, Permissions & Security',
}
