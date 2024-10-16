import { useAppModalStore } from '@/components/foundation/AppModal';
import Image from 'next/image';
import editIcon from '../../../../public/assets/edit.svg';
import { IComponent } from '../../../components/IComponent';
import { Card } from '../../../components/foundation/Card';
import { Column } from '../../../components/foundation/Column';
import { Divider } from '../../../components/foundation/Divider';
import { Row } from '../../../components/foundation/Row';
import { Spacer } from '../../../components/foundation/Spacer';
import { TextBox } from '../../../components/foundation/TextBox';
import { Title } from '../../../components/foundation/Title';
import { OtherHealthInsurance } from '../journeys/OtherHealthInsurance';

interface OtherHealthInsuranceCardItemProps extends IComponent {
  memberName: string;
  DOB: string;
  icon?: JSX.Element;
  icon1?: JSX.Element;
  updatedDate: string;
}

export const OtherHealthInsuranceCardItem = ({
  memberName,
  DOB,
  updatedDate,
  onClick,
  className,
  icon = <Image src={editIcon} alt="link" />,
}: OtherHealthInsuranceCardItemProps) => {
  const { showAppModal } = useAppModalStore();
  function getHealthInsuranceContent() {
    return (
      <Column>
        <Row>
          <Spacer axis="horizontal" size={8} />
          <Title
            className="font-bold primary-color"
            text="Update"
            suffix={icon}
            callback={() =>
              showAppModal({
                content: <OtherHealthInsurance />,
              })
            }
          />
          <Spacer size={40} />
        </Row>
      </Column>
    );
  }

  return (
    <Card
      className={`cursor-pointer ${className}`}
      type="elevated"
      onClick={onClick}
    >
      <Column className="m-4">
        <Spacer size={16} />
        <Row className="justify-between">
          <TextBox className="ml-2 font-bold body-1" text={memberName} />
        </Row>
        <Spacer size={16} />
        <Row className="ml-2">
          <TextBox text={'DOB: ' + DOB} />
        </Row>
        <Spacer size={16} />
        <Row>
          <Spacer axis="horizontal" size={8} />
          <Divider />
        </Row>
        <Spacer size={16} />
        <Row>
          <TextBox
            className="ml-2 body-1"
            text="Not covered by other health insurance."
          />
        </Row>
        <Spacer size={16} />
        <Row>
          <TextBox
            className="ml-2  body-1"
            text={'Last Updated: ' + updatedDate}
          />
        </Row>
        <Spacer size={16} />
        {getHealthInsuranceContent()}
      </Column>
    </Card>
  );
};
