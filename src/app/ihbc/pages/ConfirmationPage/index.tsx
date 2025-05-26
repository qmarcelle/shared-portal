import { Button } from '@/components/foundation/Button';
import { Column } from '@/components/foundation/Column';
import { RichText } from '@/components/foundation/RichText';
import { TextBox } from '@/components/foundation/TextBox';
import Link from 'next/link';
import { HighlightedHeader } from '../../components/HighlightedHeader';
import { useSubmitApplicationStore } from '../../stores/submitApplicationStore';

export const ConfirmationPage = () => {
  const [applicationId, restartForm] = useSubmitApplicationStore((state) => [
    state.applicationId,
    state.restartForm,
  ]);

  return (
    <Column className="gap-2">
      <HighlightedHeader text=" Confirmation" />
      <TextBox text="Confirmation of Change Request Submission" />
      <TextBox text="Thank you for your submission." />
      <TextBox text="Soon you will receive a confirmation letter in the mail outlining your changes." />
      <TextBox text="At this time, please take a moment to print this page for your records and print your application. You may also log into the system at any time to review your submitted application" />
      <TextBox text={`Your application ID number is:${applicationId}`} />
      <TextBox text="Please retain this number for your records" />
      <TextBox text="For questions regarding Summary of Benefits and Coverage (SBC) or to request a paper copy, free of charge, please call 1-800-725-6849." />
      <RichText
        spans={[
          <TextBox
            className="!inline"
            key={1}
            text="If you wish to contact us directly, please call 1-800-845-2738 or email us at "
          />,
          <Link
            key={2}
            href={`mailto:IndividualSalesSupport@bcbst.com?Subject= Change Request App ID:${applicationId}`}
            className="link"
          >
            IndividualSalesSupport@bcbst.com
          </Link>,
        ]}
      />
      <Button
        className="w-fit"
        callback={() => {
          restartForm();
        }}
        label="Return to Start a New Change Request"
      />
    </Column>
  );
};
