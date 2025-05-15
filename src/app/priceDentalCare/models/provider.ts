import { Network } from './network';

export interface Provider {
  id: string | null;
  nationalId: string | null;
  name: string | null;
  address1: string | null;
  address2: string | null;
  city: string | null;
  state: string | null;
  zipcode: string | null;
  phoneNumber: string | null;
  officeHours: string[] | null;
  licenseType: string | null;
  licenseNumber: string | null;
  miscellaneousText: string | null;
  bpnIdentifier: string | null;
  pcpIndicator: string | null;
  network: Network | null;
  specialty: Specialty | null;
  type: ProviderType | null;
  county: County | null;
  languages: Language[] | null;
}

export interface Specialty {
  specialtyCode: string;
  specialtyDesc: string;
}

export interface County {
  countyCode: string;
  countyName: string;
}

export interface Language {
  languageCode: string;
  languageDescription: string;
}

export interface ProviderType {
  providerTypeCode: string;
  providerTypeDescription: string;
}
