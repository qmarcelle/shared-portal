import { ReactElement } from 'react';

export interface FAQDetails {
  serviceIcon?: ReactElement | null;
  serviceLabel: string;
  answerline1: JSX.Element | string;
  answerline2: JSX.Element | string;
}
