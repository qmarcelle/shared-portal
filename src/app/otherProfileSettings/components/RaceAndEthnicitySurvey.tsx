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

export type RaceAndEthinicityProps = {
  raceAndEthinicityAllDetails?: NCQAAllPossibleAnswers | null;
  raceAndEthinicitySelectedDetails?: NCQASelectedAnswers | null;
  sessionData: Session | null;
} & IComponent;

export const RaceAndEthnicitySurvey = ({
  raceAndEthinicityAllDetails,
  raceAndEthinicitySelectedDetails,
  sessionData,
}: RaceAndEthinicityProps) => {
  const [
    memberRaceandEthicinitySelectedDetails,
    setmemberRaceandEthicinitySelectedDetails,
  ] = useState(raceAndEthinicitySelectedDetails);

  const selectedEthinicityData: OptionData[] = [];
  memberRaceandEthicinitySelectedDetails?.ethnicities?.map((item) => {
    selectedEthinicityData.push({
      code: item.ncqaEthnicityCode,
      label: item.ncqaEthnicityDesc,
      enabled: true,
    });
  });

  const ethnicityList: OptionData[] = [];
  raceAndEthinicityAllDetails?.ethnicityCodes?.map((item) => {
    const setEnabled =
      item.ncqaEthnicityCode === selectedEthinicityData[0]?.code ? true : false;
    ethnicityList.push({
      code: item.ncqaEthnicityCode,
      label: item.ncqaEthnicityDesc,
      enabled: setEnabled,
    });
  });

  const isEthinicitySelected =
    selectedEthinicityData.length == 0 ? false : true;

  const [ethinicityOptionChange, setEthinicityOptionChange] =
    useState(ethnicityList);

  const [showEthinicityAllOptions, setShowEthinicityAllOptions] =
    useState(false);

  const showAllEthinicityCancelCallBack = () => {
    setShowEthinicityAllOptions(false);
  };

  const selectedEthinicityUpdateCallBack = () => {
    ethinicityOptionChange.forEach((item) => (item.enabled = false));
    const originalEthinicityItem = ethinicityOptionChange.find(
      (item) => item.code === selectedEthinicityData[0]?.code,
    );
    if (originalEthinicityItem) {
      originalEthinicityItem.enabled = true;
    }
    setEthinicityOptionChange([...ethinicityOptionChange]);
    setShowEthinicityAllOptions(true);
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  function updateEthinicityRadioButtonSelection(val: any) {
    ethinicityOptionChange.forEach((item) => (item.enabled = false));
    const selectedEthinicityItem = ethinicityOptionChange.find(
      (item) => item.code === val,
    );
    if (selectedEthinicityItem) {
      selectedEthinicityItem.enabled = true;
    }
    setEthinicityOptionChange([...ethinicityOptionChange]);
  }

  async function updateEthinincityDetails() {
    const newEthinicityDetails = ethinicityOptionChange.find(
      (item) => item.enabled == true,
    );
    const ethinincityPreferenceRequest: Partial<UpdateHealthEquityPreferenceRequest> =
      {};

    if (newEthinicityDetails && newEthinicityDetails.code)
      ethinincityPreferenceRequest.ethnicityCode = newEthinicityDetails.code;

    const ethinicityResponse = await updateHealthEquityPreference(
      ethinincityPreferenceRequest,
    );
    if (ethinicityResponse.status == 200) {
      raceAndEthinicitySelectedDetails =
        await getHealthEquitySelectedAnswers(sessionData);
      setmemberRaceandEthicinitySelectedDetails(
        raceAndEthinicitySelectedDetails,
      );
      setShowEthinicityAllOptions(false);
    } else {
      setShowEthinicityAllOptions(true);
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
  raceAndEthinicityAllDetails?.raceCodes?.map((item) => {
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
      raceAndEthinicitySelectedDetails =
        await getHealthEquitySelectedAnswers(sessionData);
      setmemberRaceandEthicinitySelectedDetails(
        raceAndEthinicitySelectedDetails,
      );
      setShowRaceAllOptions(false);
    } else {
      setShowRaceAllOptions(true);
    }
  }

  return (
    <Card className="large-section">
      <div className="flex flex-col">
        <TextBox text="Race and Ethnicity" className="title-2" />
        <Spacer size={16} />
        {selectedEthinicityData.length > 0 && !showEthinicityAllOptions && (
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
              saveCallback={selectedEthinicityUpdateCallBack}
              type="currentselection"
              optionObjects={selectedEthinicityData}
              divider={true}
            />
            <Spacer size={32} />
          </Column>
        )}

        {(selectedEthinicityData.length == 0 || showEthinicityAllOptions) && (
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
              cancelCallback={showAllEthinicityCancelCallBack}
              optionsEnabled={isEthinicitySelected}
              type="radio"
              optionObjects={ethinicityOptionChange}
              divider={true}
              selectionCallBack={updateEthinicityRadioButtonSelection}
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
          />
        )}
      </div>
    </Card>
  );
};
