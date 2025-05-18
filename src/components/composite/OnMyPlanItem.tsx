import { EditLevelOfAccess } from '@/app/personalRepresentativeAccess/journeys/EditLevelOfAccess';
import { ToolTip } from '@/components/foundation/Tooltip';
import { AnalyticsData } from '@/models/app/analyticsData';
import { googleAnalytics } from '@/utils/analytics';
import { capitalizeName } from '@/utils/capitalizeName';
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
  medicalEffectiveDate?: string;
  dentalEffectiveDate?: string;
  visionEffectiveDate?: string;
  isLoggedInMember?: string;
  allowUpdates?: boolean;
  isGATrackEligible?: boolean;
  analyticsEvent?: string;
  selectionType?: string;
  elementCategory?: string;
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
  targetType,
  medicalEffectiveDate,
  dentalEffectiveDate,
  visionEffectiveDate,
  allowUpdates = true,
  isGATrackEligible,
  analyticsEvent,
  selectionType,
  elementCategory,
}: OnMyPlanItemProps) => {
  function trackPlanItemUpdateAnalytics(
    gaEvent?: string,
    selectionType?: string,
    elementCategory?: string,
  ) {
    const analytics: AnalyticsData = {
      event: gaEvent,
      click_text: 'Update',
      click_url: undefined,
      page_section: undefined,
      selection_type: selectionType,
      element_category: elementCategory,
      action: 'click',
    };
    googleAnalytics(analytics);
  }

  const getSharingText = (sharingType: string) => {
    switch (sharingType) {
      case 'Full Access':
        return 'Full Sharing';
      case 'Basic Access':
        return 'Basic Sharing';
      case 'No Access':
        return 'None';
      default:
        return sharingType;
    }
  };
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
                  isGATrackEligible &&
                    trackPlanItemUpdateAnalytics(
                      analyticsEvent,
                      selectionType,
                      elementCategory,
                    );
                  showAppModal({
                    content: (
                      <EditLevelOfAccess
                        currentAccessType={sharingType}
                        memberName={memberName}
                        targetType={targetType ?? ''}
                        isMaturedMinor={isMinor}
                        disableSubmit={!allowUpdates}
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
      onClick={() => {
        if (allowUpdates && onClick) onClick();
      }}
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
        {isMinor ? getMinorContent() : getNonMinorContent()}
      </Column>
    </Card>
  );
};
