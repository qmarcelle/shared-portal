import { IComponent } from '@/components/IComponent';
import { Card } from '@/components/foundation/Card';
import { Column } from '@/components/foundation/Column';
import { Header } from '@/components/foundation/Header';
import { Row } from '@/components/foundation/Row';
import { Spacer } from '@/components/foundation/Spacer';
import { StatusLabel } from '@/components/foundation/StatusLabel';
import { TextBox } from '@/components/foundation/TextBox';
import { encrypt } from '@/utils/encryption';
import Image from 'next/image';
import MedicalIcon from '../../../../public/assets/medical.svg';
import { PriorAuthDetails } from '../models/priorAuthDetails';
import { getAuthStatus } from '../utils/authStatus';

interface ClaimItemProps extends IComponent {
  // TODO: Update the model and type while integrating the api.
  priorAuthDetails: PriorAuthDetails;
  callBack?: (id: string) => void;
}

export const PriorAuthItem = ({
  priorAuthDetails,
  className,
  callBack,
}: ClaimItemProps) => {
  function getPriorAuthIcon() {
    return MedicalIcon;
  }

  function getPriorAuthItem() {
    return (
      <section className="md:flex md:flex-row align-top m-4">
        <Image
          src={getPriorAuthIcon()}
          className="icon max-md:hidden"
          alt="Medical"
        />
        <Spacer axis="horizontal" size={8} />
        <Column className="min-w-[95%]">
          <section className="md:flex md:flex-row md:justify-between">
            <section className="flex flex-row mb-[10px] md:flex-col">
              <Image
                src={getPriorAuthIcon()}
                className="icon md:hidden"
                alt="Medical"
              />
              <Header
                text={priorAuthDetails.issuer}
                type="title-3"
                className="body-bold primary-color max-md:ml-[5px]"
              />
            </section>
            <section className="flex flex-row justify-between md:flex-col max-lg:mr-[5px]">
              <StatusLabel
                label={priorAuthDetails.priorAuthStatus}
                status={getAuthStatus(priorAuthDetails.priorAuthStatus)}
              />
              {priorAuthDetails.isMiniCard && (
                <Column className="md:hidden">
                  <TextBox
                    className="body-1 font-bold mt-2"
                    text={
                      priorAuthDetails.priorAuthTotal != null
                        ? `$${priorAuthDetails.priorAuthTotal}`
                        : ''
                    }
                  />
                </Column>
              )}
            </section>
          </section>
          {priorAuthDetails.isMiniCard && (
            <Row className="justify-between">
              <Column>
                <TextBox
                  className="body-1 mt-2"
                  text={`Visited on ${priorAuthDetails.serviceDate}, For ${priorAuthDetails.memberName}`}
                />
              </Column>
              <Column className="max-md:hidden">
                <TextBox
                  className="body-1 font-bold mt-2"
                  text={
                    priorAuthDetails.priorAuthTotal != null
                      ? `$${priorAuthDetails.priorAuthTotal}`
                      : ''
                  }
                />
              </Column>
            </Row>
          )}
          {priorAuthDetails.columns && (
            <Row className="mt-2">
              <Column className="mr-2 flex-grow max-md:hidden">
                <TextBox
                  className="body-1"
                  text={`Visited on ${priorAuthDetails.serviceDate}`}
                />
                <TextBox
                  className="body-1 mt-2"
                  text={`For ${priorAuthDetails.memberName}`}
                />
              </Column>
              <Column className="flex-grow mr-5 md:hidden">
                <TextBox className="body-1" text="Visited on" />
                <TextBox
                  className="body-1"
                  text={priorAuthDetails.serviceDate}
                />
                <TextBox
                  className="body-1 mt-2"
                  text={`For ${priorAuthDetails.memberName}`}
                />
              </Column>
              {priorAuthDetails.columns.map((item, index) => (
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
                      item.value?.toString() ?? item.defaultValue.toString()
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
      onClick={() => callBack?.(encrypt(priorAuthDetails.referenceId ?? ''))}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          callBack?.(encrypt(priorAuthDetails.referenceId ?? ''));
        }
      }}
      role="button"
      aria-label={`Medical prior auth for ${priorAuthDetails.memberName} from ${priorAuthDetails.issuer} with status ${priorAuthDetails.priorAuthStatus}`}
      tabIndex={0}
    >
      {getPriorAuthItem()}
    </Card>
  );
};
