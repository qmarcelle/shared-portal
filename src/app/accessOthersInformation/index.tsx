'use client';

import { AccessOnMyPlanComponent } from '@/app/accessOthersInformation/components/AccessOnMyPlanComponent';
import { AccordionListCard } from '@/components/composite/AccordionListCard';
import { Card } from '@/components/foundation/Card';
import { Column } from '@/components/foundation/Column';
import { Header } from '@/components/foundation/Header';
import { RichText } from '@/components/foundation/RichText';
import { Spacer } from '@/components/foundation/Spacer';
import { TextBox } from '@/components/foundation/TextBox';
import { AnalyticsData } from '@/models/app/analyticsData';
import { SharePlanInformationDetails } from '@/models/app/getSharePlanDetails';
import { googleAnalytics } from '@/utils/analytics';
import { AccessToOthersPlanComponent } from './components/AccessToOthersPlanComponent';

export type AccessOtherInformationProps = {
  accessOtherInformationDetails?: SharePlanInformationDetails;
  isImpersonated?: boolean;
};

const AccessOthersInformation = ({
  accessOtherInformationDetails,
  isImpersonated = false,
}: AccessOtherInformationProps) => {
  function trackAccessOthersInformationAnalytics(
    clickText: string,
    elementCategory: string,
  ): void {
    const analytics: AnalyticsData = {
      event: 'select_content',
      click_text: clickText,
      click_url: undefined,
      page_section: undefined,
      selection_type: 'accordion',
      element_category: elementCategory,
      action: 'expand',
    };
    googleAnalytics(analytics);
  }
  return (
    <main className="flex flex-col justify-center items-center page">
      <Column className="app-content app-base-font-color">
        <Header type="title-1" text="Access Others' Information" />
        <Spacer size={16} />
        <section className="flex flex-row items-start app-body">
          <Column className="flex-grow page-section-36_67 items-stretch">
            <AccordionListCard
              header="Understanding Access On My Plan"
              information={[
                {
                  title: 'Full Access',
                  body: (
                    <div className="m-1">
                      The information we will disclose may reveal very sensitive
                      health information about the Member, including information
                      about treatment or care for reproductive health (including
                      family planning, contraception, miscarriage, abortion,
                      maternity and infertility), substance use disorders
                      (including drugs and alcohol), Mental or behavioral health
                      disorders, communicable diseases (including HIV/AIDS and
                      sexually transmitted diseases/infections (STDs/STIs)),
                      developmental or intellectual disabilities, genetic
                      disorders (including genetic testing for such disorders
                      and genetic history), abuse (including sexual, physical or
                      mental), brain or other sensitive information.
                    </div>
                  ),
                  onOpenCallBack: () =>
                    trackAccessOthersInformationAnalytics(
                      'Full Access',
                      'Understanding Access On My Plan',
                    ),
                },
                {
                  title: 'Basic Access',
                  body: (
                    <div className="m-1">
                      By choosing this option, we will disclose limited
                      information about the Member such as benefits and
                      coverage, claims and doctor visits, pharmacy and
                      prescriptions.
                    </div>
                  ),
                  onOpenCallBack: () =>
                    trackAccessOthersInformationAnalytics(
                      'Basic Access',
                      'Understanding Access On My Plan',
                    ),
                },
                {
                  title: 'No Access',
                  body: (
                    <div className="m-1">
                      By choosing this option, we will disclose no access to the
                      Member such as benefits and coverage, claims and doctor
                      visits, pharmacy and prescriptions
                    </div>
                  ),
                  onOpenCallBack: () =>
                    trackAccessOthersInformationAnalytics(
                      'No Access',
                      'Understanding Access On My Plan',
                    ),
                },
                {
                  title: 'Special Permissions',
                  body: (
                    <Column>
                      <RichText
                        spans={[
                          <span key={0}>
                            In some cases, you may need to become a personal
                            representative of an individual before gaining
                            access to their information.
                          </span>,
                          <span key={1}>
                            <Spacer size={16}></Spacer>
                          </span>,
                          <span key={2}>
                            A personal representative is an individual with the
                            legal authority to make healthcare decisions for
                            others, such as a minor dependent.You can{' '}
                          </span>,
                          <span className="link" key={3}>
                            <a>
                              learn more about personal representative status
                              here.
                            </a>
                          </span>,
                        ]}
                      />
                    </Column>
                  ),
                  onOpenCallBack: () =>
                    trackAccessOthersInformationAnalytics(
                      'Special Permissions',
                      'Understanding Access On My Plan',
                    ),
                },
              ]}
            ></AccordionListCard>
          </Column>
          <Column className="page-section-63_33 items-stretch">
            <Card className="large-section">
              <AccessOnMyPlanComponent
                allowUpdates={!isImpersonated}
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
                loggedInMemberType={
                  accessOtherInformationDetails?.loggedInMemberRole ?? null
                }
              />
            </Card>
          </Column>
        </section>
      </Column>

      <Column className="app-content app-base-font-color">
        <section className="flex flex-row items-start app-body">
          <Column className="flex-grow page-section-36_67 items-stretch">
            <AccordionListCard
              header="Understanding Access to Others' Plans"
              information={[
                {
                  title: "How to Get Access to Others' Plans",
                  body: (
                    <Column className="m-1">
                      Access to view members&apos; plan information is by
                      invitation only. You&apos;ll receive an email if
                      you&apos;ve been given access to an individual&apos;s
                      plan.
                    </Column>
                  ),
                  onOpenCallBack: () =>
                    trackAccessOthersInformationAnalytics(
                      "How to Get Access to Others' Plans",
                      "Understanding Access to Others' Plans",
                    ),
                },
                {
                  title: "How to View Others' Plans",
                  body: (
                    <Column className="m-1">
                      Once you&apos;ve been invited to view the information of
                      another&apos;s health plan, you can switch to their plan
                      anytime using the profile button in the top right corner.
                    </Column>
                  ),
                  onOpenCallBack: () =>
                    trackAccessOthersInformationAnalytics(
                      "How to View Others' Plans",
                      "Understanding Access to Others' Plans",
                    ),
                },
              ]}
            ></AccordionListCard>
          </Column>
          {/* {accessOtherPlanDetails ? ( // uncomment while API Integration */}
          <Column className="page-section-63_33 items-stretch">
            <Card className="large-section">
              <AccessToOthersPlanComponent
                header={
                  <Column>
                    <Header type="title-2" text="Others' Plans" />
                  </Column>
                }
                subHeader={
                  <Column>
                    <TextBox text="Below is the access granted to you to other member's plan information." />
                  </Column>
                }
                infoIcon={false}
                accessOtherPlanDetails={[
                  {
                    memberName: 'Ellie Williams',
                    dob: '01/01/1993',
                    otherPlanData: [
                      {
                        planName: 'BlueCross BlueShield of Tennessee',
                        subscriber: 'Ellie Williams',
                        id: 'ABC1234567890',
                        policies: 'Medical, Vision, Dental',
                      },
                      {
                        planName: 'Tennessee Valley Authority',
                        subscriber: 'Ellie Williams',
                        id: 'ABC1234555555',
                        policies: 'Dental',
                      },
                    ],
                    accessStatus: 'Full Access',
                  },
                  {
                    memberName: 'Jane Doe',
                    dob: '01/01/1988',
                    otherPlanData: [
                      {
                        planName: 'BlueCross BlueShield of Tennessee',
                        subscriber: 'Ellie Williams',
                        id: 'ABC1234567890',
                        policies: 'Medical, Vision, Dental',
                      },
                    ],
                    accessStatus: 'No Access',
                  },
                ]}
              />
            </Card>
          </Column>
          {/* ) : ( // Error Handling uncomment while API Integration */}
          {/* <ErrorInfoCard
              className="mt-4"
              errorText="You have not been granted access to other member's plan information"
            />
          )} */}
        </section>
      </Column>
    </main>
  );
};

export default AccessOthersInformation;
