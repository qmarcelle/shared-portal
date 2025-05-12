'use client';

import { ErrorInfoCard } from '@/components/composite/ErrorInfoCard';
import { Card } from '@/components/foundation/Card';
import { Column } from '@/components/foundation/Column';
import {
  downloadIcon,
  externalIcon,
  prescriptionIcon,
  searchCareLogo,
  searchPharmacyIcon,
} from '@/components/foundation/Icons';
import Iframe from '@/components/foundation/Iframe';
import { InlineLink } from '@/components/foundation/InlineLink';
import { Row } from '@/components/foundation/Row';
import { Spacer } from '@/components/foundation/Spacer';
import { TextBox } from '@/components/foundation/TextBox';
import { Title } from '@/components/foundation/Title';
import { isBenefitBookletEnabled } from '@/visibilityEngine/computeVisibilityRules';
import Image from 'next/image';
import { PlanDocumentsData } from './models/app/plan_documents_data';

type PlanDocumentsProps = {
  data: PlanDocumentsData;
};
const PlanDocuments = ({ data }: PlanDocumentsProps) => {
  const isBenefitBooklet = isBenefitBookletEnabled(data?.visibilityRules);

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

          <TextBox
            className="inline"
            text="To request a printed version of any of these materials, please "
          />
          <InlineLink
            className="inline py-0 pl-0 pr-0"
            label="contact us"
            url="/member/support"
          />
          <TextBox className="inline" text="." />
        </section>

        {(isBenefitBooklet || data?.visibilityRules?.medicare) && (
          <>
            <section>
              <Spacer size={32} />
              <Row className="justify-between">
                <Column className="w-[50%]">
                  <Card className="py-3 px-4" onClick={() => {}}>
                    <Row>
                      <Image
                        className="size-10"
                        src={searchCareLogo}
                        alt="link"
                      />
                      <TextBox
                        text="Provider Directory"
                        className="inline my-auto body-bold primary-color mx-2"
                      />
                      <Image
                        src={externalIcon}
                        className="-mt-[4px]"
                        alt="link"
                      />
                    </Row>
                  </Card>
                  <Card className="py-3 px-4 my-4" onClick={() => {}}>
                    <Row>
                      <Image src={prescriptionIcon} alt="link" />
                      <TextBox
                        text="Medication List (Formulary) 2025"
                        className="inline my-auto body-bold primary-color mx-2"
                      />
                      <Image
                        src={downloadIcon}
                        className="-mt-[4px]"
                        alt="link"
                      />
                    </Row>
                  </Card>
                </Column>
                <Column className="w-[50%] ml-4">
                  <Card className="py-3 px-4" onClick={() => {}}>
                    <Row>
                      <Image src={searchPharmacyIcon} alt="link" />
                      <TextBox
                        text="Pharmacy Directory"
                        className="inline my-auto body-bold primary-color mx-2"
                      />
                      <Image
                        src={externalIcon}
                        className="-mt-[4px]"
                        alt="link"
                      />
                    </Row>
                  </Card>
                </Column>
              </Row>
              {isBenefitBooklet && (
                <>
                  {data?.iframeContent ? (
                    <Iframe
                      id="eoc_portal"
                      title="Benefit Booklet"
                      srcdoc={data?.iframeContent}
                    />
                  ) : (
                    <ErrorInfoCard
                      className="mt-4"
                      errorText="We're not able to load Benefit Booklet right now. Please try again later."
                    />
                  )}
                </>
              )}
            </section>
          </>
        )}
        <Spacer size={32} />
      </Column>
    </main>
  );
};

export default PlanDocuments;
