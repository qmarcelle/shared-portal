import Image from 'next/image';
import editIcon from '../../../public/assets/edit.svg';
import infoIcon from '../../../public/assets/info.svg';
import { IComponent } from '../IComponent';
import { Card } from '../foundation/Card';
import { Column } from '../foundation/Column';
import { Divider } from '../foundation/Divider';
import { Row } from '../foundation/Row';
import { Spacer } from '../foundation/Spacer';
import { TextBox } from '../foundation/TextBox';
import { Title } from '../foundation/Title';

interface OnMyPlanItemProps extends IComponent {
  memberName: string;
  DOB: string;
  sharingType: string;
  isMinor: boolean;
  icon?: JSX.Element;
  infoButton: boolean;
}

export const OnMyPlanItem = ({
  memberName,
  DOB,
  sharingType,
  isMinor,
  onClick,
  className,
  infoButton,
  icon = <Image src={editIcon} alt="link" />,
}: OnMyPlanItemProps) => {
  function getMinorContent() {
    return (
      <Column>
        <Row>
          <Spacer axis="horizontal" size={8} />
          <Card backgroundColor="rgba(0,0,0,0.05)">
            <Column className="m-4">
              <Row>
                <TextBox
                  className="body-1 "
                  text="This is a minor dependent. Sharing permissions aren’t applicable with this account."
                />
              </Row>
            </Column>
          </Card>
        </Row>
      </Column>
    );
  }

  function getNonMinorContent() {
    return (
      <Column>
        <Row>
          <Spacer axis="horizontal" size={8} />
          <TextBox className="body-1 " text={sharingType} />
          {infoButton && (
            <div>
              <Image src={infoIcon} className="icon" alt="Info" />
            </div>
          )}
        </Row>
        {!infoButton && (
          <div>
            {' '}
            <Spacer size={16} />
            <Row>
              <Spacer axis="horizontal" size={8} />
              <Title
                className="font-bold primary-color"
                text="Update"
                suffix={icon}
              />
              <Spacer size={40} />
            </Row>
          </div>
        )}
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
          <TextBox text={'DOB: ' + DOB} />
        </Row>
        <Spacer size={16} />
        <Row>
          <Spacer axis="horizontal" size={8} />
          <Divider />
        </Row>
        <Spacer size={16} />
        {isMinor ? getMinorContent() : getNonMinorContent()}
      </Column>
    </Card>
  );
};
