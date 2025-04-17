'use client';

import { AccessOnMyPlanComponent } from '@/app/accessOthersInformation/components/AccessOnMyPlanComponent';
import { AccordionListCard } from '@/components/composite/AccordionListCard';
import { Card } from '@/components/foundation/Card';
import { Column } from '@/components/foundation/Column';
import { Header } from '@/components/foundation/Header';
import { Spacer } from '@/components/foundation/Spacer';
import { TextBox } from '@/components/foundation/TextBox';
import { SharePlanInformationDetails } from '@/models/app/getSharePlanDetails';

export type AccessOtherInformationProps = {
  accessOtherInformationDetails?: SharePlanInformationDetails;
};

const AccessOthersInformation = ({
  accessOtherInformationDetails,
}: AccessOtherInformationProps) => {
  return (
    <main className="flex flex-col justify-center items-center page">
      <Column className="app-content app-base-font-color">
        <Spacer size={32} />
        <Header type="title-1" text="Access Others' Information" />
        <Spacer size={32} />
        <section className="flex flex-row items-start app-body">
          <Column className="flex-grow page-section-36_67 items-stretch">
            <AccordionListCard
              header="Understanding Access On My Plan"
              information={[
                {
                  title: 'Access Granted',
                  body: (
                    <div className="m-1">
                      Indicates that you can access other members&apos;
                      information on your plan. You will be able see their
                      information on your account. On pages such as claims,
                      documents, prior authorizations and more, you&apos;ll be
                      able to filter for members on your plan that have granted
                      you access to their information.
                    </div>
                  ),
                },
                {
                  title: 'Request Access',
                  body: (
                    <div className="m-1">
                      You can request access to other members&apos; information
                      on your plan.
                    </div>
                  ),
                },
                {
                  title: 'Special Permissions',
                  body: (
                    <div className="m-1">
                      In some cases, you may need to become a personal
                      representative of an individual before gaining access to
                      their information. A personal representative is an
                      individual with the legal authority to make decisions for
                      others, such as a minor dependent. You can learn more
                      about personal representive status here.
                    </div>
                  ),
                },
              ]}
            ></AccordionListCard>
          </Column>
          <Column className="page-section-63_33 items-stretch">
            <Card className="large-section">
              <AccessOnMyPlanComponent
                header={
                  <Column>
                    <Header type="title-2" text="On My Plan" />
                  </Column>
                }
                subHeader={
                  <Column>
                    <TextBox text="Below is the access you've been granted by other members on your plan." />
                  </Column>
                }
                infoIcon={false}
                accessOnMyPlanDetails={
                  accessOtherInformationDetails?.memberData ?? null
                }
              />
            </Card>
          </Column>
        </section>
      </Column>
    </main>
  );
};

export default AccessOthersInformation;
