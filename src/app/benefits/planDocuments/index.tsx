'use client';

import {
  CVS_DEEPLINK_MAP,
  CVS_PHARMACY_SEARCH_FAST,
} from '@/app/sso/ssoConstants';
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
import { Spacer, SpacerX } from '@/components/foundation/Spacer';
import { TextBox } from '@/components/foundation/TextBox';
import { Title } from '@/components/foundation/Title';
import { isBenefitBookletEnabled } from '@/visibilityEngine/computeVisibilityRules';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { PlanDocumentsData } from './models/app/plan_documents_data';

type PlanDocumentsProps = {
  data: PlanDocumentsData;
  formularyURL?: string;
};
const PlanDocuments = ({ data, formularyURL }: PlanDocumentsProps) => {
  const isBenefitBooklet = isBenefitBookletEnabled(data?.visibilityRules);
  const router = useRouter();
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

        {(isBenefitBooklet || data?.visibilityRules?.medicare) && (
          <>
            <section>
              <Spacer size={32} />
              <Row>
                <Column className="w-[36%]">
                  <Card
                    className="py-3 px-4"
                    onClick={() => {
                      router.push(
                        `/sso/launch?PartnerSpId=${process.env.NEXT_PUBLIC_IDP_PROVIDER_DIRECTORY}&alternateText=Provider Directory`,
                      );
                    }}
                  >
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
                  <Card
                    className="py-3 px-4 my-4"
                    onClick={() => {
                      window.open(
                        `/assets/formularies/${formularyURL}/Drug-Formulary-List.pdf`,
                      );
                    }}
                  >
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
                <Column className="w-[36%] ml-4">
                  <Card
                    className="py-3 px-4"
                    onClick={() => {
                      router.push(
                        `/sso/launch?PartnerSpId=${process.env.NEXT_PUBLIC_IDP_CVS_CAREMARK}&TargetResource=${process.env.NEXT_PUBLIC_CVS_SSO_TARGET!.replace('{DEEPLINK}', CVS_DEEPLINK_MAP.get(CVS_PHARMACY_SEARCH_FAST)!)}&alternateText=Pharmacy Directory`,
                      );
                    }}
                  >
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
                      className="mt-4 w-[73%]"
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
