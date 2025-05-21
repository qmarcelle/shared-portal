import { getFormularyDetails } from '@/app/pharmacy/actions/getFormularyDetails';
import { auth } from '@/auth';
import { ErrorInfoCard } from '@/components/composite/ErrorInfoCard';
import { Column } from '@/components/foundation/Column';
import { InlineLink } from '@/components/foundation/InlineLink';
import { Row } from '@/components/foundation/Row';
import { Spacer, SpacerX } from '@/components/foundation/Spacer';
import { TextBox } from '@/components/foundation/TextBox';
import { Title } from '@/components/foundation/Title';
import { Metadata } from 'next';
import PlanDocuments from '.';

export const metadata: Metadata = {
  title: 'Plan Documents',
};

const PlanDocumentsPage = async () => {
  const session = await auth();
  const formularyDetails = await getFormularyDetails();
  return (
    <main className="flex flex-col justify-center items-center page">
      <Column className="app-content app-base-font-color">
        <Spacer size={32} />
        <section>
          <Title
            className="title-1"
            aria-label="Plan Documents"
            text="Plan Documents"
          />
          <Spacer size={16} />
          <TextBox
            className="max-w-[650px]"
            text="We’ve put together quick-reference guides that explain your plan details and help you get the most from your benefits."
          />
          <Spacer size={16} />
          <Row className="body-1">
            <TextBox
              className="inline"
              text="To request a printed version of any of these materials, please"
            />
            <SpacerX size={8} />
            <InlineLink
              className="inline py-0 pl-0 pr-0"
              label=" contact us"
              url="/member/support"
            />
            <TextBox className="inline" text="." />
          </Row>
        </section>
        {session!.user.vRules && (
          <PlanDocuments
            visibilityRules={session!.user.vRules}
            formularyURL={formularyDetails.data?.formularyURL ?? ''}
          />
        )}
        {session!.user.vRules === undefined && (
          <ErrorInfoCard
            errorText="We experienced an issue loading your benefits information. Please try again later."
            className="mt-4"
          />
        )}
      </Column>
    </main>
  );
};

export default PlanDocumentsPage;
