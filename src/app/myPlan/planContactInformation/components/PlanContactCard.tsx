import { IComponent } from '../../../../components/IComponent';
import { Card } from '../../../../components/foundation/Card';
import { Column } from '../../../../components/foundation/Column';
import { Divider } from '../../../../components/foundation/Divider';
import { Row } from '../../../../components/foundation/Row';
import { Spacer } from '../../../../components/foundation/Spacer';
import { TextBox } from '../../../../components/foundation/TextBox';

interface PlanContactCardProps extends IComponent {
  memberName: string;
  DOB: string;
  age: number;
  phone: string;
  address: string;
}

export const PlanContactCard = ({
  memberName,
  DOB,
  className,
  age,
  phone,
  address,
}: PlanContactCardProps) => {
  return (
    <Card className={` ${className}`} type="elevated">
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
        {age > 12 ? (
          <>
            <TextBox text="Mailing Address" className="ml-2" type="body-2" />
            <Spacer size={1} />
            <TextBox text={address} className="ml-2 w-52" />
            <Spacer size={5} />
            <TextBox text="Phone" type="body-2" className="ml-2" />
            <Spacer size={1} />
            <TextBox text={phone} className="ml-2" />
          </>
        ) : (
          <TextBox
            className="ml-2 body-1"
            text="This dependent is under age 13. Per our policy, all communications and information for them will be sent to the subscriber unless an exception is approved."
          />
        )}
        <Spacer size={16} />
      </Column>
    </Card>
  );
};
