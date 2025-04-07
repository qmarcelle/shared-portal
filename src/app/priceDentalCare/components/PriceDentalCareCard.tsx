import { IComponent } from '@/components/IComponent';
import { Card } from '@/components/foundation/Card';
import { Column } from '@/components/foundation/Column';
import { Divider } from '@/components/foundation/Divider';
import { Row } from '@/components/foundation/Row';
import { Spacer } from '@/components/foundation/Spacer';
import { TextBox } from '@/components/foundation/TextBox';
import { PriceDentalCareData } from '../models/priceDentalCareData';
import { ProcedureCard } from './ProcedureCard';

interface PriceDentalCareCardProps extends IComponent {
  procedures: PriceDentalCareData[];
  showEstimateCost: boolean;
}

export const PriceDentalCareCard = ({
  procedures,
  showEstimateCost,
}: PriceDentalCareCardProps) => {
  function getDentalCost() {
    return (
      <Card className="small-section md:w-[672px] w-fit ">
        <Column className={'flex flex-col max-sm:m-4'}>
          <Row className="mt-2">
            <Column className="flex flex-col mr-2">
              <TextBox className="body-1 center" text="Procedure" />
              <TextBox
                className="title-3 center mt-2"
                text="Topical fluoride varnish"
              />
            </Column>
            <Column className="flex flex-col mr-4 ml-4">
              <TextBox
                className="body-1 decoration-dashed underline center"
                text="Customary Cost"
              />
              <TextBox className="title-3 center mt-2" text="$48.51" />
            </Column>
            <Column className="flex flex-col mr-4 ml-4">
              <TextBox
                className="body-1 decoration-dashed underline center"
                text="Network Allowance"
              />
              <TextBox className="title-3 center mt-2" text="$30.00" />
            </Column>
          </Row>
          <Spacer size={32} />
          <Divider />
          <Spacer size={32} />
          <TextBox
            className="body-1 center"
            text="This cost is only an estimate and may be less based on your deductible, coinsurance and annual maximum."
          />
          <Spacer size={32} />
          {procedures.slice(0, 3).map((procedures) => (
            <ProcedureCard
              key={procedures.id}
              label={procedures.label}
              body={procedures.body}
              icon={procedures.icon}
              link={procedures.link}
            />
          ))}
        </Column>
      </Card>
    );
  }

  function getResetCard() {
    return (
      <Card className="cardColor mt-4">
        <Column className={'flex flex-col'}>
          <TextBox
            className="body-1 center mt-4 ml-4"
            text="Use the dental cost filter to get started."
          />
        </Column>
      </Card>
    );
  }
  return showEstimateCost ? getDentalCost() : getResetCard();
};
