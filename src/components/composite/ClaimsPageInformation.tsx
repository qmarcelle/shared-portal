import { ClaimDetails } from '@/models/claim_details';
import { toPascalCase } from '@/utils/pascale_case_formatter';
import Image from 'next/image';
import DentalIcon from '../../../public/assets/dental.svg';
import MedicalIcon from '../../../public/assets/medical.svg';
import PharmacyIcon from '../../../public/assets/pharmacy.svg';
import VisionIcon from '../../../public/assets/vision.svg';
import { AppLink } from '../foundation/AppLink';
import { Column } from '../foundation/Column';
import { Header } from '../foundation/Header';
import { externalIcon } from '../foundation/Icons';
import { Row } from '../foundation/Row';
import { Spacer } from '../foundation/Spacer';
import { StatusLabel, StatusLabelEnum } from '../foundation/StatusLabel';
import { TextBox } from '../foundation/TextBox';

interface ClaimDetailsProps {
  claimInfo: ClaimDetails;
}

export const ClaimsPageInformation = ({ claimInfo }: ClaimDetailsProps) => {
  function getSuccessStatus() {
    console.log(claimInfo.claimStatus);
    if (
      claimInfo.claimStatus == 'Processed' ||
      claimInfo.claimStatus == 'Approved' ||
      claimInfo.claimStatus == 'Completed'
    ) {
      return StatusLabelEnum.SUCCESS;
    } else if (claimInfo.claimStatus == 'Denied') {
      return StatusLabelEnum.ERROR;
    } else if (claimInfo.claimStatus == 'Pending') {
      return StatusLabelEnum.NEUTRAL;
    } else {
      return StatusLabelEnum.EMPTY;
    }
  }

  function getClaimIcon() {
    if (claimInfo.claimType == 'Medical') {
      return MedicalIcon;
    } else if (claimInfo.claimType == 'Dental') {
      return DentalIcon;
    } else if (claimInfo.claimType == 'Vision') {
      return VisionIcon;
    } else {
      return PharmacyIcon;
    }
  }
  function getProviderLink() {
    if (claimInfo.claimType == 'Medical') {
      const provId = claimInfo.providerId ?? '';
      return (
        <Column>
          <AppLink
            label="Review This Provider"
            className="link !flex"
            icon={<Image src={externalIcon} alt="" />}
            url={`/sso/launch?PartnerSpId=${process.env.NEXT_PUBLIC_IDP_VITALSPRP}&TargetResource=${process.env.NEXT_PUBLIC_VITALS_PRP_SSO_TARGET!.replace('{PROV_ID}', provId)}&provId=${provId}`}
          />
        </Column>
      );
    }
  }

  function getRXId(): import('react').ReactNode {
    if (claimInfo.claimType == 'Pharmacy') {
      return (
        <Column>
          <Row className="py-1">
            <TextBox text="RX #:" />
            <Spacer axis="horizontal" size={8} />
            <TextBox className="font-bold" text="1234567890" />
          </Row>
        </Column>
      );
    }
  }

  return (
    <Column className="app-content">
      <Spacer size={32} />
      <Row className="flex flex-row">
        <Image src={getClaimIcon()} className="w-[40px] h-[40px]" alt="" />
        <Column>
          <Header className="pl-3" type="title-1" text={claimInfo.issuer} />
          {getProviderLink()}
          <section className="ml-2">
            <Spacer size={8} />
            <Row className="flex flex-col items-start">
              <StatusLabel
                label={claimInfo.claimStatus}
                status={getSuccessStatus()}
              />
            </Row>
            <Spacer size={8} />
            <Row className="py-1">
              <TextBox text={`Visited on ${claimInfo.serviceDate}`} />
            </Row>
            <Row className="py-1">
              <TextBox text={`For ${toPascalCase(claimInfo.memberName)}`} />
            </Row>
            <Row className="py-1">
              <TextBox text="Claim ID:" />
              <Spacer axis="horizontal" size={8} />
              <TextBox className="font-bold" text={claimInfo.id} />
            </Row>
            {getRXId()}
            <Row className="py-1">
              <TextBox text="Network Status:" />
              <Spacer axis="horizontal" size={8} />
              <TextBox className="font-bold" text="In-Network" />
            </Row>
          </section>
        </Column>
      </Row>
    </Column>
  );
};
