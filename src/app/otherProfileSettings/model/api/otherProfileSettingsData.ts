import { NCQAAllPossibleAnswers } from './ncqaAllPossibleAnswersData';
import { NCQASelectedAnswers } from './ncqaSelectedData';

export interface OtherProfileSettingsData {
  healthEquityPossibleAnswersData: NCQAAllPossibleAnswers | null;
  healthEquitySelectedAnswersData: NCQASelectedAnswers | null;
}
