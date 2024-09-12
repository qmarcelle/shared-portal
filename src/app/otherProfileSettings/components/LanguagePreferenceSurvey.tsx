import { Card } from '@/components/foundation/Card';
import { Spacer } from '@/components/foundation/Spacer';
import { TextBox } from '@/components/foundation/TextBox';
import { useState } from 'react';
import { UpdateRowForm } from './UpdateRowForm';

export const LanguagePreferenceSurvey = () => {
  const [isSaveAnswerOne, setIsSaveAnwerOne] = useState(false);
  const [isSaveAnswerTwo, setIsSaveAnwerTwo] = useState(false);
  const [isSaveAnswerThree, setIsSaveAnwerThree] = useState(false);

  const answerOneSaveCallBack = () => {
    setIsSaveAnwerOne(true);
  };
  const answerOneUpdateCallBack = () => {
    setIsSaveAnwerOne(false);
  };
  const answerTwoSaveCallBack = () => {
    setIsSaveAnwerTwo(true);
  };
  const answerTwoUpdateCallBack = () => {
    setIsSaveAnwerTwo(false);
  };
  const answerThreeSaveCallBack = () => {
    setIsSaveAnwerThree(true);
  };
  const answerThreeUpdateCallBack = () => {
    setIsSaveAnwerThree(false);
  };
  //Static Options for Survey Questions
  const LanguageList = [
    { label: 'Very Well', enabled: false },
    { label: 'Well', enabled: false },
    { label: 'Decline to answer', enabled: false },
  ];

  return (
    <Card className="large-section">
      <div className="flex flex-col">
        {isSaveAnswerOne === true && (
          <UpdateRowForm
            label={
              <TextBox
                className="font-bold"
                text="How well do you speak English?"
              />
            }
            subLabel=""
            enabled={false}
            saveCallback={answerOneUpdateCallBack}
            type="currentselection"
            optionObjects={LanguageList}
            divider={true}
          />
        )}
        {isSaveAnswerOne === false && (
          <UpdateRowForm
            label={
              <TextBox
                className="font-bold"
                text="How well do you speak English?"
              />
            }
            subLabel=""
            enabled={false}
            saveCallback={answerOneSaveCallBack}
            type="radio"
            optionObjects={LanguageList}
            divider={true}
          />
        )}
        <Spacer size={32} />
        {isSaveAnswerTwo === true && (
          <UpdateRowForm
            label={
              <TextBox
                className="font-bold"
                text="What language are you most comfortable using when speaking with your doctor?"
              />
            }
            subLabel=""
            enabled={false}
            saveCallback={answerTwoUpdateCallBack}
            type="currentselection"
            optionObjects={LanguageList}
            divider={true}
          />
        )}
        {isSaveAnswerTwo === false && (
          <UpdateRowForm
            label={
              <TextBox
                className="font-bold"
                text="What language are you most comfortable using when speaking with your doctor?"
              />
            }
            subLabel=""
            enabled={false}
            saveCallback={answerTwoSaveCallBack}
            type="textbox"
            optionObjects={LanguageList}
            divider={true}
          />
        )}
        <Spacer size={32} />
        {isSaveAnswerThree === true && (
          <UpdateRowForm
            label={
              <TextBox
                className="font-bold"
                text="What language do you prefer to read?"
              />
            }
            subLabel=""
            enabled={false}
            saveCallback={answerThreeUpdateCallBack}
            type="currentselection"
            optionObjects={[]}
            divider={false}
          />
        )}
        {isSaveAnswerThree === false && (
          <UpdateRowForm
            label={
              <TextBox
                className="font-bold"
                text="What language do you prefer to read?"
              />
            }
            subLabel="Note: Not all of our materials are available in all languages right now. We're asking to find out which languages our members use most."
            enabled={false}
            saveCallback={answerThreeSaveCallBack}
            type="textbox"
            optionObjects={[]}
            divider={false}
          />
        )}
      </div>
    </Card>
  );
};
