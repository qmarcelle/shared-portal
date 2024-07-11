'use client';

import { AccordionListCard } from '@/components/composite/AccordionListCard';
import { OnMyPlanComponent } from '@/components/composite/OnMyPlanComponent';
import { Card } from '@/components/foundation/Card';
import { Column } from '@/components/foundation/Column';
import { Dropdown } from '@/components/foundation/Dropdown';
import { Header } from '@/components/foundation/Header';
import { Row } from '@/components/foundation/Row';
import { Spacer } from '@/components/foundation/Spacer';
import { TextBox } from '@/components/foundation/TextBox';

const ShareMyInformation = () => {
  return (
    <div className="flex flex-col justify-center items-center page">
      <Column className="app-content app-base-font-color">
        <section className="flex flex-row items-start app-body">
          <Column className="flex-grow page-section-36_67 items-stretch">
            <AccordionListCard
              header="Understanding Sharing My Information"
              information={[
                {
                  title: 'Full Sharing',
                  body: (
                    <div className="m-1">
                      The information we will disclose may reveal other
                      sensitive health information about the Member, including
                      information about treatment for substance use disorders
                      (drugs/alcohol), mental or behavioral health disorders,
                      HIV/AIDS, sexually transmitted diseases (STDs),
                      communicable diseases, developmental or intellectual
                      disabilities, genetic disorders (including genetic testing
                      for such disorders and genetic history) or other sensitive
                      information.
                    </div>
                  ),
                },
                {
                  title: 'Basic Sharing',
                  body: (
                    <div className="m-1">
                      By choosing this option, you will be sharing limited
                      information from your account such as benefits and
                      coverage, claims and doctor visits, pharmacy and
                      prescriptions.
                    </div>
                  ),
                },
                {
                  title: 'None',
                  body: (
                    <div className="m-1">
                      No access to your claims, documents, prescriptions or
                      account information.
                    </div>
                  ),
                },
              ]}
            ></AccordionListCard>
          </Column>
          <Column className="page-section-63_33 items-stretch">
            <Card className="large-section">
              <OnMyPlanComponent
                header={
                  <Column>
                    <Header type="title-2" text="On My Plan" />
                  </Column>
                }
                subHeader={
                  <Column>
                    <TextBox text="Set the level of access for individuals on your health plan." />
                  </Column>
                }
                planType={
                  <Column className="flex flex-row">
                    <Row>
                      <Spacer axis="horizontal" size={8} />
                      <TextBox className="body-1" text="Plan: " />
                      <Spacer axis="horizontal" size={8} />
                      <Dropdown
                        onSelectCallback={() => {}}
                        initialSelectedValue="1"
                        items={[
                          { label: 'Subscriber ID ABC123456789', value: '0' },
                          { label: 'Subscriber ID ABC000000000', value: '1' },
                        ]}
                      />
                    </Row>
                  </Column>
                }
                infoIcon={false}
                onMyPlanDetails={[
                  {
                    memberName: 'Maddison Hall',
                    DOB: '01/01/1979',
                    sharingType: 'Full Sharing',
                    isMinor: false,
                  },
                  {
                    memberName: 'Forest Hall',
                    DOB: '01/01/2001',
                    sharingType: 'Full Sharing',
                    isMinor: false,
                  },
                  {
                    memberName: 'Corey Hall',
                    DOB: '01/01/2002',
                    sharingType: 'Full Sharing',
                    isMinor: false,
                  },
                  {
                    memberName: 'Telly Hall',
                    DOB: '01/01/2008',
                    sharingType: 'Full Sharing',
                    isMinor: false,
                  },
                  {
                    memberName: 'Janie Hall',
                    DOB: '01/01/2024',
                    sharingType: 'Full Sharing',
                    isMinor: true,
                  },
                ]}
              />
            </Card>
          </Column>
        </section>
      </Column>
    </div>
  );
};

export default ShareMyInformation;
