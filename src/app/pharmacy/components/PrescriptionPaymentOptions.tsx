import { AppLink } from '@/components/foundation/AppLink';
import { Divider } from '@/components/foundation/Divider';
import { externalIcon } from '@/components/foundation/Icons';
import { RichText } from '@/components/foundation/RichText';
import { Spacer } from '@/components/foundation/Spacer';
import { TextBox } from '@/components/foundation/TextBox';
import { IComponent } from '@/components/IComponent';
import { AnalyticsData } from '@/models/app/analyticsData';
import { googleAnalytics } from '@/utils/analytics';
import Image from 'next/image';
import { ReactNode } from 'react';
import { Column } from '../../../components/foundation/Column';

interface PrescriptionPaymentsOptionsProps extends IComponent {
  icon?: ReactNode;
  isMedicare: boolean;
  isBlueCarePlus: boolean;
}

const trackLinkAnalytics = (clickText: string, clickType: string) => {
  const analytics: AnalyticsData = {
    click_text: clickText.toLowerCase(),
    click_url: window.location.href,
    event: clickType,
    action: 'click',
    element_category: 'content interaction',
    content_type: undefined,
  };
  googleAnalytics(analytics);
};

export const PrescriptionPaymentsOptions = ({
  icon = <Image alt="" src={externalIcon} />,
  isMedicare,
  isBlueCarePlus,
}: PrescriptionPaymentsOptionsProps) => {
  const callRetroactive = () => {
    trackLinkAnalytics('get a retroactive election', 'internal_link_click');
    if (isMedicare) {
      window.open(
        'https://www.bcbst-medicare.com/get-care/pharmacies-and-prescriptions/medicare-pharmacy',
        '_blank',
      );
    } else if (isBlueCarePlus) {
      window.open(
        'https://bluecareplus.bcbst.com/get-care/pharmacies-and-prescriptions/bluecare-plus-pharmacy',
        '_blank',
      );
    }
  };
  return (
    <Column>
      <AppLink
        label="Medicare Prescription Payment Plan Sign-up"
        className="pl-0"
        icon={icon}
        displayStyle="flex"
        url={`/sso/launch?PartnerSpId=${process.env.NEXT_PUBLIC_IDP_M3P}`}
        callback={
          trackLinkAnalytics(
            'Medicare Prescription Payment Plan Sign-up',
            'outbound_link_click',
          ) ?? undefined
        }
      />
      <Spacer size={12} />
      <RichText
        className="manage-image"
        spans={[
          <span key={0}>
            Now you can pay for your prescription drugs over time with a monthly
            payment. You can learn more by reading the{' '}
          </span>,
          <span className="link" key={1}>
            <a
              href="https://www.bcbst-medicare.com/docs/Medicare_Prescription_Payment_Plan_Fact_Sheet.pdf"
              target="_blank"
              className="link"
              onClick={
                trackLinkAnalytics('fact sheet', 'internal_link_click') ??
                undefined
              }
            >
              fact sheet
            </a>
            {''}
          </span>,
          <span key={2}>.</span>,
        ]}
      />
      <Spacer size={12} />
      <RichText
        className="manage-image"
        spans={[
          <span key={0}>
            If you had an urgent prescription filled that you paid for before we
            received and processed your enrollment in the Medicare Prescription
            Payment Plan, you may be able to{' '}
          </span>,
          <span className="link" key={1}>
            <a
              className="link"
              target="_blank"
              onClick={() => callRetroactive()}
            >
              get a retroactive election
            </a>
          </span>,
          <span key={2}> into the program.</span>,
        ]}
      />
      <Spacer size={12} />
      <RichText
        className="manage-image"
        spans={[
          <span key={0}>Learn more about </span>,
          <span className="link" key={1}>
            <a
              className="link"
              href="https://www.bcbst-medicare.com/use-insurance/health-care-rights/medicare"
              target="_blank"
              onClick={
                trackLinkAnalytics(
                  'making a complaint',
                  'internal_link_click',
                ) ?? undefined
              }
            >
              making a complaint
            </a>
            {''}
          </span>,
          <span key={2}>.</span>,
        ]}
      />
      <Spacer size={21} />
      <Divider />
      <Spacer size={21} />
      <AppLink
        label="Social Security Extra Help Program"
        className="pl-0"
        icon={icon}
        displayStyle="flex"
        url="https://www.ssa.gov/medicare/part-d-extra-help"
        callback={
          trackLinkAnalytics(
            'social security extra help program',
            'outbound_link_click',
          ) ?? undefined
        }
      />
      <Spacer size={12} />
      <TextBox text="If you need help paying for your prescriptions, Social Security’s Extra Help program could lower your costs." />
    </Column>
  );
};
