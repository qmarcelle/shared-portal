'use client';

import { AboutMyProfileSlide } from '@/app/otherProfileSettings/components/AboutMyProfileSlide';
import { LanguagePreferenceSurvey } from '@/app/otherProfileSettings/components/LanguagePreferenceSurvey';
import { RaceAndEthnicitySurvey } from '@/app/otherProfileSettings/components/RaceAndEthnicitySurvey';
import { Header } from '@/components/foundation/Header';
import { Spacer } from '@/components/foundation/Spacer';
import { TextBox } from '@/components/foundation/TextBox';

const OtherProfileSettings = () => {
  return (
    <div className="flex flex-col justify-center items-center page">
      <div className="flex flex-col app-content">
        <section className="flex flex-col justify-start self-start px-4">
          <Header type="title-1" text="Other Profile Settings" />
          <Spacer size={16} />
          <TextBox text="Add or update details about yourself, including ethnicity, race and language preferences.`" />
        </section>
        <section className="flex flex-row items-start app-body">
          <AboutMyProfileSlide />
          <section>
            <RaceAndEthnicitySurvey />
            <LanguagePreferenceSurvey />
          </section>
        </section>
      </div>
    </div>
  );
};

export default OtherProfileSettings;
