import { Card } from '@/components/foundation/Card';
import { Column } from '@/components/foundation/Column';
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

export type RaceAndEthnicityProps = {
  raceAndEthnicityAllDetails?: NCQAAllPossibleAnswers | null;
  raceAndEthnicitySelectedDetails?: NCQASelectedAnswers | null;
  sessionData: Session | null;
} & IComponent;

export const RaceAndEthnicitySurvey = ({
  raceAndEthnicityAllDetails,
  raceAndEthnicitySelectedDetails,
  sessionData,
}: RaceAndEthnicityProps) => {
  const [
    memberRaceandEthicinitySelectedDetails,
    setmemberRaceandEthicinitySelectedDetails,
  ] = useState(raceAndEthnicitySelectedDetails);

  const selectedEthnicityData: OptionData[] = [];
  memberRaceandEthicinitySelectedDetails?.ethnicities?.map((item) => {
    selectedEthnicityData.push({
      code: item.ncqaEthnicityCode,
      label: item.ncqaEthnicityDesc,
      enabled: true,
    });
  });

  const ethnicityList: OptionData[] = [];
  raceAndEthnicityAllDetails?.ethnicityCodes?.map((item) => {
    const setEnabled =
      item.ncqaEthnicityCode === selectedEthnicityData[0]?.code ? true : false;
    ethnicityList.push({
      code: item.ncqaEthnicityCode,
      label: item.ncqaEthnicityDesc,
      enabled: setEnabled,
    });
  });

  const isEthnicitySelected = selectedEthnicityData.length == 0 ? false : true;

  const [ethnicityOptionChange, setEthnicityOptionChange] =
    useState(ethnicityList);

  const [showEthnicityAllOptions, setShowEthnicityAllOptions] = useState(false);

  const showAllEthnicityCancelCallBack = () => {
    setShowEthnicityAllOptions(false);
  };

  const selectedEthnicityUpdateCallBack = () => {
    ethnicityOptionChange.forEach((item) => (item.enabled = false));
    const originalEthnicityItem = ethnicityOptionChange.find(
      (item) => item.code === selectedEthnicityData[0]?.code,
    );
    if (originalEthnicityItem) {
      originalEthnicityItem.enabled = true;
    }
    setEthnicityOptionChange([...ethnicityOptionChange]);
    setShowEthnicityAllOptions(true);
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  function updateEthnicityRadioButtonSelection(val: any) {
    ethnicityOptionChange.forEach((item) => (item.enabled = false));
    const selectedEthnicityItem = ethnicityOptionChange.find(
      (item) => item.code === val,
    );
    if (selectedEthnicityItem) {
      selectedEthnicityItem.enabled = true;
    }
    setEthnicityOptionChange([...ethnicityOptionChange]);
  }

  async function updateEthinincityDetails() {
    const newEthnicityDetails = ethnicityOptionChange.find(
      (item) => item.enabled == true,
    );
    const ethinincityPreferenceRequest: Partial<UpdateHealthEquityPreferenceRequest> =
      {};

    if (newEthnicityDetails && newEthnicityDetails.code)
      ethinincityPreferenceRequest.ethnicityCode = newEthnicityDetails.code;

    const ethnicityResponse = await updateHealthEquityPreference(
      ethinincityPreferenceRequest,
    );
    if (ethnicityResponse.status == 200) {
      raceAndEthnicitySelectedDetails =
        await getHealthEquitySelectedAnswers(sessionData);
      setmemberRaceandEthicinitySelectedDetails(
        raceAndEthnicitySelectedDetails,
      );
      setShowEthnicityAllOptions(false);
    } else {
      setShowEthnicityAllOptions(true);
    }
  }

  const selectedRaceData: OptionData[] = [];
  if (
    memberRaceandEthicinitySelectedDetails &&
    memberRaceandEthicinitySelectedDetails.races &&
    Array.isArray(memberRaceandEthicinitySelectedDetails.races)
  ) {
    const memberSelectedRaceDetails =
      memberRaceandEthicinitySelectedDetails?.races[0];

    for (
      let i = 1;
      memberSelectedRaceDetails[`ncqaRaceCode${i}`] !== undefined;
      i++
    ) {
      const codeKey = `ncqaRaceCode${i}`;
      const descKey = `ncqaRaceDesc${i}`;
      if (
        memberSelectedRaceDetails[codeKey] != null &&
        memberSelectedRaceDetails[descKey] != null
      ) {
        selectedRaceData.push({
          code: memberSelectedRaceDetails[codeKey] as string,
          label: memberSelectedRaceDetails[descKey] as string,
          enabled: true,
        });
      }
    }
  }

  const raceList: OptionData[] = [];
  raceAndEthnicityAllDetails?.raceCodes?.map((item) => {
    const code = item.ncqaRaceCode;
    let setEnabled = false;
    for (let j = 0; j < selectedRaceData.length; j++) {
      if (code === selectedRaceData[j].code) setEnabled = true;
    }
    raceList.push({
      code: item.ncqaRaceCode,
      label: item.ncqaRaceDesc,
      enabled: setEnabled,
    });
  });

  const isRaceSelected = selectedRaceData.length == 0 ? false : true;
  const [raceOptionChange, setRaceOptionChange] = useState(raceList);
  const [showRaceAllOptions, setShowRaceAllOptions] = useState(false);

  const selectedRaceUpdateCallBack = () => {
    raceOptionChange.forEach((item) => (item.enabled = false));
    raceOptionChange.map((item) => {
      for (let j = 0; j < selectedRaceData.length; j++) {
        if (item.code === selectedRaceData[j].code) item.enabled = true;
      }
    });

    setRaceOptionChange([...raceOptionChange]);
    setShowRaceAllOptions(true);
  };
  const showAllRaceCancelCallBack = () => {
    setShowRaceAllOptions(false);
  };
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  function updateRaceSelection(val: any) {
    if (val.trim() === 'Z2') {
      raceOptionChange.map((item) => (item.enabled = false));
    } else {
      const declinedRaceItem = raceOptionChange.find(
        (item) => item.code.trim() === 'Z2',
      );
      if (declinedRaceItem) declinedRaceItem.enabled = false;
    }

    const selectedRaceItem = raceOptionChange.find((item) => item.code === val);

    if (selectedRaceItem) {
      selectedRaceItem.enabled = !selectedRaceItem.enabled;
    }

    setRaceOptionChange([...raceOptionChange]);
  }

  async function updateRaceDetails() {
    const newRaceList: OptionData[] = [];
    raceOptionChange?.map((item) => {
      if (item.enabled == true) {
        newRaceList.push({
          code: item.code,
          label: item.label,
          enabled: true,
        });
      }
    });

    const racePreferenceRequest: Partial<UpdateHealthEquityPreferenceRequest> =
      {};

    if (newRaceList && newRaceList.length > 0) {
      newRaceList.forEach((item, index) => {
        const code =
          `raceCode${index + 1}` as keyof UpdateHealthEquityPreferenceRequest;
        racePreferenceRequest[code] = item.code;
      });
    }
    const raceResponse = await updateHealthEquityPreference(
      racePreferenceRequest,
    );
    if (raceResponse.status == 200) {
      raceAndEthnicitySelectedDetails =
        await getHealthEquitySelectedAnswers(sessionData);
      setmemberRaceandEthicinitySelectedDetails(
        raceAndEthnicitySelectedDetails,
      );
      setShowRaceAllOptions(false);
    } else {
      setShowRaceAllOptions(true);
    }
  }

  const isImpersonated = sessionData?.user.impersonated;
  console.log(`LangPrefImp: ${isImpersonated}`);

  return (
    <Card className="large-section">
      <div className="flex flex-col">
        <TextBox text="Race and Ethnicity" className="title-2" />
        <Spacer size={16} />
        {selectedEthnicityData.length > 0 && !showEthnicityAllOptions && (
          <Column>
            <UpdateRowForm
              label={
                <TextBox
                  className="font-bold body-1"
                  text="What is your ethnicity?"
                />
              }
              subLabel=""
              enabled={false}
              saveCallback={selectedEthnicityUpdateCallBack}
              type="currentselection"
              optionObjects={selectedEthnicityData}
              divider={true}
              isImpersonated={isImpersonated}
            />
            <Spacer size={32} />
          </Column>
        )}

        {(selectedEthnicityData.length == 0 || showEthnicityAllOptions) && (
          <Column>
            <UpdateRowForm
              label={
                <TextBox
                  className="font-bold body-1"
                  text="What is your ethnicity?"
                />
              }
              subLabel=""
              enabled={false}
              saveCallback={updateEthinincityDetails}
              cancelCallback={showAllEthnicityCancelCallBack}
              optionsEnabled={isEthnicitySelected}
              type="radio"
              optionObjects={ethnicityOptionChange}
              divider={true}
              selectionCallBack={updateEthnicityRadioButtonSelection}
              isImpersonated={isImpersonated}
            />
            <Spacer size={32} />
          </Column>
        )}
        {selectedRaceData.length > 0 && !showRaceAllOptions && (
          <UpdateRowForm
            label={
              <TextBox className="font-bold body-1" text="What is your race?" />
            }
            subLabel=""
            isRaceField={true}
            enabled={false}
            saveCallback={selectedRaceUpdateCallBack}
            type="currentselection"
            optionObjects={selectedRaceData}
            divider={false}
            isImpersonated={isImpersonated}
          />
        )}
        {(selectedRaceData.length == 0 || showRaceAllOptions) && (
          <UpdateRowForm
            label={
              <TextBox className="font-bold body-1" text="What is your race?" />
            }
            subLabel="check all that apply."
            enabled={false}
            optionsEnabled={isRaceSelected}
            saveCallback={updateRaceDetails}
            cancelCallback={showAllRaceCancelCallBack}
            type="checkbox"
            optionObjects={raceOptionChange}
            divider={false}
            selectionCallBack={updateRaceSelection}
            isImpersonated={isImpersonated}
          />
        )}
      </div>
    </Card>
  );
};
