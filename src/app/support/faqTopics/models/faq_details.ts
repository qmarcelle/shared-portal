import { ReactNode } from 'react';

export interface FAQDetails {
  serviceTitle: string;
  serviceLabel: string;
  answerLine1: JSX.Element | string | string[];
  answerLine2: JSX.Element[] | ReactNode[];
  answerLine3: JSX.Element | string;
}
