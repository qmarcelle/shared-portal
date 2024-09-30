'use client';

import { Card } from '@/components/foundation/Card';
import { Column } from '@/components/foundation/Column';
import { Header } from '@/components/foundation/Header';
import { LinkRow } from '@/components/foundation/LinkRow';
import { Spacer } from '@/components/foundation/Spacer';
//import SwitchAccountComponent from './SwitchAccountComponent';

const NonMemberDashboard = () => {
  return (
    <div className="flex flex-col justify-center items-center page">
      <Spacer size={32}></Spacer>
      <Column className="app-content app-base-font-color">
        <Spacer size={32}></Spacer>
        <section className="flex flex-row items-start app-body">
          <Column className="flex-grow page-section-63_33 items-stretch">
            <div />
            {/* <SwitchAccountComponent /> */}
          </Column>
          <Column className=" flex-grow page-section-36_67 items-stretch">
            <Card className="large-section">
              <Column className="flex flex-col">
                <Header className="title-2 mr-2" text="Related Links" />
                <Spacer size={16} />
                <LinkRow
                  label="Access Others' Information"
                  description={
                    <div className="body-1 flex flex-row">
                      View or request access to others&apos; plan information.
                    </div>
                  }
                  divider={true}
                />
                <LinkRow
                  label="Personal Representative Access"
                  description={
                    <div className="body-1 flex flex-row">
                      A personal representative is an individual with the legal
                      authority to make decisions for others, such as minor
                      dependent or other dependent individual.
                    </div>
                  }
                />
              </Column>
            </Card>
          </Column>
        </section>
        <Spacer size={32}></Spacer>
      </Column>
    </div>
  );
};

export default NonMemberDashboard;
