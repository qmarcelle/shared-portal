'use client';

import { AboutMyProfileSlide } from '@/app/otherProfileSettings/components/AboutMyProfileSlide';
import { LanguagePreferenceSurvey } from '@/app/otherProfileSettings/components/LanguagePreferenceSurvey';
import { RaceAndEthnicitySurvey } from '@/app/otherProfileSettings/components/RaceAndEthnicitySurvey';
import { Header } from '@/components/foundation/Header';
import { Spacer } from '@/components/foundation/Spacer';
import { TextBox } from '@/components/foundation/TextBox';
import { Session } from 'next-auth';
import { OtherProfileSettingsData } from './model/api/otherProfileSettingsData';

export type OtherProfileSettingsProps = {
  data?: OtherProfileSettingsData;
  sessionData: Session | null;
};

const OtherProfileSettings = ({
  data,
  sessionData,
}: OtherProfileSettingsProps) => {
  return (
    <div className="flex flex-col justify-center items-center page">
      <div className="flex flex-col app-content">
        <section className="flex flex-col justify-start self-start">
          <Header type="title-1" text="Other Profile Settings" />
          <Spacer size={16} />
          <TextBox text="Add or update details about yourself, including ethnicity, race and language preferences." />
        </section>
        <section className="flex flex-row items-start app-body">
          <AboutMyProfileSlide />
          <section>
            <RaceAndEthnicitySurvey
              raceAndEthinicityAllDetails={
                data?.healthEquityPossibleAnswersData
              }
              raceAndEthinicitySelectedDetails={
                data?.healthEquitySelectedAnswersData
              }
              sessionData={sessionData}
            />
            <LanguagePreferenceSurvey
              languageSurveyAllDetails={data?.healthEquityPossibleAnswersData}
              languageSurveySelectedDetails={
                data?.healthEquitySelectedAnswersData
              }
              sessionData={sessionData}
            />
          </section>
        </section>
      </div>
    </div>
  );
};

export default OtherProfileSettings;
