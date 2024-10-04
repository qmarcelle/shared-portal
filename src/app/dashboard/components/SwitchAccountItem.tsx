import { IComponent } from '@/components/IComponent';
import { Card } from '@/components/foundation/Card';
import { Column } from '@/components/foundation/Column';
import { Row } from '@/components/foundation/Row';
import { TextBox } from '@/components/foundation/TextBox';
import Image from 'next/image';
import rightIcon from '../../../../public/assets/right.svg';

interface SwitchAccountItemProps extends IComponent {
  memberName: string;
  DOB: string;
}
const openDashboard = (url: string) => {
  window.open(url, '_blank');
};

export const SwitchAccountItem = ({
  memberName,
  DOB,
  className,
}: SwitchAccountItemProps) => {
  return (
    <Card className={`cursor-pointer  ${className}`} type="elevated">
      <Column className="m-4">
        <TextBox
          className="body-2"
          text="View as Personal Representative:"
          ariaLabel="View as Personal Representative:"
        />
        <Row
          className="justify-between"
          onClick={() => openDashboard('/dashboard')}
        >
          <TextBox
            className={'!font-bold title-3 text-[--primary-color]'}
            text={memberName}
          />
          <Image src={rightIcon} alt="link" />
        </Row>
        <Row>
          <TextBox text="DOB: " ariaLabel="DOB: " />
          <TextBox ariaLabel={DOB} text={DOB} />
        </Row>
      </Column>
    </Card>
  );
};
