import { IComponent } from '@/components/IComponent';
import { useAppModalStore } from '@/components/foundation/AppModal';
import { Card } from '@/components/foundation/Card';
import { Column } from '@/components/foundation/Column';
import { Divider } from '@/components/foundation/Divider';
import { Row } from '@/components/foundation/Row';
import { Spacer } from '@/components/foundation/Spacer';
import { TextBox } from '@/components/foundation/TextBox';
import { Title } from '@/components/foundation/Title';
import { capitalizeName } from '@/utils/capitalizeName';
import Image from 'next/image';
import editIcon from '../../../../public/assets/edit.svg';
import { RemoveUserOusideMyPlan } from '../journeys/RemoveUserOutsideMyPlan';

interface ShareOutideMyPlanItemProps extends IComponent {
  memberName: string;
  DOB: string;
  sharingType: string;
  icon?: JSX.Element;
}

export const ShareOutsideMyPlanItem = ({
  memberName,
  DOB,
  sharingType,
  className,
  onClick,
  icon = <Image src={editIcon} alt="" />,
}: ShareOutideMyPlanItemProps) => {
  const { showAppModal } = useAppModalStore();

  return (
    <Card
      className={`cursor-pointer ${className}`}
      type="elevated"
      onClick={onClick}
    >
      <Column className="m-4">
        <Spacer size={16} />
        <Row className="justify-between">
          <TextBox
            className="ml-2 font-bold body-1"
            text={capitalizeName(memberName)}
          />
          <TextBox text={'DOB: ' + DOB} />
        </Row>
        <Spacer size={16} />
        <Row>
          <Spacer axis="horizontal" size={8} />
          <Divider />
        </Row>
        <Spacer size={16} />
        <Column>
          <Row>
            <Spacer axis="horizontal" size={8} />
            <TextBox className="body-1 " text={sharingType} />
            <Spacer size={40} />
          </Row>
          <Row>
            <Spacer axis="horizontal" size={8} />
            <Title
              className="font-bold primary-color"
              text="Remove Access"
              suffix={icon}
              callback={() =>
                showAppModal({
                  content: <RemoveUserOusideMyPlan memberName={memberName} />,
                })
              }
            />
            <Spacer size={40} />
          </Row>
        </Column>
      </Column>
    </Card>
  );
};
