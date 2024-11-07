import { ReactNode } from 'react';

export interface FAQDetails {
  serviceTitle: string;
  serviceLabel: string;
  answerline1: JSX.Element | string | string[];
  answerline2: JSX.Element[] | ReactNode[];
  answerline3: JSX.Element | string;
}
