import { ServiceDetails } from '@/app/claimServiceRendered/models/service_details';
import Image from 'next/image';
import { IComponent } from '../../../../components/IComponent';
import { Accordion } from '../../../../components/foundation/Accordion';
import { Card } from '../../../../components/foundation/Card';
import { Column } from '../../../../components/foundation/Column';
import { downIcon, upIcon } from '../../../../components/foundation/Icons';
import { Row } from '../../../../components/foundation/Row';
import { Spacer } from '../../../../components/foundation/Spacer';
import { TextBox } from '../../../../components/foundation/TextBox';
import { ServicesRenderedInformation } from './ServicesRenderedInformation';

interface ServicesRenderedSectionProps extends IComponent {
  serviceTitle: string;
  service: ServiceDetails[];
}

export const ServicesRenderedSection = ({
  className,
  serviceTitle,
  service,
}: ServicesRenderedSectionProps) => {
  return (
    <Card className={className}>
      <Column>
        <TextBox type="title-2" text={serviceTitle} />
        <Spacer size={21} />
        {service.slice(0, service.length).map((item, index) => (
          <Card className="mb-3" key={index}>
            <Column className="items-stretch">
              <Accordion
                className="px-2 py-4"
                label={item.serviceLabel}
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
                      text={`$${item.serviceSubLabelValue}`}
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
    </Card>
  );
};
