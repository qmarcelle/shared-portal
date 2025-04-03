import { EditLevelOfAccess } from '@/app/personalRepresentativeAccess/journeys/EditLevelOfAccess';
import { ToolTip } from '@/components/foundation/Tooltip';
import Image from 'next/image';
import editIcon from '../../../public/assets/edit.svg';
import infoIcon from '../../../public/assets/info.svg';
import { IComponent } from '../IComponent';
import { useAppModalStore } from '../foundation/AppModal';
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
  requestorType?: string;
  targetType?: string;
  medicalEffectiveDate: string;
  dentalEffectiveDate: string;
  visionEffectiveDate: string;
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
  requestorType,
  targetType,
  medicalEffectiveDate,
  dentalEffectiveDate,
  visionEffectiveDate,
}: OnMyPlanItemProps) => {
  const { showAppModal } = useAppModalStore();
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
            <ToolTip
              showTooltip={true}
              className="flex flex-row justify-center items-end tooltip tooltipIcon relative ml-2 text-center"
              label={
                <>
                  {medicalEffectiveDate && (
                    <Column className="mb-2 ml-2 mt-4">
                      <Row>Medical</Row>
                      <Row>Policy effective date: {medicalEffectiveDate}</Row>
                    </Column>
                  )}
                  {dentalEffectiveDate && (
                    <Column className="mb-2 ml-2">
                      <Row>Dental</Row>
                      <Row>Policy effective date: {dentalEffectiveDate}</Row>
                    </Column>
                  )}
                  {visionEffectiveDate && (
                    <Column className="ml-2 mb-4">
                      <Row>Vision</Row>
                      <Row>Policy effective date: {visionEffectiveDate}</Row>
                    </Column>
                  )}
                </>
              }
            >
              <Image src={infoIcon} className="icon" alt="Info" />
            </ToolTip>
          )}
        </Row>
        {!infoButton && (
          <>
            {' '}
            <Spacer size={16} />
            <Row>
              <Spacer axis="horizontal" size={8} />
              <Title
                className="font-bold primary-color"
                text="Update"
                suffix={icon}
                callback={() => {
                  showAppModal({
                    content: (
                      <EditLevelOfAccess
                        currentAccessType="basic"
                        memberName={memberName}
                        requestorType={requestorType ?? ''}
                        targetType={targetType ?? ''}
                      />
                    ),
                  });
                }}
              />
              <Spacer size={40} />
            </Row>
          </>
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
