import { ServiceDetails } from '@/app/claims/models/app/service_details';
import { IComponent } from '@/components/IComponent';
import { Accordion } from '@/components/foundation/Accordion';
import { AppLink } from '@/components/foundation/AppLink';
import { Card } from '@/components/foundation/Card';
import { Circle } from '@/components/foundation/Circle';
import { Column } from '@/components/foundation/Column';
import { Header } from '@/components/foundation/Header';
import { downIcon, upIcon } from '@/components/foundation/Icons';
import { Row } from '@/components/foundation/Row';
import { Spacer } from '@/components/foundation/Spacer';
import { TextBox } from '@/components/foundation/TextBox';
import { formatCurrency } from '@/utils/currency_formatter';
import Image from 'next/image';
import { ServicesRenderedInformation } from '../../claims/components/ServicesRenderedInformation';
import { SpendingChart } from './SpendingChart';

interface SpendingSummarySectionProps extends IComponent {
  title: string;
  subTitle: string;
  amountPaid: number;
  amountSaved: number;
  totalBilledAmount: number;
  amountSavedPercentage: number;
  color1: string;
  color2: string;
  linkLabel?: string;
  service?: ServiceDetails[];
}

export const SpendingAccountSummary = ({
  className,
  title,
  subTitle,
  amountPaid,
  totalBilledAmount,
  amountSaved,
  amountSavedPercentage,
  color1,
  color2,
  linkLabel,
  service,
}: SpendingSummarySectionProps) => {
  return (
    <Card className={className}>
      <div>
        <Header text={title} type="title-2" />
        <Spacer size={18} />
        <Row>
          <TextBox text="As of" />
          <Spacer axis="horizontal" size={8} />
          <p>{subTitle}</p>
        </Row>
        <Spacer size={18} />
        <SpendingChart
          color1={color1}
          color2={color2}
          totalAmount={totalBilledAmount}
          percentageAmountSaved={amountSavedPercentage}
        ></SpendingChart>
        <div className="sectionAlignment">
          <Row>
            <Circle
              width={20}
              height={20}
              color="#005EB9"
              radius={50}
              top={0}
              right={0}
            />
            <TextBox text="You Paid" className="ml-2" />
            <p className="body-bold ml-auto">
              {formatCurrency(amountPaid) ?? '--'}
            </p>
          </Row>
          <Spacer size={18} />
          <Row>
            <Circle
              width={20}
              height={20}
              color="#5DC1FD"
              radius={50}
              top={0}
              right={0}
            />
            <TextBox text="You Saved" className="ml-2" />
            <p className="body-bold ml-auto">
              {formatCurrency(amountSaved) ?? '--'}
            </p>
          </Row>
        </div>
        <Spacer size={32} />
        {linkLabel && <AppLink label={linkLabel} />}
        <Column className="clear-left">
          {service &&
            service.slice(0, service.length).map((item) => (
              // eslint-disable-next-line react/jsx-key
              <Card className="mb-3">
                <Column className="items-stretch">
                  <Accordion
                    className="px-2 py-4"
                    label={item.serviceLabel}
                    icon={item.serviceIcon}
                    initialOpen={false}
                    type="card"
                    openIcon={
                      <Image
                        className="pl-2 w-6"
                        src={downIcon}
                        alt="Down Chevron"
                      ></Image>
                    }
                    closeIcon={
                      <Image
                        className="pl-2 w-6"
                        src={upIcon}
                        alt="Up Chevron"
                      ></Image>
                    }
                    subLabel={
                      <Row className="m-1 justify-between">
                        <TextBox
                          className="font-bold"
                          text={item.serviceSubLabel}
                        />
                        <TextBox
                          className="font-bold"
                          text={
                            formatCurrency(item.serviceSubLabelValue) ?? '--'
                          }
                        />
                      </Row>
                    }
                    child={
                      <ServicesRenderedInformation
                        serviceCode={item.serviceCode}
                        label1={item.labelText1}
                        value1={item.labelValue1}
                        label2={item.labelText2}
                        value2={item.labelValue2}
                        label3={item.labelText3}
                        value3={item.labelValue3}
                        subLabel={item.serviceSubLabel}
                        subLabelValue={item.serviceSubLabelValue}
                      />
                    }
                  ></Accordion>
                </Column>
              </Card>
            ))}
        </Column>
      </div>
    </Card>
  );
};
