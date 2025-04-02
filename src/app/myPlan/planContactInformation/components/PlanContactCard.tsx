import { IComponent } from '../../../../components/IComponent';
import { Card } from '../../../../components/foundation/Card';
import { Column } from '../../../../components/foundation/Column';
import { Divider } from '../../../../components/foundation/Divider';
import { Row } from '../../../../components/foundation/Row';
import { Spacer } from '../../../../components/foundation/Spacer';
import { TextBox } from '../../../../components/foundation/TextBox';

interface PlanContactCardProps extends IComponent {
  name: string;
  dob: string;
  age: number | undefined;
  primaryPhoneNumber: string;
  secondaryPhoneNumber: string;
  address: string;
}

export const PlanContactCard = ({
  name,
  dob,
  className,
  age,
  primaryPhoneNumber,
  secondaryPhoneNumber,
  address,
}: PlanContactCardProps) => {
  return (
    <Card className={` ${className}`} type="elevated">
      <Column className="m-4">
        <Spacer size={16} />
        <Row className="justify-between">
          <TextBox className="ml-2 font-bold body-1" text={name} />
        </Row>
        <Row className="ml-2">
          <TextBox text={'DOB: ' + dob} />
        </Row>
        <Spacer size={8} />
        <Row>
          <Spacer axis="horizontal" size={8} />
          <Divider />
        </Row>
        <Spacer size={16} />
        {age && age > 12 ? (
          <>
            <TextBox text="Mailing Address" className="ml-2" type="body-2" />
            <Spacer size={1} />
            <TextBox text={address} className="ml-2 w-52" />
            <Spacer size={5} />
            <TextBox
              text="Primary Phone Number"
              type="body-2"
              className="ml-2"
            />
            <Spacer size={5} />
            <TextBox text={primaryPhoneNumber} className="ml-2" />
            <Spacer size={5} />
            <TextBox
              text="Secondary Phone Number"
              type="body-2"
              className="ml-2"
            />
            <Spacer size={5} />
            <TextBox text={secondaryPhoneNumber} className="ml-2" />
          </>
        ) : (
          <TextBox
            className="ml-2 body-1 neutral card-main p-4"
            text="This dependent is under age 13. Per our policy, all communications and information for them will be sent to the subscriber unless an exception is approved."
          />
        )}
        <Spacer size={16} />
      </Column>
    </Card>
  );
};
