import { ReactElement } from 'react';

export interface ServiceDetails {
  serviceIcon?: ReactElement | null;
  serviceLabel: string;
  serviceSubLabel: string;
  serviceSubLabelValue: number;
  serviceCode?: string;
  labelText1: string;
  labelValue1: number;
  labelText2: string;
  labelValue2: number;
  labelText3: string;
  labelValue3: number;
}
