'use client';

import { Column } from '@/components/foundation/Column';
import { Header } from '@/components/foundation/Header';
import { Spacer } from '@/components/foundation/Spacer';
import { TextBox } from '@/components/foundation/TextBox';
import { PrimaryCareOptionsData } from '@/app/(protected)/(common)/member/findcare/primaryCareOptions/model/app/primary_care_options_data';
import { HelpWithPrimaryCareProvider } from './components/HelpWithPrimaryCareProvider';
import { ProviderContactInformation } from './components/ProviderContactInformation';

export type PrimaryCareOptionsProps = {
  data: PrimaryCareOptionsData;
};

const MyPrimaryCareProvider = ({ data }: PrimaryCareOptionsProps) => {
  return (
    <main className="flex flex-col justify-center items-center page">
      <Column className="app-content app-base-font-color mt-20">
        <Header
          text="My Primary Care Provider"
          className="m-4 mb-0 !font-light !text-[32px]/[40px]"
        />
        <Spacer size={12} />
        <TextBox
          className="md:w-2/3 ml-4"
          text="Here is your current Primary Care Provider's contact information and location. if you've changed providers, you can update it below."
        />

        <section className="flex flex-row items-start app-body mt-8">
          <Column className=" flex-grow page-section-63_33 items-stretch">
            {data.primaryCareProvider && (
              <ProviderContactInformation
                className="large-section"
                providerDetails={data.primaryCareProvider}
                label="Primary Care Provider"
              />
            )}
            <Spacer size={12} />
            <Header text="Dependents" className="title-2 m-4" />
            <Spacer size={12} />
            {data.dependentPrimaryCareProvider &&
              data.dependentPrimaryCareProvider.map((item, index) => (
                <ProviderContactInformation
                  key={index}
                  className="large-section"
                  providerDetails={item}
                  label="Primary Care Provider"
                />
              ))}
          </Column>
          <Column className="flex-grow page-section-36_67 items-stretch">
            <HelpWithPrimaryCareProvider />
          </Column>
        </section>
      </Column>
    </main>
  );
};

export default MyPrimaryCareProvider;
