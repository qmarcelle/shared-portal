'use client';

import { AccordionListCard } from '@/components/composite/AccordionListCard';
import { Card } from '@/components/foundation/Card';
import { Column } from '@/components/foundation/Column';
import { Header } from '@/components/foundation/Header';
import { accessGranted, basicAccessIcon } from '@/components/foundation/Icons';
import { Spacer } from '@/components/foundation/Spacer';
import { TextBox } from '@/components/foundation/TextBox';
import Image from 'next/image';
import { AuthorizationForm } from './components/AuthorizationForm';
import { BecomeRepresentative } from './components/BecomeRepresentative';
import { MembersRepresented } from './components/MembersRepresented';

const PersonalRepresentativeAccess = () => {
  return (
    <div className="flex flex-col justify-center items-center page">
      <Column className="app-content app-base-font-color">
        <Spacer size={52} />
        <Header
          className="pl-3"
          type="title-1"
          text="Personal Representative Access"
        />
        <Spacer size={12} />
        <TextBox
          className="w-2/3 ml-4"
          text="Personal representatives have the legal authority to make health care decisions on behalf of the member."
        />
        <Spacer size={22} />
        <section className="flex flex-row items-start app-body">
          <Column className="flex-grow page-section-36_67 items-stretch">
            <AccordionListCard
              header="Understanding Access"
              information={[
                {
                  icon: (
                    <Image
                      className="size-[20px] mr-2"
                      src={accessGranted}
                      alt="Full Access"
                    />
                  ),
                  title: 'Full Access',
                  body: (
                    <div className="m-1">
                      The information we will disclose may reveal other
                      sensitive information about the Member, including
                      including information about the treatment for substance
                      use disorders (drugs/alcohol), mental or behavioral health
                      disorders, HIV/AIDS, sexually transmitted diseases (STDs),
                      communicable diseases, developmental or intellectual
                      disabilities, genetic disorders (including genetic testing
                      for such disorders and genetic history) or other sensitive
                      information.
                    </div>
                  ),
                },
                {
                  icon: (
                    <Image
                      className="size-[20px] mr-2"
                      src={basicAccessIcon}
                      alt="Full Access"
                    />
                  ),
                  title: 'Basic Access',
                  body: (
                    <div className="m-1">
                      By choosing this option, you will be sharing limited
                      information from your account such as benefits and
                      coverage, claims and doctor visits, pharmacy and
                      prescriptions.
                    </div>
                  ),
                },
              ]}
            ></AccordionListCard>
            <BecomeRepresentative
              isRepresentative={false}
              linkLabel="Become a Personal Representative"
            />
          </Column>
          <Column className="page-section-63_33 items-stretch">
            <Card className="large-section">
              <MembersRepresented
                isRepresentative={false}
                isRegistered={true}
                representativeAccessDetails={[
                  {
                    memberName: 'Robert Hall',
                    DOB: '01/01/1943',
                    isOnline: true,
                    fullAccess: false,
                  },
                  {
                    memberName: '[Mature Minor]',
                    DOB: '01/01/2008',
                    isOnline: false,
                    fullAccess: true,
                  },
                  {
                    memberName: '[Mature Minor]',
                    DOB: '01/01/2009',
                    isOnline: true,
                    fullAccess: false,
                  },
                ]}
              />
            </Card>

            <AuthorizationForm
              isMatureMinor={true}
              fullAccess={true}
              isRepresentative={true}
              linkLabel="Download Authorization Form"
            />
          </Column>
        </section>
      </Column>
    </div>
  );
};

export default PersonalRepresentativeAccess;
