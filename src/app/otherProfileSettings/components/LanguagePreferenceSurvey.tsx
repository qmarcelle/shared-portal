import { Card } from '@/components/foundation/Card';
import { Spacer } from '@/components/foundation/Spacer';
import { TextBox } from '@/components/foundation/TextBox';
import { IComponent } from '@/components/IComponent';
import { Session } from 'next-auth';
import { useState } from 'react';
import {
  getHealthEquitySelectedAnswers,
  updateHealthEquityPreference,
} from '../actions/getNCQAInfo';
import { NCQAAllPossibleAnswers } from '../model/api/ncqaAllPossibleAnswersData';
import { NCQASelectedAnswers } from '../model/api/ncqaSelectedData';
import { UpdateHealthEquityPreferenceRequest } from '../model/api/updateHealthEquityPreferenceRequest';
import { OptionData, UpdateRowForm } from './UpdateRowForm';

export type LanguageSurveyProps = {
  languageSurveyAllDetails?: NCQAAllPossibleAnswers | null;
  languageSurveySelectedDetails?: NCQASelectedAnswers | null;
  sessionData: Session | null;
} & IComponent;

export const LanguagePreferenceSurvey = ({
  languageSurveyAllDetails,
  languageSurveySelectedDetails,
  sessionData,
}: LanguageSurveyProps) => {
  const [
    memberLanguageSurveySelectedDetails,
    setmemberLanguageSurveySelectedDetails,
  ] = useState(languageSurveySelectedDetails);

  const selectedEnglishAbilityData: OptionData[] = [];
  memberLanguageSurveySelectedDetails?.englishAbilities?.map((item) => {
    selectedEnglishAbilityData.push({
      code: item.ncqaEnglishAbilityCode,
      label: item.ncqaEnglishAbilityDesc,
      enabled: true,
    });
  });

  const englishAbiliyList: OptionData[] = [];
  languageSurveyAllDetails?.englishAbilityCodes?.map((item) => {
    const setEnabled =
      item.ncqaEnglishAbilityCode === selectedEnglishAbilityData[0]?.code
        ? true
        : false;
    englishAbiliyList.push({
      code: item.ncqaEnglishAbilityCode,
      label: item.ncqaEnglishAbilityDesc,
      enabled: setEnabled,
    });
  });

  const isEnglishAbilitySelected =
    selectedEnglishAbilityData.length == 0 ? false : true;

  const [engEligibilityOptionChange, setengEligibilityOptionChange] =
    useState(englishAbiliyList);
  const [showEnglishAbilitiesAllOptions, setShowEnglishAbilitiesAllOptions] =
    useState(false);
  const showAllEnglishAbilitiesCancelCallBack = () => {
    setShowEnglishAbilitiesAllOptions(false);
  };

  const selectedEnglishAbilitiesUpdateCallBack = () => {
    engEligibilityOptionChange.forEach((item) => (item.enabled = false));
    const originalEngEligibilityItem = engEligibilityOptionChange.find(
      (item) => item.code === selectedEnglishAbilityData[0]?.code,
    );
    if (originalEngEligibilityItem) {
      originalEngEligibilityItem.enabled = true;
    }
    setengEligibilityOptionChange([...engEligibilityOptionChange]);
    setShowEnglishAbilitiesAllOptions(true);
  };
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  function updateEnglishEligibilityRadioButtonSelection(val: any) {
    engEligibilityOptionChange.forEach((item) => (item.enabled = false));
    const selectedEngEligibilityItem = engEligibilityOptionChange.find(
      (item) => item.code === val,
    );
    if (selectedEngEligibilityItem) {
      selectedEngEligibilityItem.enabled = true;
    }
    setengEligibilityOptionChange([...engEligibilityOptionChange]);
  }

  async function updateEnglishAbilityDetails() {
    const newEnglishAbilityDetails = engEligibilityOptionChange.find(
      (item) => item.enabled == true,
    );
    const englishEligibilityPreferenceRequest: Partial<UpdateHealthEquityPreferenceRequest> =
      {};

    if (newEnglishAbilityDetails && newEnglishAbilityDetails.code)
      englishEligibilityPreferenceRequest.engAbilityCode =
        newEnglishAbilityDetails.code;

    const englishEligibilityResponse = await updateHealthEquityPreference(
      englishEligibilityPreferenceRequest,
    );
    if (englishEligibilityResponse.status == 200) {
      languageSurveySelectedDetails =
        await getHealthEquitySelectedAnswers(sessionData);
      setmemberLanguageSurveySelectedDetails(languageSurveySelectedDetails);
      setShowEnglishAbilitiesAllOptions(false);
    } else {
      setShowEnglishAbilitiesAllOptions(true);
    }
  }

  const selectedSpokenLanguageData: OptionData[] = [];
  const selectedSpokenLanguageTextData: OptionData[] = [];
  let isSpokenLanguageDeclineSelected = false;
  memberLanguageSurveySelectedDetails?.spokenLanguages?.map((item) => {
    selectedSpokenLanguageData.push({
      code: item.ncqaLanguageCode,
      label: item.ncqaLanguageDesc,
      enabled: true,
    });
    isSpokenLanguageDeclineSelected =
      item.ncqaLanguageCode.trim() === 'Z2' ? true : false;
  });
  if (
    selectedSpokenLanguageData.length > 0 &&
    !isSpokenLanguageDeclineSelected
  ) {
    selectedSpokenLanguageTextData.push({
      code: selectedSpokenLanguageData[0].code,
      label: selectedSpokenLanguageData[0].label,
      enabled: true,
    });
  }

  const isSpokenLanguageSelected =
    selectedSpokenLanguageData.length == 0 ? false : true;

  const [spokenLanguageEmptySelect, setSpokenLanguageEmptySelect] = useState(
    selectedSpokenLanguageData.length == 0 ? false : true,
  );

  const [showSpokenLanguageAllOptions, setShowSpokenLanguageAllOptions] =
    useState(false);

  const [spokenLanguageTextOptionChange, setSpokenLanguageTextOptionChange] =
    useState(selectedSpokenLanguageTextData);

  const [spokenLanguageOptionChange, setSpokenLanguageOptionChange] = useState(
    isSpokenLanguageDeclineSelected,
  );

  const [validSpokenLanguage, setvalidSpokenLanguage] = useState(true);

  const showAllSpokenLanguageCancelCallBack = () => {
    setvalidSpokenLanguage(true);
    setShowSpokenLanguageAllOptions(false);
    setSpokenLanguageTextOptionChange([]);
  };

  const selectedSpokenLanguageUpdateCallBack = () => {
    setvalidSpokenLanguage(true);
    if (selectedSpokenLanguageData[0]?.code.trim() === 'Z2') {
      isSpokenLanguageDeclineSelected = true;
    } else {
      isSpokenLanguageDeclineSelected = false;
      spokenLanguageTextOptionChange[0] = selectedSpokenLanguageData[0];
      setSpokenLanguageTextOptionChange([...spokenLanguageTextOptionChange]);
    }
    setSpokenLanguageOptionChange(isSpokenLanguageDeclineSelected);
    setShowSpokenLanguageAllOptions(true);
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  function updateSpokenLangRadioButtonSelection(val: any) {
    setSpokenLanguageEmptySelect(true);
    if (val === 'Z2') {
      isSpokenLanguageDeclineSelected = true;
      setvalidSpokenLanguage(true);
      setSpokenLanguageTextOptionChange([]);
    } else {
      isSpokenLanguageDeclineSelected = false;
    }
    setSpokenLanguageOptionChange(isSpokenLanguageDeclineSelected);
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  function updateSpokenLanguageTextField(val: any) {
    setvalidSpokenLanguage(true);
    const selectedSpokenLanguageitem = languageSurveyAllDetails?.languageCodes
      ?.filter((item) => item.ncqaLanguageCode.trim() !== 'Z2')
      .find(
        (item) => item.ncqaLanguageDesc.toLowerCase() === val.toLowerCase(),
      );
    const selectedSpokenLang: OptionData[] = [];
    selectedSpokenLang.push({
      code: selectedSpokenLanguageitem?.ncqaLanguageCode ?? '',
      label: val,
      enabled: true,
    });
    spokenLanguageTextOptionChange[0] = selectedSpokenLang[0];
    setSpokenLanguageTextOptionChange([...spokenLanguageTextOptionChange]);
  }

  function updateSpokenLanguageDetails() {
    if (spokenLanguageOptionChange) {
      setvalidSpokenLanguage(true);
      updateSpokenLanguage('Z2');
    } else {
      if (spokenLanguageTextOptionChange.length == 0)
        setvalidSpokenLanguage(false);
      else {
        if (spokenLanguageTextOptionChange[0].code === '')
          setvalidSpokenLanguage(false);
        else {
          updateSpokenLanguage(spokenLanguageTextOptionChange[0].code);
        }
      }
    }
  }

  async function updateSpokenLanguage(code: string) {
    const spokenLanguagePreferenceRequest: Partial<UpdateHealthEquityPreferenceRequest> =
      {};

    if (code) spokenLanguagePreferenceRequest.spokenlanguageCode = code;

    const spokenLanguageResponse = await updateHealthEquityPreference(
      spokenLanguagePreferenceRequest,
    );
    if (spokenLanguageResponse.status == 200) {
      languageSurveySelectedDetails =
        await getHealthEquitySelectedAnswers(sessionData);
      setmemberLanguageSurveySelectedDetails(languageSurveySelectedDetails);
      setShowSpokenLanguageAllOptions(false);
    } else {
      setShowSpokenLanguageAllOptions(true);
    }
  }

  const selectedReadLanguageData: OptionData[] = [];
  const selectedReadLanguageTextData: OptionData[] = [];
  let isReadLanguageDeclineSelected = false;
  memberLanguageSurveySelectedDetails?.writtenLanguages?.map((item) => {
    selectedReadLanguageData.push({
      code: item.ncqaLanguageCode,
      label: item.ncqaLanguageDesc,
      enabled: true,
    });
    isReadLanguageDeclineSelected =
      item.ncqaLanguageCode.trim() === 'Z2' ? true : false;
  });

  if (selectedReadLanguageData.length > 0 && !isReadLanguageDeclineSelected) {
    selectedReadLanguageTextData.push({
      code: selectedReadLanguageData[0].code,
      label: selectedReadLanguageData[0].label,
      enabled: true,
    });
  }

  const isReadLanguageSelected =
    selectedReadLanguageData.length == 0 ? false : true;

  const [readLanguageEmptySelect, setReadLanguageEmptySelect] = useState(
    selectedReadLanguageData.length == 0 ? false : true,
  );

  const [showReadLanguageAllOptions, setShowReadLanguageAllOptions] =
    useState(false);

  const [readLanguageTextOptionChange, setReadLanguageTextOptionChange] =
    useState(selectedReadLanguageTextData);

  const [readLanguageOptionChange, setReadLanguageOptionChange] = useState(
    isReadLanguageDeclineSelected,
  );

  const [validReadLanguage, setvalidReadLanguage] = useState(true);

  const showAllReadLanguageCancelCallBack = () => {
    setReadLanguageTextOptionChange([]);
    setvalidReadLanguage(true);
    setShowReadLanguageAllOptions(false);
  };

  const selectedReadLanguageUpdateCallBack = () => {
    setvalidReadLanguage(true);
    if (selectedReadLanguageData[0]?.code.trim() === 'Z2') {
      isReadLanguageDeclineSelected = true;
    } else {
      isReadLanguageDeclineSelected = false;
      readLanguageTextOptionChange[0] = selectedReadLanguageData[0];
      setReadLanguageTextOptionChange([...readLanguageTextOptionChange]);
    }
    setReadLanguageOptionChange(isReadLanguageDeclineSelected);
    setShowReadLanguageAllOptions(true);
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  function updateReadLangRadioButtonSelection(val: any) {
    setReadLanguageEmptySelect(true);
    if (val === 'Z2') {
      isReadLanguageDeclineSelected = true;
      setvalidReadLanguage(true);
      setReadLanguageTextOptionChange([]);
    } else {
      isReadLanguageDeclineSelected = false;
    }
    setReadLanguageOptionChange(isReadLanguageDeclineSelected);
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  function updateReadLanguageTextField(val: any) {
    setvalidReadLanguage(true);
    const selectedReadLanguageitem = languageSurveyAllDetails?.languageCodes
      ?.filter((item) => item.ncqaLanguageCode.trim() !== 'Z2')
      .find(
        (item) => item.ncqaLanguageDesc.toLowerCase() === val.toLowerCase(),
      );

    const selectedReadLang: OptionData[] = [];

    selectedReadLang.push({
      code: selectedReadLanguageitem?.ncqaLanguageCode ?? '',
      label: val,
      enabled: true,
    });
    readLanguageTextOptionChange[0] = selectedReadLang[0];
    setReadLanguageTextOptionChange([...readLanguageTextOptionChange]);
  }

  function updateReadLanguageDetails() {
    if (readLanguageOptionChange) {
      setvalidReadLanguage(true);
      updateReadLanguage('Z2');
    } else {
      if (readLanguageTextOptionChange.length == 0) setvalidReadLanguage(false);
      else {
        if (readLanguageTextOptionChange[0].code === '')
          setvalidReadLanguage(false);
        else {
          updateReadLanguage(readLanguageTextOptionChange[0].code);
        }
      }
    }
  }

  async function updateReadLanguage(code: string) {
    const readLanguagePreferenceRequest: Partial<UpdateHealthEquityPreferenceRequest> =
      {};

    if (code) readLanguagePreferenceRequest.writtenlanguageCode = code;

    const readLanguageResponse = await updateHealthEquityPreference(
      readLanguagePreferenceRequest,
    );
    if (readLanguageResponse.status == 200) {
      languageSurveySelectedDetails =
        await getHealthEquitySelectedAnswers(sessionData);
      setmemberLanguageSurveySelectedDetails(languageSurveySelectedDetails);
      setShowReadLanguageAllOptions(false);
    } else {
      setShowReadLanguageAllOptions(true);
    }
  }

  return (
    <Card className="large-section">
      <div className="flex flex-col">
        {selectedEnglishAbilityData.length > 0 &&
          !showEnglishAbilitiesAllOptions && (
            <UpdateRowForm
              label={
                <TextBox
                  className="font-bold"
                  text="How well do you speak English?"
                />
              }
              subLabel=""
              enabled={false}
              saveCallback={selectedEnglishAbilitiesUpdateCallBack}
              type="currentselection"
              optionObjects={selectedEnglishAbilityData}
              divider={true}
            />
          )}
        {(selectedEnglishAbilityData.length == 0 ||
          showEnglishAbilitiesAllOptions) && (
          <UpdateRowForm
            label={
              <TextBox
                className="font-bold"
                text="How well do you speak English?"
              />
            }
            subLabel=""
            enabled={false}
            saveCallback={updateEnglishAbilityDetails}
            cancelCallback={showAllEnglishAbilitiesCancelCallBack}
            optionsEnabled={isEnglishAbilitySelected}
            type="radio"
            optionObjects={engEligibilityOptionChange}
            divider={true}
            selectionCallBack={updateEnglishEligibilityRadioButtonSelection}
          />
        )}
        <Spacer size={32} />
        {selectedSpokenLanguageData.length > 0 &&
          !showSpokenLanguageAllOptions && (
            <UpdateRowForm
              label={
                <TextBox
                  className="font-bold"
                  text="What language are you most comfortable using when speaking with your doctor?"
                />
              }
              subLabel=""
              enabled={false}
              saveCallback={selectedSpokenLanguageUpdateCallBack}
              type="currentselection"
              optionObjects={selectedSpokenLanguageData}
              divider={true}
            />
          )}
        {(selectedSpokenLanguageData.length == 0 ||
          showSpokenLanguageAllOptions) && (
          <UpdateRowForm
            label={
              <TextBox
                className="font-bold"
                text="What language are you most comfortable using when speaking with your doctor?"
              />
            }
            subLabel=""
            enabled={false}
            saveCallback={updateSpokenLanguageDetails}
            cancelCallback={showAllSpokenLanguageCancelCallBack}
            type="textbox"
            optionObjects={
              !spokenLanguageOptionChange ? spokenLanguageTextOptionChange : []
            }
            optionsEnabled={isSpokenLanguageSelected}
            isDeclineLanguageSelected={spokenLanguageOptionChange}
            languageOptions={languageSurveyAllDetails?.languageCodes
              ?.filter((item) => item.ncqaLanguageCode.trim() !== 'Z2')
              .sort((a, b) =>
                a.ncqaLanguageDesc.localeCompare(b.ncqaLanguageDesc),
              )}
            divider={true}
            selectionCallBack={updateSpokenLangRadioButtonSelection}
            languageSelectionCallBack={updateSpokenLanguageTextField}
            validLanguage={validSpokenLanguage}
            languageEmptySelect={spokenLanguageEmptySelect}
          />
        )}
        <Spacer size={32} />
        {selectedReadLanguageData.length > 0 && !showReadLanguageAllOptions && (
          <UpdateRowForm
            label={
              <TextBox
                className="font-bold"
                text="What language do you prefer to read?"
              />
            }
            subLabel=""
            enabled={false}
            saveCallback={selectedReadLanguageUpdateCallBack}
            type="currentselection"
            optionObjects={selectedReadLanguageData}
            divider={false}
          />
        )}
        {(selectedReadLanguageData.length == 0 ||
          showReadLanguageAllOptions) && (
          <UpdateRowForm
            label={
              <TextBox
                className="font-bold"
                text="What language do you prefer to read?"
              />
            }
            subLabel="Note: Not all of our materials are available in all languages right now. We're asking to find out which languages our members use most."
            enabled={false}
            saveCallback={updateReadLanguageDetails}
            cancelCallback={showAllReadLanguageCancelCallBack}
            type="textbox"
            optionObjects={
              !readLanguageOptionChange ? readLanguageTextOptionChange : []
            }
            optionsEnabled={isReadLanguageSelected}
            isDeclineLanguageSelected={readLanguageOptionChange}
            languageOptions={languageSurveyAllDetails?.languageCodes
              ?.filter((item) => item.ncqaLanguageCode.trim() !== 'Z2')
              .sort((a, b) =>
                a.ncqaLanguageDesc.localeCompare(b.ncqaLanguageDesc),
              )}
            divider={false}
            selectionCallBack={updateReadLangRadioButtonSelection}
            languageSelectionCallBack={updateReadLanguageTextField}
            validLanguage={validReadLanguage}
            languageEmptySelect={readLanguageEmptySelect}
          />
        )}
      </div>
    </Card>
  );
};
