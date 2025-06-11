'use client';

import { AccordionListCard } from '@/components/composite/AccordionListCard';
import { Card } from '@/components/foundation/Card';
import { Column } from '@/components/foundation/Column';
import { Header } from '@/components/foundation/Header';
import { Spacer } from '@/components/foundation/Spacer';
import { TextBox } from '@/components/foundation/TextBox';
import { AnalyticsData } from '@/models/app/analyticsData';
import { SharePlanInformationDetails } from '@/models/app/getSharePlanDetails';
import { googleAnalytics } from '@/utils/analytics';
import { ShareMyPlanComponent } from './components/ShareMyPlanComponent';
import { ShareOutsideMyPlanComponent } from './components/ShareOutsideMyPlanComponent';

export type ShareMyInformationProps = {
  data?: SharePlanInformationDetails;
  isImpersonated?: boolean;
};

const ShareMyInformation = ({ data }: ShareMyInformationProps) => {
  function trackShareMyInformationAccessAnalytics(clickText: string): void {
    const analytics: AnalyticsData = {
      event: 'select_content',
      click_text: clickText,
      click_url: undefined,
      page_section: undefined,
      selection_type: 'accordion',
      element_category: 'Understanding Sharing My Information',
      action: 'expand',
    };
    googleAnalytics(analytics);
  }

  return (
    <div className="flex flex-col justify-center items-center page">
      <Column className="app-content app-base-font-color">
        <Header type="title-1" text="Share My Information" />
        <Spacer size={16} />
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
                  onOpenCallBack: () =>
                    trackShareMyInformationAccessAnalytics('Full Sharing'),
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
                  onOpenCallBack: () =>
                    trackShareMyInformationAccessAnalytics('Basic Sharing'),
                },
                {
                  title: 'None',
                  body: (
                    <div className="m-1">
                      No access to your claims, documents, prescriptions or
                      account information.
                    </div>
                  ),
                  onOpenCallBack: () =>
                    trackShareMyInformationAccessAnalytics('None'),
                },
              ]}
            ></AccordionListCard>
          </Column>
          <Column className="page-section-63_33 items-stretch">
            <Card className="large-section">
              <ShareMyPlanComponent
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
                infoIcon={false}
                ShareMyPlanDetails={data!.memberData}
              />
            </Card>
            <Card className="large-section">
              <ShareOutsideMyPlanComponent
                header={
                  <Column>
                    <Header type="title-2" text="Outside My Plan" />
                  </Column>
                }
                subHeader={
                  <Column>
                    <TextBox text="Share your information with individuals not on your health plan." />
                  </Column>
                }
                ShareOutsideMyPlanDetails={data!.outsideMyPlanData}
              />
            </Card>
          </Column>
        </section>
      </Column>
    </div>
  );
};

export default ShareMyInformation;
