import { ReactElement } from 'react';

export interface BenefitDetails {
  benefitIcon?: ReactElement | null;
  benefitLabel: string;
  benefitCopy: string;
}
