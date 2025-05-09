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
import { Key } from 'react';
import editIcon from '../../../../public/assets/edit.svg';
import { OtherPlanDetails } from '../models/AccessOtherPlanDetails';

import { HideOthersPlan } from '../journeys/HideOthersPlan';
interface AccessToOthersPlanItemProps extends IComponent {
  planDetails: OtherPlanDetails[] | null;
  name: string;
  dob: string;
  icon?: JSX.Element;
}

export const AccessToOthersPlanItem = ({
  planDetails,
  name,
  dob,
  onClick,
  className,
  icon = <Image src={editIcon} alt="link" />,
}: AccessToOthersPlanItemProps) => {
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
            text={capitalizeName(name)}
          />
          <TextBox text={'DOB: ' + dob} />
        </Row>
        <Spacer size={16} />
        <Row>
          <Spacer axis="horizontal" size={8} />
          <Divider />
        </Row>
        {planDetails?.map((item: OtherPlanDetails, index: Key) => (
          <Column className="justify-between ml-2" key={index}>
            <TextBox
              className="font-bold body-1 mb-2 mt-4"
              text={capitalizeName(item.planName)}
            />
            <TextBox text={'Subscriber: ' + item.subscriber} />
            <TextBox text={'ID: ' + item.id} />
            <TextBox text={'Policies: ' + item.policies} />
            <TextBox text="Ended 2023" className="text-xs" />
            <Spacer size={12} />

            <Title
              className="font-bold primary-color "
              text="Hide"
              suffix={icon}
              callback={() =>
                showAppModal({
                  content: <HideOthersPlan />,
                })
              }
            />
          </Column>
        ))}
      </Column>
    </Card>
  );
};
