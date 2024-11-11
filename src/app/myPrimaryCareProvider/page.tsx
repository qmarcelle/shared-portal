'use client';

import { Column } from '@/components/foundation/Column';
import { Header } from '@/components/foundation/Header';
import { Spacer } from '@/components/foundation/Spacer';
import { TextBox } from '@/components/foundation/TextBox';
import { AddProviderContactInformation } from './components/AddProviderContactInformation';
import { HelpWithPrimaryCareProvider } from './components/HelpWithPrimaryCareProvider';
import { ProviderContactInformation } from './components/ProviderContactInformation';
import { ProviderInfoItem } from './components/ProviderInfoItem';
const MyPrimaryCareProvider = () => {
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
            <ProviderInfoItem />
            <Header text="Dependents" className="title-2 m-4" />
            <ProviderContactInformation
              providerContactInfoDetails={[
                {
                  memberName: 'Maddison Hall',
                  providerName: 'John Hopkins',
                  providerType: 'Primary Care Provider',
                  DOB: '01/01/1979',
                  facilityAddress:
                    'John Hopkins Medical Center 123 Street Address Road City Town, TN 12345',
                  phone: '(123) 456-7890',
                  addProvider: true,
                },
                {
                  memberName: 'Forest Hall',
                  providerName: 'Stephen Charles',
                  providerType: 'Primary Care Provider',
                  DOB: '01/01/2001',
                  facilityAddress:
                    'John Hopkins Medical Center 123 Street Address Road City Town, TN 12345',
                  phone: '(123) 456-7890',
                  addProvider: true,
                },
              ]}
            />
            <AddProviderContactInformation
              addProviderContactInfoDetails={[
                {
                  providerMemberName: 'Corey Hall',
                  providerDOB: '01/01/2002',
                },
                {
                  providerMemberName: 'Telly Hall',
                  providerDOB: '01/01/2005',
                },
                {
                  providerMemberName: 'Janie Hall',
                  providerDOB: '01/01/2015',
                },
              ]}
            />
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
