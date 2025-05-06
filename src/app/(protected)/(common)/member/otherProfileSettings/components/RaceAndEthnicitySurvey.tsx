import { Card } from '@/components/foundation/Card';
import { Column } from '@/components/foundation/Column';
import { Spacer } from '@/components/foundation/Spacer';
import { TextBox } from '@/components/foundation/TextBox';
import { useState } from 'react';
import { UpdateRowForm } from './UpdateRowForm';

export const RaceAndEthnicitySurvey = () => {
  const [isSaveAnswerOne, setIsSaveAnwerOne] = useState(false);
  const [isSaveAnswerTwo, setIsSaveAnwerTwo] = useState(false);
  const [isUpdateAnserOne, setUpdateAnswerOne] = useState(false);
  const [isUpdateAnserTwo, setUpdateAnswerTwo] = useState(false);

  const answerOneSaveCallBack = () => {
    setIsSaveAnwerOne(true);
  };
  const answerOneUpdateCallBack = () => {
    setUpdateAnswerOne(true);
    setIsSaveAnwerOne(false);
  };
  const answerTwoSaveCallBack = () => {
    setIsSaveAnwerTwo(true);
  };
  const answerTwoUpdateCallBack = () => {
    setUpdateAnswerTwo(true);
    setIsSaveAnwerTwo(false);
  };

  //Static Options for Survey Questions
  const ethnicityList = [
    { label: 'Hispanic or Latino', enabled: true },
    { label: 'Not Hispanic or Latino', enabled: false },
    { label: 'Decline to answer', enabled: false },
  ];
  const raceList = [
    { label: 'American Indian/Alaska Native', enabled: false },
    { label: 'Asian', enabled: false },
    { label: 'Black or African American', enabled: false },
    { label: 'Native Hawaiian/Other Pacific Islander', enabled: false },
    { label: 'White', enabled: false },
    { label: 'Some other race', enabled: false },
    { label: 'Decline to answer', enabled: false },
  ];

  return (
    <Card className="large-section">
      <div className="flex flex-col">
        <TextBox text="Race and Ethnicity" className="title-2" />
        <Spacer size={16} />
        {isSaveAnswerOne === true && (
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
              saveCallback={answerOneUpdateCallBack}
              cancelCallback={isUpdateAnserOne}
              type="currentselection"
              optionObjects={ethnicityList}
              divider={true}
            />
            <Spacer size={32} />
          </Column>
        )}
        {isSaveAnswerOne === false && (
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
              saveCallback={answerOneSaveCallBack}
              cancelCallback={isUpdateAnserOne}
              type="radio"
              optionObjects={ethnicityList}
              divider={true}
            />
            <Spacer size={32} />
          </Column>
        )}
        {isSaveAnswerTwo === true && (
          <UpdateRowForm
            label={
              <TextBox className="font-bold body-1" text="What is your race?" />
            }
            subLabel=""
            enabled={false}
            saveCallback={answerTwoUpdateCallBack}
            cancelCallback={isUpdateAnserTwo}
            type="currentselection"
            optionObjects={raceList}
            divider={false}
          />
        )}
        {isSaveAnswerTwo === false && (
          <UpdateRowForm
            label={
              <TextBox className="font-bold body-1" text="What is your race?" />
            }
            subLabel="check all that apply."
            enabled={false}
            saveCallback={answerTwoSaveCallBack}
            cancelCallback={isUpdateAnserTwo}
            type="checkbox"
            optionObjects={raceList}
            divider={false}
          />
        )}
      </div>
    </Card>
  );
};
