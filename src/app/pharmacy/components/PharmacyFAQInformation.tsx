import { IComponent } from '../../../components/IComponent';
import { Column } from '../../../components/foundation/Column';
import { Row } from '../../../components/foundation/Row';
import { Spacer } from '../../../components/foundation/Spacer';

interface PharmacyFAQInformationProps extends IComponent {
  answerline1: JSX.Element | string;
  answerline2: JSX.Element | string;
}

export const PharmacyFAQInformation = ({
  answerline1,
  answerline2,
}: PharmacyFAQInformationProps) => {
  return (
    <Column className="flex flex-col">
      <Spacer size={16} />
      <Row>
        <label className="body-1">{answerline1}</label>
      </Row>
      <Spacer size={12} />
      <Row>
        <label className="body-1">{answerline2}</label>
      </Row>
      <Spacer size={12} />
    </Column>
  );
};
