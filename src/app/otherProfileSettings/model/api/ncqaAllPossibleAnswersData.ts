import { EnglishAbilityDetails } from './englishAbility';
import { EthinicityDetails } from './ethinicity';
import { LangauageDetails } from './language';
import { RaceDetails } from './race';

export interface NCQAAllPossibleAnswers {
  ethnicityCodes: EthinicityDetails[];
  raceCodes: RaceDetails[];
  englishAbilityCodes: EnglishAbilityDetails[];
  languageCodes: LangauageDetails[];
  [key: string]: unknown;
}
