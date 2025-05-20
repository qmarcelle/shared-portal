'use client';

import { AccordionListCard } from '@/components/composite/AccordionListCard';
import { Card } from '@/components/foundation/Card';
import { Column } from '@/components/foundation/Column';
import { Header } from '@/components/foundation/Header';
import { Spacer } from '@/components/foundation/Spacer';
import { TextBox } from '@/components/foundation/TextBox';
import { AuthorizationForm } from './components/AuthorizationForm';
import { BecomeRepresentative } from './components/BecomeRepresentative';
import { MembersRepresented } from './components/MembersRepresented';
import { RepresentativeViewDetails } from './models/representativeDetails';

export type PersonalRepresentativeAccessProps = {
  representativeDetails?: RepresentativeViewDetails;
  isImpersonated?: boolean;
};

const PersonalRepresentativeAccess = ({
  representativeDetails,
  isImpersonated = false,
}: PersonalRepresentativeAccessProps) => {
  return (
    <div className="flex flex-col justify-center items-center page">
      <Column className="app-content app-base-font-color">
        <Header type="title-1" text="Personal Representative Access" />
        <Spacer size={12} />
        <TextBox
          className="w-2/3"
          text="Personal representatives have the legal authority to make health care decisions on behalf of the member."
        />
        <Spacer size={22} />
        <section className="flex flex-row items-start app-body">
          <Column className="flex-grow page-section-36_67 items-stretch">
            <AccordionListCard
              header="Understanding Access"
              information={[
                {
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
                isRepresentative={
                  representativeDetails?.isRepresentativeLoggedIn
                }
                isRegistered={
                  representativeDetails?.representativeData ? true : false
                }
                visibilityRules={representativeDetails?.visibilityRules}
                representativesData={
                  representativeDetails?.representativeData ?? null
                }
                allowUpdates={!isImpersonated}
              />
            </Card>

            <AuthorizationForm
              isMatureMinor={representativeDetails!.isMatureMinor}
              fullAccess={true}
              isRepresentative={representativeDetails?.isRepresentativeLoggedIn}
              linkLabel="Download Authorization Form"
            />
          </Column>
        </section>
      </Column>
    </div>
  );
};

export default PersonalRepresentativeAccess;
