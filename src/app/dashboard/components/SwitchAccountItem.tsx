import { IComponent } from '@/components/IComponent';
import { Card } from '@/components/foundation/Card';
import { Column } from '@/components/foundation/Column';
import { LinkRow } from '@/components/foundation/LinkRow';
import { Row } from '@/components/foundation/Row';
import { TextBox } from '@/components/foundation/TextBox';

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
    <Card
      className={`cursor-pointer switchAccountTextAlign ${className}`}
      type="elevated"
    >
      <Column className="m-4">
        <TextBox
          className="body-2"
          text="View as Personal Representative:"
          ariaLabel="View as Personal Representative:"
        />
        <LinkRow
          label={memberName}
          className="title-3 flex-grow font-bold linkAlignment"
          onClick={() => openDashboard('/dashboard')}
        />
        <Row>
          <TextBox text="DOB: " ariaLabel="DOB: " />
          <TextBox ariaLabel={DOB} text={DOB} />
        </Row>
      </Column>
    </Card>
  );
};
