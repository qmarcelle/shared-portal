'use client';

import { ErrorInfoCard } from '@/components/composite/ErrorInfoCard';
import { AppLink } from '@/components/foundation/AppLink';
import { Button } from '@/components/foundation/Button';
import { Card } from '@/components/foundation/Card';
import { Checkbox } from '@/components/foundation/Checkbox';
import { Column } from '@/components/foundation/Column';
import { externalIcon } from '@/components/foundation/Icons';
import { Row } from '@/components/foundation/Row';
import { Spacer } from '@/components/foundation/Spacer';
import { TextBox } from '@/components/foundation/TextBox';
import { Title } from '@/components/foundation/Title';
import { AnalyticsData } from '@/models/app/analyticsData';
import { googleAnalytics } from '@/utils/analytics';
import Image from 'next/image';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { hipaaUpdateConsent } from '../actions/hippaConsent';

const opeInNewTab = (url: string) => {
  window.open(url, '_blank', 'noopener,noreferrer');
};

const termsAndConditionsPDF = '/assets/terms_and_conditions.pdf';
const trackLinkAnalytics = (clickText: string) => {
  const analytics: AnalyticsData = {
    click_text: clickText.toLowerCase(),
    click_url: window.location.href,
    event: 'internal_link_click',
    action: 'click',
    element_category: 'content interaction',
    content_type: undefined,
  };
  googleAnalytics(analytics);
};

const headerText = () => {
  return (
    <p className="max-w-[660px] body-1">
      {`Now you can pay for your prescription drugs over time with a monthly
      payment. You can learn more by reading this `}
      <AppLink
        className="!font-bold inline p-0"
        label="fact sheet"
        type="inlinelink"
        displayStyle="inline"
        url="https://www.bcbst-medicare.com/docs/Medicare_Prescription_Payment_Plan_Fact_Sheet.pdf"
        target="_blank"
        onClick={trackLinkAnalytics('fact sheet') ?? undefined}
      />
      {'. Or if you need help paying for prescriptions, '}
      <AppLink
        className="!font-bold inline p-0"
        // eslint-disable-next-line quotes
        label={"Social Security's Extra Help program"}
        icon={<Image className="inline" alt="" src={externalIcon} />}
        type="inlinelink"
        displayStyle="inline"
        url="https://www.ssa.gov/medicare/part-d-extra-help"
        target="_blank"
      />
      {'could lower your cost.'}
    </p>
  );
};

const checkboxPaymentPlanText = () => {
  return (
    <div>
      I have read and agree to the Medicare Prescription Payment Plan
      <AppLink
        className="!font-bold inline p-0"
        label={'Terms and Conditions'}
        type="inlinelink"
        displayStyle="inline"
        url={termsAndConditionsPDF}
        target="_blank"
      />
      .
    </div>
  );
};

const TandCTextAnalytics = (action: string) => {
  const analytics: AnalyticsData = {
    click_text: action,
    click_url: undefined,
    element_category: 'Terms and Conditions',
    action: action,
    event: 'select_content',
    content_type: 'select',
  };
  googleAnalytics(analytics);
};

const TandCLinkAnalytics = () => {
  const analytics: AnalyticsData = {
    click_text: 'I Agree',
    click_url: window.location.href,
    element_category: 'content interaction',
    action: 'click',
    event: 'internal_link_click',
    content_type: undefined,
  };
  googleAnalytics(analytics);
};

const MedicalPrescriptionPaymentPlan = () => {
  const router = useRouter();
  const [readAgreement, setReadAgreement] = useState(false);
  const [agreedTc, setAgreedTc] = useState(false);
  const [isUpdateConsent, setUpdateConsent] = useState(false);
  const [isError, setIsError] = useState(false);

  const searchParams = useSearchParams();
  const consentType = searchParams.get('consent') ?? '';
  useEffect(() => {
    if (consentType === 'update') {
      setUpdateConsent(true);
    }
    if (consentType === 'error') {
      setIsError(true);
    }
  }, []);
  const isFormValid: boolean = readAgreement && agreedTc;
  return (
    <main className="flex flex-col justify-center items-center page">
      <Column className="app-content app-base-font-color">
        <Spacer size={32} />
        <section>
          <Title
            className="title-1"
            aria-label="Medicare Prescription Payment Plan"
            text="Medicare Prescription Payment Plan"
          />
          <Spacer size={16} />
          {headerText()}
        </section>
        <Spacer size={16} />
        <section>
          <Card
            type="elevated"
            key={'Terms And Condition'}
            className={'small-section '}
          >
            <>
              <Title
                className="title-3 "
                aria-label="Terms and conditions"
                text="Terms and Conditions"
              />
              <Spacer size={16} />
              <TextBox
                className="max-w-[650px] font-bold"
                text="Please read the following:"
              />
              <Spacer size={32} />
              <div>{'By clicking on "I AGREE" button after reading this:'}</div>
              <Spacer size={16} />
              <TextBox
                text={`I understand that BlueCross BlueShield of Tennessee, Inc., and its affiliates, will disclose to WIPRO,
                 LLC any and all necessary information about me so that WIPRO, LLC can administer 
                 my participation in the Medicare Prescription Payment Plan program, including, but not limited to, 
                 my name, Medicare Beneficiary Identifier, mailing address, and status as a member of my Health Plan offered or 
                 administered by BlueCross BlueShield of Tennessee, Inc., or any of its affiliates. `}
              />
              <Spacer size={16} />
              <TextBox
                text={`I authorize BlueCross BlueShield of Tennessee, Inc., or any of its affiliates, to redirect me to the WIPRO, LLC 
                website, an external beneficiary portal, in order for me to apply for, request, opt-in or opt-out of, or otherwise
                 access participation into the Medicare Prescription Payment Plan program. I further certify that if I am accepted 
                 to the Medicare Prescription Payment Program, I have the capability to and shall pay my monthly bills. If I do not 
                 pay my monthly bills for the Medicare Prescription Payment Program, I agree to any and all consequences thereof, 
                 including without limitation disenrollment and payment of any amounts due and owing to
                 BlueCross BlueShield of Tennessee, Inc. or any of its affiliates. I authorize BlueCross BlueShield of Tennessee, Inc.,
                   any of its affiliates or WIPRO, LLC to send email, text, and other forms of communication. Unencrypted email or text 
                   messages may possibly be intercepted and read by people other than those it's addressed to. Message and data rates may apply. 
                    I further agree that my participation in the Medicare Prescription Payment Program is subject to all terms, conditions, 
                    and requirements outlined in the applicable Terms and Conditions, my Evidence of Coverage, and applicable law, 
                    regulation, or regulatory guidance.`}
              />
              <Spacer size={32} />
              <Checkbox
                label={`I read, considered, understand and agree to the contents above. I
                  understand that, by clicking on the "I AGREE" button, below, I am
                  confirming my authorization for the use, disclosure of information about
                  me and redirection to WIPRO, LLC, as described herein.`}
                callback={() => {
                  TandCTextAnalytics('I read');
                }}
                checked={readAgreement}
                onChange={(newValue) => setReadAgreement(newValue)}
              />
              <Spacer size={16} />
              <Checkbox
                label=""
                body={checkboxPaymentPlanText()}
                callback={() => {
                  TandCTextAnalytics('I Agree');
                }}
                checked={agreedTc}
                onChange={(newValue) => setAgreedTc(newValue)}
              />
              {isError && (
                <>
                  <Spacer size={32} />
                  <ErrorInfoCard
                    className="mt-4"
                    errorText="There was a problem loading your information. Please try refreshing the page or returning to this page later."
                  />
                </>
              )}
              <Spacer size={32} />
              <Row className="pl-3 pr-3">
                <Button
                  type="secondary"
                  className="outline outline-primary-content mr-4 max-w-[256px]"
                  label="Print"
                  callback={() => {
                    opeInNewTab(termsAndConditionsPDF);
                    TandCTextAnalytics('Print');
                  }}
                />
                <Button
                  type="primary"
                  className="outline outline-primary-content max-w-[256px]"
                  label="I Agree"
                  disable={!isFormValid}
                  callback={
                    isFormValid
                      ? async () => {
                          setIsError(false);
                          TandCLinkAnalytics();
                          const result =
                            await hipaaUpdateConsent(isUpdateConsent);
                          if (result.status === 200) {
                            router.replace(
                              '/sso/launch?PartnerSpId=' +
                                process.env.NEXT_PUBLIC_IDP_M3P,
                            );
                          } else {
                            setIsError(true);
                          }
                        }
                      : undefined
                  }
                />
              </Row>
            </>
          </Card>
        </section>
      </Column>
    </main>
  );
};

export default MedicalPrescriptionPaymentPlan;
