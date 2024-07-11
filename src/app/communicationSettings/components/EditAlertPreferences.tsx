import { UpdateCommunicationTerms } from '@/app/communicationSettings/journeys/UpdateCommunicationTerms';
import { useState } from 'react';
import { IComponent } from '../../../components/IComponent';
import { useAppModalStore } from '../../../components/foundation/AppModal';
import { Button } from '../../../components/foundation/Button';
import { Card } from '../../../components/foundation/Card';
import { Checkbox } from '../../../components/foundation/Checkbox';
import { Column } from '../../../components/foundation/Column';
import { Divider } from '../../../components/foundation/Divider';
import { Header } from '../../../components/foundation/Header';
import { Row } from '../../../components/foundation/Row';
import { Spacer } from '../../../components/foundation/Spacer';
import { TextBox } from '../../../components/foundation/TextBox';

interface EditAlertPreferncesProps extends IComponent {
  isTextAlert: boolean;
  isEmailAlert: boolean;
  isPlanInfo: boolean;
  isClaimsInfo: boolean;
  isHealthInfo: boolean;
}

export const EditAlertPreferncesSection = ({
  isTextAlert,
  isEmailAlert,
  isPlanInfo,
  isClaimsInfo,
  isHealthInfo,
  className,
}: EditAlertPreferncesProps) => {
  const { showAppModal } = useAppModalStore();
  const [isChecked, setIsChecked] = useState(false);

  const checkHandler = () => {
    setIsChecked(!isChecked);
  };

  const [isSelected, setIsSelected] = useState(false);

  const checkHandlerText = () => {
    setIsSelected(!isSelected);
  };

  return (
    <Card className={className}>
      <div>
        <Header text="Edit Alert Prefernces" type="title-2" className="pl-3" />
        <Spacer size={12} />
        <TextBox text="Sign up for email and text alerts." className="pl-3" />
        <Spacer size={18} />
        <Card className={className}>
          <Column>
            <Checkbox
              label="Receive Text Alerts"
              classProps="font-bold"
              selected={isTextAlert}
              body={
                <TextBox text="Get text alerts with plan updates and personalized health notifications." />
              }
              callback={checkHandlerText}
            />
          </Column>
        </Card>
        <Card className={className}>
          <Column>
            <Checkbox
              label="Receive Email Alerts"
              classProps="font-bold"
              selected={isEmailAlert}
              body={
                <TextBox text="Get important plan updates, claims information and/or health and wellness topics sent to your email." />
              }
              callback={checkHandler}
            />
            <Spacer size={18} />

            {(isChecked || isEmailAlert) && (
              <Column className="emailAlertsSublevel">
                <Divider axis="vertical" />
                <Spacer size={18} />
                <TextBox text="Choose the emails you want to receive:" />
                <Spacer size={32} />
                <Checkbox
                  label="Important Plan Information"
                  classProps="font-bold"
                  body={
                    <TextBox text="Get details about your coverage, including updates about your network, benefits and appeals." />
                  }
                  selected={isPlanInfo}
                />
                <Spacer size={32} />
                <Checkbox
                  label="Claims Information"
                  classProps="font-bold"
                  body={
                    <TextBox text="Get alerts about your share of care costs." />
                  }
                  selected={isClaimsInfo}
                />
                <Spacer size={32} />
                <Checkbox
                  label="Health & Wellness"
                  classProps="font-bold"
                  body={
                    <TextBox text="Get tips and reminders to help you get the care you need and stay well." />
                  }
                  selected={isHealthInfo}
                />
              </Column>
            )}
          </Column>
        </Card>
        {(isSelected || isChecked || isTextAlert || isEmailAlert) && (
          <Row className="pl-3 pr-3">
            <Button label="Cancel" type="secondary" />
            <Spacer axis="horizontal" size={32} />
            <Button
              label="Next"
              type="primary"
              callback={() =>
                showAppModal({ content: <UpdateCommunicationTerms /> })
              }
            />
          </Row>
        )}
      </div>
    </Card>
  );
};
