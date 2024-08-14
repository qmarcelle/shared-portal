import { IComponent } from '@/components/IComponent';
import { Card } from '@/components/foundation/Card';
import { Column } from '@/components/foundation/Column';
import { Row } from '@/components/foundation/Row';
import { Spacer, SpacerX } from '@/components/foundation/Spacer';
import { StatusLabel } from '@/components/foundation/StatusLabel';
import { TextBox } from '@/components/foundation/TextBox';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { useMediaQuery } from 'react-responsive';
import DentalIcon from '../../../../public/assets/dental.svg';
import MedicalIcon from '../../../../public/assets/medical.svg';
import MentalCareIcon from '../../../../public/assets/mental_health.svg';
import PharmacyIcon from '../../../../public/assets/pharmacy.svg';
import PrimaryCareIcon from '../../../../public/assets/primary_care.svg';
import VisionIcon from '../../../../public/assets/vision.svg';

interface ClaimItemProps extends IComponent {
  // TODO: Find the correct model and type it here
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  claimInfo: any;
}

export const ClaimItem = ({
  claimInfo,
  onClick,
  className,
}: ClaimItemProps) => {
  const isMobile = useMediaQuery({ maxWidth: 768 });
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  function getSuccessStatus() {
    console.log(claimInfo.claimStatus);
    switch (claimInfo.claimStatus) {
      case 'Processed':
        return 'success';
      case 'Denied':
        return 'error';
      case 'Pending':
        return 'neutral';
      case 'Partial Approval':
        return 'partialapproval';
      case 'Approved':
        return 'success';
      default:
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
    } else if (claimInfo.claimType == 'PrimaryCare') {
      return PrimaryCareIcon;
    } else if (claimInfo.claimType == 'MentalCare') {
      return MentalCareIcon;
    } else {
      return PharmacyIcon;
    }
  }

  function getDesktopView() {
    return (
      <Row
        className={
          claimInfo.totalBilled
            ? 'flex flex-row align-top mt-8 mb-8 ml-4 mr-4'
            : 'flex flex-row align-top m-4 mt-8'
        }
      >
        <Image
          src={getClaimIcon()}
          className={
            claimInfo.viewCareFlag
              ? (className = 'w-[40px] h-[40px]')
              : (className = 'icon')
          }
          alt={claimInfo.claimType}
        />

        <Spacer axis="horizontal" size={8} />
        <Column className="flex flex-col flex-grow">
          <p className="font-bold" style={{ color: 'var(--primary-color)' }}>
            {claimInfo.issuer}
          </p>
          {!claimInfo.claimsFlag &&
            !claimInfo.priorAuthFlag &&
            !claimInfo.viewCareFlag && (
              <span className="body-1">
                Visited on {claimInfo.serviceDate}, For {claimInfo.memberName}
              </span>
            )}

          {claimInfo.viewCareFlag && (
            <span className="body-1 mt-2">
              {claimInfo.serviceDate} {claimInfo.memberName}
            </span>
          )}
          {claimInfo.claimsFlag && (
            <Row className="mt-2">
              <Row className="flex flex-col mr-2">
                <span className="body-1">
                  Visited on {claimInfo.serviceDate}
                </span>
                <span className="body-1 mt-2">For {claimInfo.memberName}</span>
              </Row>
              <Row className="flex flex-col mr-4 ml-4">
                <span className="body-1" style={{ opacity: '0.7' }}>
                  Total Billed
                </span>
                <span className="body-1 mt-2">
                  {claimInfo.totalBilled != null
                    ? `$${claimInfo.totalBilled}`
                    : '--'}
                </span>
              </Row>
              <Row className="flex flex-col mr-4 ml-4">
                <span className="body-1" style={{ opacity: '0.7' }}>
                  Plan Paid
                </span>
                <span className="body-1 mt-2">
                  {claimInfo.planPaid != null ? `$${claimInfo.planPaid}` : '--'}
                </span>
              </Row>
              <Row className="flex flex-col mr-4 ml-4">
                <span className="body-1" style={{ opacity: '0.7' }}>
                  My Share
                </span>
                <span className="body-1 mt-2 font-bold">
                  {claimInfo.myShare != null ? `$${claimInfo.myShare}` : '--'}
                </span>
              </Row>
            </Row>
          )}
          {claimInfo.priorAuthFlag && (
            <Row className="mt-2">
              <Column className="flex flex-col mr-2">
                <span className="body-1">
                  Visited on {claimInfo.serviceDate}
                </span>
                <span className="body-1 mt-2">For {claimInfo.memberName}</span>
              </Column>
              <Column className="flex flex-col mr-4 ml-4">
                <span className="body-1" style={{ opacity: '0.7' }}>
                  Referred by
                </span>
                <span className="body-1 mt-2">{claimInfo.ReferredBy}</span>
              </Column>
              <Column className="flex flex-col mr-4 ml-4">
                <span className="body-1" style={{ opacity: '0.7' }}>
                  Referred to
                </span>
                <span className="body-1 mt-2">{claimInfo.ReferredTo}</span>
              </Column>
            </Row>
          )}
        </Column>
        <Row className="flex flex-col items-end">
          <StatusLabel
            label={claimInfo.claimStatus}
            status={getSuccessStatus()}
          />
          {!claimInfo.claimsFlag ||
            (!claimInfo.priorAuthFlag && (
              <p className="body-1 font-bold">
                {claimInfo.claimTotal != null ? `$${claimInfo.claimTotal}` : ''}
              </p>
            ))}
        </Row>
      </Row>
    );
  }

  function getMobileView() {
    return (
      <Column className="m-4">
        <Row>
          <Image
            src={getClaimIcon()}
            className={
              claimInfo.viewCareFlag
                ? (className = 'w-[40px] h-[40px]')
                : (className = 'icon')
            }
            alt={claimInfo.claimType}
          />

          <SpacerX size={8} />
          <TextBox className="body-1 font-bold" text={claimInfo.issuer} />
        </Row>
        <Spacer size={8} />
        <Row className="justify-between">
          <StatusLabel
            label={claimInfo.claimStatus}
            status={getSuccessStatus()}
          />
          {!claimInfo.claimsFlag ||
            (!claimInfo.priorAuthFlag && (
              <TextBox
                className="font-bold"
                text={
                  claimInfo.claimTotal != null ? `$${claimInfo.claimTotal}` : ''
                }
              />
            ))}
        </Row>
        {!claimInfo.claimsFlag ||
          (claimInfo.priorAuthFlag && (
            <TextBox
              text={`Visited on ${claimInfo.serviceDate}, For ${claimInfo.memberName}`}
            />
          ))}
        {claimInfo.claimsFlag && (
          <Row className="flex-grow mt-2">
            <Column className="flex flex-col flex-grow mr-5">
              <span className="body-1">Visited on</span>
              <span className="body-1">{claimInfo.serviceDate}</span>
              <span className="body-1 mt-2">For {claimInfo.memberName}</span>
            </Column>
            <Column className="flex flex-col flex-grow">
              <span className="body-1" style={{ opacity: '0.7' }}>
                My Share
              </span>
              <span className="body-1 mt-2 font-bold">
                {claimInfo.myShare != null ? `$${claimInfo.myShare}` : '--'}
              </span>
            </Column>
          </Row>
        )}
        {claimInfo.priorAuthFlag && (
          <Row className="flex-grow mt-2">
            <Column className="flex flex-col flex-grow mr-5">
              <span className="body-1">Visited on</span>
              <span className="body-1">{claimInfo.serviceDate}</span>
              <span className="body-1 mt-2">For {claimInfo.memberName}</span>
            </Column>
          </Row>
        )}
        {claimInfo.viewCareFlag && (
          <span className="body-1 mt-2 ">
            {claimInfo.serviceDate} {claimInfo.memberName}
          </span>
        )}
      </Column>
    );
  }

  return isClient ? (
    <Card
      className={`cursor-pointer ${className}`}
      type="elevated"
      onClick={onClick}
    >
      {isMobile ? getMobileView() : getDesktopView()}
    </Card>
  ) : null;
};
