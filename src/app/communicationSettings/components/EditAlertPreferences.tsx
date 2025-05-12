import { UpdateCommunicationTerms } from '@/app/communicationSettings/journeys/UpdateCommunicationTerms';
import { IComponent } from '@/components/IComponent';
import { ErrorInfoCard } from '@/components/composite/ErrorInfoCard';
import { useAppModalStore } from '@/components/foundation/AppModal';
import { Button } from '@/components/foundation/Button';
import { Card } from '@/components/foundation/Card';
import { Checkbox } from '@/components/foundation/Checkbox';
import { Column } from '@/components/foundation/Column';
import { Divider } from '@/components/foundation/Divider';
import { Header } from '@/components/foundation/Header';
import { Row } from '@/components/foundation/Row';
import { Spacer } from '@/components/foundation/Spacer';
import { TextBox } from '@/components/foundation/TextBox';
import { useState } from 'react';
import {
  AlertType,
  CommunicationSettingsAppData,
  ContactPreference,
  Preferences,
} from '../models/app/communicationSettingsAppData';

interface EditAlertPreferncesProps extends IComponent {
  alertPreferenceData: CommunicationSettingsAppData;
}

const normalizeText = (text: string) =>
  text.replace(/&amp;/g, '&').replace(/&/g, '').replace(/\s+/g, '').trim();

export const EditAlertPreferncesSection = ({
  className,
  alertPreferenceData,
}: EditAlertPreferncesProps) => {
  const getDescriptions = (): Map<AlertType, Preferences> => {
    const dynamicMap = new Map<
      AlertType,
      { category: string; method: string }
    >();

    alertPreferenceData.tierOne?.forEach((item) => {
      const hText = item.description
        .filter((desc) => desc.type === 'h')
        .map((desc) => desc.texts)
        .join('');

      if (hText) {
        const alertType = normalizeText(hText) as AlertType;
        dynamicMap.set(alertType, {
          category: item.communicationCategory,
          method: item.communicationMethod,
        });
      }
    });

    const pref: [AlertType, Preferences][] = (
      alertPreferenceData.tierOneDescriptions || []
    )
      .filter((tierOneDescription) => {
        const hText = tierOneDescription.hTexts.join('');
        return normalizeText(hText) !== '';
      })
      .map((tierOneDescription) => {
        const alertType = normalizeText(
          tierOneDescription.hTexts.join(''),
        ) as AlertType;

        return [
          alertType,
          {
            hText: tierOneDescription.hTexts.join(' ').replace('&amp;', '&'),
            pText: tierOneDescription.pTexts.join(' ').replace('&apos;', '′'),
            selected: false,
            category: dynamicMap.get(alertType)?.category,
            method: dynamicMap.get(alertType)?.method,
          },
        ];
      });

    return new Map(pref);
  };

  const initialEditAlertMap: Map<AlertType, Preferences> = new Map([
    [
      AlertType.ReceiveTextAlerts,
      {
        hText: 'Receive Text Alerts',
        pText:
          'Get text alerts with plan updates and personalized health notifications.',
        selected: false,
        category: 'TEXT',
        method: 'TEXT',
      },
    ],
    [
      AlertType.ReceiveEmailAlerts,
      {
        hText: 'Receive Email Alerts',
        pText:
          'Get important plan updates, claims information and/or health and wellness topics sent to your email.',
        selected: false,
        childCheckBox: getDescriptions(),
      },
    ],
  ]);

  const [editAlertMap, setEditAlertMap] = useState(initialEditAlertMap);
  const { showAppModal } = useAppModalStore();
  const resetState = () => {
    setEditAlertMap(initialEditAlertMap);
  };

  const checkBoxHandler = (
    alertType: AlertType,
    parentAlertType?: AlertType,
  ) => {
    const alertMap = new Map(
      Array.from(editAlertMap.entries()).map(([key, value]) => [
        key,
        {
          ...value,
          childCheckBox: value.childCheckBox
            ? new Map(value.childCheckBox)
            : undefined,
        },
      ]),
    );

    if (!parentAlertType) {
      const alert = alertMap.get(alertType);
      if (alert) {
        alert.selected = !alert.selected;
        alertMap.set(alertType, alert);
      }
    } else {
      const parentAlert = alertMap.get(parentAlertType);
      if (parentAlert?.childCheckBox) {
        const childAlert = parentAlert.childCheckBox.get(alertType);
        if (childAlert) {
          childAlert.selected = !childAlert.selected;
          parentAlert.childCheckBox.set(alertType, childAlert);
          alertMap.set(parentAlertType, parentAlert);
        }
      }
    }
    setEditAlertMap(alertMap);
  };

  const getPreferences = (): ContactPreference[] => {
    const pref: ContactPreference[] = [];

    Array.from(editAlertMap.values()).map((alert) => {
      if (alert.category && alert.method) {
        pref.push({
          optOut: alert.selected ? 'I' : 'O',
          communicationCategory: alert.category,
          communicationMethod: alert.method,
        });
      }

      if (alert.childCheckBox) {
        Array.from(alert.childCheckBox.values()).map((childAlert) => {
          if (childAlert.category && childAlert.method) {
            pref.push({
              optOut: childAlert.selected ? 'I' : 'O',
              communicationCategory: childAlert.category,
              communicationMethod: childAlert.method,
            });
          }
        });
      }
    });

    return pref;
  };

  const handleNext = () => {
    const selectedPreferences = {
      mobileNumber: alertPreferenceData.mobileNumber,
      emailAddress: alertPreferenceData.emailAddress,
      contactPreference: getPreferences(),
      memberKey: '',
      subscriberKey: '',
      groupKey: '',
      lineOfBusiness: '',
      memberUserId: '',
      dutyToWarn:
        alertPreferenceData.dutyToWarn?.map((item) => item.texts.join('')) ||
        [],
    };

    showAppModal({
      content: (
        <UpdateCommunicationTerms selectedPreferences={selectedPreferences} />
      ),
    });
  };
  const generateCheckBox = (
    preference: Preferences,
    alertType: AlertType,
    parentAlertType?: AlertType,
  ) => {
    return (
      <Checkbox
        label={preference.hText} // Use hText for the label
        classProps=""
        checked={preference.selected}
        body={
          <>
            <TextBox className="body-bold mb-2" text={preference.hText} />
            <TextBox text={preference.pText} />
          </>
        }
        onChange={() => checkBoxHandler(alertType, parentAlertType)}
      />
    );
  };

  return (
    <Card className={className}>
      <div>
        <Header text="Edit Alert Preferences" type="title-2" className="pl-3" />
        <Spacer size={12} />
        <TextBox text="Sign up for email and text alerts." className="pl-3" />
        <Spacer size={18} />
        {alertPreferenceData.tierOneDescriptions &&
        alertPreferenceData.tierOneDescriptions ? (
          [...editAlertMap.entries()].map(([alertType, preference], index) => {
            return (
              <Card className={className} key={index}>
                <Column>
                  {generateCheckBox(preference, alertType)}
                  {preference.selected && preference.childCheckBox && (
                    <Column className="emailAlertsSublevel">
                      <Spacer size={18} />
                      <Divider axis="vertical" />
                      <Spacer size={18} />
                      <TextBox text="Choose the emails you want to receive:" />
                      <Spacer size={32} />
                      {preference.childCheckBox.size > 0 &&
                        [...preference.childCheckBox.entries()].map(
                          ([childAlertType, childPreference], index) => {
                            return (
                              <div key={index}>
                                {generateCheckBox(
                                  childPreference,
                                  childAlertType,
                                  alertType,
                                )}
                                <Spacer size={32} />
                              </div>
                            );
                          },
                        )}
                    </Column>
                  )}
                </Column>
              </Card>
            );
          })
        ) : (
          <ErrorInfoCard
            className="mt-2 ml-3"
            errorText="We're not able to load your communication settings right now. Please try again later."
          />
        )}
        {Array.from(editAlertMap.values()).some(
          (value) => value.selected === true,
        ) && (
          <Row className="pl-3 pr-3">
            <Button label="Cancel" type="secondary" callback={resetState} />
            <Spacer axis="horizontal" size={32} />
            <Button label="Next" type="primary" callback={handleNext} />
          </Row>
        )}
      </div>
    </Card>
  );
};
