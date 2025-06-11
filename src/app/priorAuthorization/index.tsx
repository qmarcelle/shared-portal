'use client';

import { PriorAuthorizationCardSection } from '@/app/priorAuthorization/components/PriorAuthorizationCardSection';
import { ErrorInfoCard } from '@/components/composite/ErrorInfoCard';
import { AppLink } from '@/components/foundation/AppLink';
import { Column } from '@/components/foundation/Column';
import { Header } from '@/components/foundation/Header';
import { externalIcon } from '@/components/foundation/Icons';
import { RichText } from '@/components/foundation/RichText';
import { Row } from '@/components/foundation/Row';
import Image from 'next/image';
import { PriorAuthData } from './models/app/priorAuthAppData';

export type PriorAuthorizationProps = {
  data: PriorAuthData;
};

const onClickCallBack = (url: string) => {
  window.open(url, '_blank');
};

const PriorAuthorization = ({ data }: PriorAuthorizationProps) => {
  function getAuthorizationLanguageForBlueCare() {
    return (
      <Column
        className="body-1 flex-grow align-top mt-4 md:!flex !block"
        key={2}
      >
        We&apos;ve put together a list of how and when to get referrals and
        authorizations for specific
        <Row>
          services.
          <AppLink
            label="See what we cover"
            className="link !flex caremark pt-0"
            callback={() => {
              onClickCallBack(
                process.env.NEXT_PUBLIC_BLUECARE_LANGUAGE_URL ?? '',
              );
            }}
            icon={<Image src={externalIcon} alt="external" />}
          />
        </Row>
      </Column>
    );
  }

  function getAuthorizationLanguage() {
    return (
      <Row className="body-1 flex-grow align-top mt-4 md:!flex !block" key={2}>
        Looking for a prescription drug pre-approval? Go to your
        <AppLink
          label="caremark.com account"
          className="link !flex caremark pt-0"
          icon={<Image src={externalIcon} alt="external" />}
          url={`/sso/launch?PartnerSpId=${process.env.NEXT_PUBLIC_IDP_CVS_CAREMARK}`}
        />
      </Row>
    );
  }

  return (
    <main className="flex flex-col justify-center items-center page">
      <Column className="app-content app-base-font-color">
        <Header text="Prior Authorization" type="title-1" />
        <section className="flex justify-start self-start">
          <RichText
            spans={[
              <Row
                className="body-1 flex-grow align-top mt-4 md:!flex !block"
                key={1}
              >
                Need more than two years of prior authorizations?{' '}
                <AppLink
                  label="Start a chat"
                  className="link !flex caremark pt-0"
                />
                or call us at [{data.phoneNumber}].
              </Row>,
              data.authorizationType === 'blueCare'
                ? getAuthorizationLanguageForBlueCare()
                : getAuthorizationLanguage(),
            ]}
          />
        </section>
        {data.priorAuthDetails == null && (
          <>
            <Column>
              <section className="flex justify-start self-start p-4">
                <ErrorInfoCard errorText="There was a problem loading your information. Please try refreshing the page or returning to this page later." />
              </section>
            </Column>
          </>
        )}
        {data.priorAuthDetails && (
          <section
            className="flex flex-row items-start app-body mt-2"
            id="Filter"
          >
            <Column className="flex-grow page-section-63_33 items-stretch">
              {data && (
                <PriorAuthorizationCardSection
                  sortBy={[
                    {
                      label: 'Date (Most Recent)',
                      value: '43',
                      id: '1',
                    },
                    {
                      label: 'Status (Denied First)',
                      value: '2',
                      id: '2',
                    },
                  ]}
                  onSelectedDateChange={() => {}}
                  selectedDate={{
                    label: 'Date (Most Recent)',
                    value: '43',
                    id: '1',
                  }}
                  priorAuthDetails={data.priorAuthDetails}
                />
              )}
            </Column>
          </section>
        )}
      </Column>
    </main>
  );
};

export default PriorAuthorization;
