import { ReactElement } from 'react';

export interface LinkDetails {
  linkIcon?: ReactElement | null;
  linkDescription: string;
  linkTitle: string;
  linkURL?: string;
  isHidden?: boolean;
}
