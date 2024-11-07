import { Column } from '@/components/foundation/Column';
import { Header } from '@/components/foundation/Header';
import { Row } from '@/components/foundation/Row';
import { Spacer } from '@/components/foundation/Spacer';
import { TextBox } from '@/components/foundation/TextBox';
import { IComponent } from '@/components/IComponent';
import { FaqHeaderCardDetails } from '../models/faq_header_card_details';

interface FaqHeaderCardProps extends IComponent {
  faqHeaderDetails: FaqHeaderCardDetails;
}

export const FaqHeaderCard = ({ faqHeaderDetails }: FaqHeaderCardProps) => {
  return (
    <Column className="md:m-2 m-4">
      <Row className="justify-between mt-2 md:mt-16 lg:mt-0">
        <Column className="max-w-2xl ">
          <Spacer size={8} />
          <Header type="title-1" text={faqHeaderDetails.title} />
          <Spacer size={8} />
          <TextBox className="body-1" text={faqHeaderDetails.description} />
        </Column>
      </Row>
    </Column>
  );
};
