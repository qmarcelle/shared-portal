import { ClaimDetails } from '@/models/claim_details';
import { AppLink } from '../foundation/AppLink';
import { Column } from '../foundation/Column';
import { Header } from '../foundation/Header';
import { extrenalIcon } from '../foundation/Icons';
import Image from 'next/image';
import { Spacer } from '../foundation/Spacer';
import MedicalIcon from '../../../public/Medical.svg';
import PharmacyIcon from '../../../public/Pharmacy.svg';
import DentalIcon from '../../../public/Dental.svg';
import VisionIcon from '../../../public/Vision.svg';
import { Row } from '../foundation/Row';
import { StatusLabel } from '../foundation/StatusLabel';
import { TextBox } from '../foundation/TextBox';

interface ClaimDetailsProps {
  claimInfo: ClaimDetails;
}

export const ClaimsPageInformation = ({ claimInfo }: ClaimDetailsProps) => {
  function getSuccessStatus() {
    console.log(claimInfo.claimStatus);
    if (claimInfo.claimStatus == 'Processed') {
      return 'success';
    } else if (claimInfo.claimStatus == 'Denied') {
      return 'error';
    } else if (claimInfo.claimStatus == 'Pending') {
      return 'neutral';
    } else {
      return 'empty';
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
      return (
        <Column>
          <AppLink
            label="Review This Provider"
            className="link flex "
            icon={<Image src={extrenalIcon} alt="external" />}
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
        <Image
          src={getClaimIcon()}
          className="w-[40px] h-[40px]"
          alt={claimInfo.claimType}
        />
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
              <TextBox text={`For ${claimInfo.memberName}`} />
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
