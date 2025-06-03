import { EnglishAbilityDetails } from './englishAbility';
import { EthinicityDetails } from './ethinicity';
import { LangauageDetails } from './language';
import { SelectedRaceDetails } from './selectedRace';

export interface NCQASelectedAnswers {
  ethnicities: EthinicityDetails[];
  races: SelectedRaceDetails[];
  englishAbilities: EnglishAbilityDetails[];
  spokenLanguages: LangauageDetails[];
  writtenLanguages: LangauageDetails[];
}
