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
import { Row } from '@/components/foundation/Row';
import { Spacer } from '@/components/foundation/Spacer';
import { TextBox } from '@/components/foundation/TextBox';
import { VisibilityRules } from '@/visibilityEngine/rules';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

type PlanDocumentsProps = {
  formularyURL?: string;
  visibilityRules: VisibilityRules;
};
const PlanDocuments = ({
  formularyURL,
  visibilityRules,
}: PlanDocumentsProps) => {
  const router = useRouter();
  return (
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
              <Image className="size-10" src={searchCareLogo} alt="link" />
              <TextBox
                text="Provider Directory"
                className="inline my-auto body-bold primary-color mx-2"
              />
              <Image src={externalIcon} className="-mt-[4px]" alt="link" />
            </Row>
          </Card>

          {formularyURL && (
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
                <Image src={downloadIcon} className="-mt-[4px]" alt="link" />
              </Row>
            </Card>
          )}
        </Column>
        {visibilityRules.pharmacy && (
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
                <Image src={externalIcon} className="-mt-[4px]" alt="link" />
              </Row>
            </Card>
          </Column>
        )}
      </Row>

      <Iframe
        id="aFrame"
        title="Benefit Booklet"
        src={`${process.env.NEXT_PUBLIC_EWSAPPS_URL}/ElectronicEOCWeb/membereoclandingpage.do`}
        errorComponent={
          <ErrorInfoCard
            className="mt-4 w-[73%]"
            errorText="There was an issue loading your Plan Documents. Please try again later."
          />
        }
        className="min-h-[1200px]"
      />
    </section>
  );
};

export default PlanDocuments;
