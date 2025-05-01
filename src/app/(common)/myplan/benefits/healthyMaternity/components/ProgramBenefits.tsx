/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react/jsx-key */
import { Column } from '@/components/foundation/Column';
import { Header } from '@/components/foundation/Header';
import { Row } from '@/components/foundation/Row';
import { Spacer } from '@/components/foundation/Spacer';
import { IComponent } from '../../../components/IComponent';
import { TextBox } from '../../../components/foundation/TextBox';
import { BenefitDetails } from '../models/benefit_details';

interface ProgramBenefitsProps extends IComponent {
  benefits: BenefitDetails[];
}

export const ProgramBenefits = ({ benefits }: ProgramBenefitsProps) => {
  return (
    <>
      <Spacer size={12} />
      <Header className="title-2 px-3" text="Program Benefits"></Header>
      <Spacer size={25} />
      <Row className="hidden sm:flex px-3">
        {benefits.slice(0, benefits.length).map((item, index) => (
          <Column className="md:pr-4 md:w-1/3">
            {item.benefitIcon}
            <Spacer size={5} />
            <TextBox text={item.benefitLabel} className="font-bold" />
            <Spacer size={5} />
            <TextBox text={item.benefitCopy} />
          </Column>
        ))}
      </Row>
      <Column className="block sm:hidden px-3">
        {benefits.slice(0, benefits.length).map((item, index) => (
          <Column className="pr-4 mb-4">
            {item.benefitIcon}
            <Spacer size={5} />
            <TextBox text={item.benefitLabel} className="font-bold" />
            <Spacer size={5} />
            <TextBox text={item.benefitCopy} />
          </Column>
        ))}
      </Column>
    </>
  );
};
