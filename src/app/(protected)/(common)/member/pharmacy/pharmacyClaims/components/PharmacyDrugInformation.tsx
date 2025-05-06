import { IComponent } from '@/components/IComponent';
import { Accordion } from '@/components/foundation/Accordion';
import { Card } from '@/components/foundation/Card';
import { Column } from '@/components/foundation/Column';
import { Divider } from '@/components/foundation/Divider';
import { Header } from '@/components/foundation/Header';
import { Row } from '@/components/foundation/Row';
import { Spacer } from '@/components/foundation/Spacer';
import { TextBox } from '@/components/foundation/TextBox';
import Image from 'next/image';
import Down from '/assets/down.svg';
import Up from '/assets/up.svg';

interface PharmacyDrugInformationProps extends IComponent {
  drugInformation: PharmacyDrugCollapsibleProps[];
}

interface PharmacyDrugCollapsibleProps extends IComponent {
  name: string;
  daysSupply: number;
  quantity: number;
  strengthMG: number;
  form: string;
}

//single collapsible/accordion for drug information
const PharmacyDrugCollapsible = ({
  name,
  daysSupply,
  quantity,
  strengthMG,
  form,
}: PharmacyDrugCollapsibleProps) => {
  return (
    <Card type="elevated">
      <Column className="p-4">
        <Accordion
          type="card"
          label={
            <span className="!font-bold title-3">{`${name} ${strengthMG}MG`}</span>
          }
          initialOpen={false}
          openIcon={
            <Image className="w-6" src={Down} alt="Down Chevron"></Image>
          }
          closeIcon={<Image className="w-6" src={Up} alt="Up Chevron"></Image>}
          child={
            <>
              <Spacer size={16} />
              <Row className="justify-between pr-[16.5px] py-4">
                <TextBox text="Quantity" />
                <TextBox text={`${quantity}`} />
              </Row>
              <Divider />
              <Column>
                <Row className="justify-between pr-[16.5px] py-4">
                  <TextBox text="Strength" />
                  <TextBox text={`${strengthMG}MG`} />
                </Row>
                <Row className="justify-between pr-[16.5px] py-4">
                  <TextBox text="Form" />
                  <TextBox text={form} />
                </Row>
              </Column>
              <Divider />
            </>
          }
        />
        <Row className="justify-between pr-[16.5px] pl-2 pt-2">
          <TextBox className="font-bold" text="Supply" />
          <TextBox className="font-bold" text={`${daysSupply} Days`} />
        </Row>
      </Column>
    </Card>
  );
};

//actual Drug Information card
export const PharmacyDrugInformation = ({
  drugInformation,
}: PharmacyDrugInformationProps) => {
  return (
    <Card className="p-8">
      <Column>
        <Header className="title-2" text="Drug Information" />
        <Spacer size={32} />
        <Column>
          {drugInformation.map((info, index) => (
            <div key={index}>
              <PharmacyDrugCollapsible
                key={index}
                name={info.name}
                daysSupply={info.daysSupply}
                quantity={info.quantity}
                strengthMG={info.strengthMG}
                form={info.form}
              />
              <Spacer size={16} />
            </div>
          ))}
        </Column>
      </Column>
    </Card>
  );
};
