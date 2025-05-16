import { IComponent } from '@/components/IComponent';
import { Card } from '@/components/foundation/Card';
import { Column } from '@/components/foundation/Column';
import { Row } from '@/components/foundation/Row';
import { Spacer } from '@/components/foundation/Spacer';
import { StatusLabel } from '@/components/foundation/StatusLabel';
import { TextBox } from '@/components/foundation/TextBox';
import { ClaimDetails } from '@/models/claim_details';
import { formatCurrency } from '@/utils/currency_formatter';
import Image from 'next/image';
import DentalIcon from '../../../public/assets/dental.svg';
import MedicalIcon from '../../../public/assets/medical.svg';
import PharmacyIcon from '../../../public/assets/pharmacy.svg';
import VisionIcon from '../../../public/assets/vision.svg';
import { Header } from '../foundation/Header';

interface ClaimItemProps extends IComponent {
  // TODO: Update the model and type while integrating the api.
  claimInfo: ClaimDetails;
  callBack?: (id: string) => void;
}

export const ClaimItem = ({
  claimInfo,
  className,
  callBack,
}: ClaimItemProps) => {
  function getSuccessStatus() {
    switch (claimInfo.claimStatus) {
      case 'Processed':
        return 'success';
      case 'Paid':
        return 'success';
      case 'Denied':
        return 'error';
      case 'Pending':
        return 'neutral';
      case 'Partial Approval':
        return 'partialapproval';
      case 'Approved':
        return 'success';
      case 'Completed':
        return 'success';
      default:
        return 'empty';
    }
  }

  function getFormattedDataValue(
    value: number | string | null,
    defaultValue: string,
    isDollar: boolean,
  ): string | undefined {
    if (value) {
      if (isDollar) {
        return formatCurrency(value as number);
      } else {
        // For non-dollar values, format numbers with 2 decimal places without currency symbol
        return typeof value === 'number' ? value.toFixed(2) : (value as string);
      }
    } else {
      return defaultValue;
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

  function getClaimItem() {
    return (
      <section className="md:flex md:flex-row align-top m-4">
        <Image
          src={getClaimIcon()}
          className="icon max-md:hidden"
          alt={claimInfo.claimType}
        />
        <Spacer axis="horizontal" size={8} />
        <Column className="min-w-[95%]">
          <section className="md:flex md:flex-row md:justify-between">
            <section className="flex flex-row mb-[10px] md:flex-col">
              <Image
                src={getClaimIcon()}
                className="icon md:hidden"
                alt={claimInfo.claimType}
              />
              <Header
                text={claimInfo.issuer}
                type="title-3"
                className="body-bold primary-color max-md:ml-[5px]"
              />
            </section>
            <section className="flex flex-row justify-between md:flex-col max-lg:mr-[5px]">
              <StatusLabel
                label={claimInfo.claimStatus}
                status={getSuccessStatus()}
              />
              {claimInfo.isMiniCard && (
                <Column className="md:hidden">
                  {claimInfo.columns
                    ?.filter((column) => column.label === 'My Share')
                    .map((column, index) => (
                      <TextBox
                        key={index}
                        className="body-1 font-bold mt-2"
                        text={
                          getFormattedDataValue(
                            column.value,
                            column.defaultValue,
                            column.isDollar ?? false,
                          ) ?? column.defaultValue
                        }
                      />
                    ))}

                  {!claimInfo.columns && (
                    <TextBox
                      className="body-1 font-bold mt-2"
                      text={
                        claimInfo.claimTotal != null
                          ? `$${claimInfo.claimTotal}`
                          : ''
                      }
                    />
                  )}
                </Column>
              )}
            </section>
          </section>
          {claimInfo.isMiniCard && (
            <Row className="justify-between">
              <Column>
                <TextBox
                  className="body-1 mt-2"
                  text={`Visited on ${claimInfo.serviceDate}, For ${claimInfo.memberName}`}
                />
              </Column>

              <Column className="max-md:hidden">
                {claimInfo.columns
                  ?.filter((column) => column.label === 'My Share')
                  .map((column, index) => (
                    <TextBox
                      key={index}
                      className="body-1 font-bold mt-2"
                      text={
                        getFormattedDataValue(
                          column.value,
                          column.defaultValue,
                          column.isDollar ?? false,
                        ) ?? column.defaultValue
                      }
                    />
                  ))}

                {!claimInfo.columns && (
                  <TextBox
                    className="body-1 font-bold mt-2"
                    text={
                      claimInfo.claimTotal != null
                        ? `$${claimInfo.claimTotal}`
                        : ''
                    }
                  />
                )}
              </Column>
            </Row>
          )}
          {claimInfo.columns && !claimInfo.isMiniCard && (
            <Row className="mt-2">
              <Column className="mr-2 flex-grow max-md:hidden">
                <TextBox
                  className="body-1"
                  text={`Visited on ${claimInfo.serviceDate}`}
                />
                <TextBox
                  className="body-1 mt-2"
                  text={`For ${claimInfo.memberName}`}
                />
              </Column>
              <Column className="flex-grow mr-5 md:hidden">
                <TextBox className="body-1" text="Visited on" />
                <TextBox className="body-1" text={claimInfo.serviceDate} />
                <TextBox
                  className="body-1 mt-2"
                  text={`For ${claimInfo.memberName}`}
                />
              </Column>
              {claimInfo.columns.map((item, index) => (
                <Column
                  className={`mx-4 flex-grow ${!item.isVisibleInMobile ? 'max-md:hidden' : ''}`}
                  key={index}
                >
                  <TextBox
                    className="body-1 tertiary-color"
                    text={item.label}
                  />
                  <TextBox
                    className={`body-1 mt-2 ${item.isValueBold ? 'font-bold' : ''}`}
                    text={
                      getFormattedDataValue(
                        item.value,
                        item.defaultValue,
                        item.isDollar ?? false,
                      ) ?? item.defaultValue
                    }
                  />
                </Column>
              ))}
            </Row>
          )}
        </Column>
      </section>
    );
  }

  return (
    <Card
      className={`cursor-pointer ${className}`}
      type="button"
      onClick={() => callBack?.(claimInfo.encryptedClaimId ?? '')}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          callBack?.(claimInfo.encryptedClaimId ?? '');
        }
      }}
      role="button"
      aria-label={`${claimInfo.claimType} claim for ${claimInfo.memberName} from ${claimInfo.issuer} with status ${claimInfo.claimStatus}`}
      tabIndex={0}
    >
      {getClaimItem()}
    </Card>
  );
};
