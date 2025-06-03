import { ReactElement } from 'react';
import alertErrorSvg from '../../../public/assets/alert_error_red.svg';
import editIcon from '../../../public/assets/edit.svg';
import { IComponent } from '../IComponent';
import { AppLink } from '../foundation/AppLink';
import { Column } from '../foundation/Column';
import { Divider } from '../foundation/Divider';
import { OnOffLabel } from '../foundation/OnOffLabel';
import { Row } from '../foundation/Row';
import { Spacer, SpacerX } from '../foundation/Spacer';
import { TextBox } from '../foundation/TextBox';

export interface UpdateRowWithStatusProps extends IComponent {
  label: ReactElement;
  subLabel?: string;
  methodName: string;
  icon?: JSX.Element;
  divider?: boolean;
  enabled?: boolean;
  onOffLabelEnabled?: boolean;
  profile?: string;
  emailVerified?: boolean;
  phoneVerified?: boolean;
}

export const UpdateRowWithStatus = ({
  className,
  label,
  subLabel,
  methodName,
  enabled = false,
  onOffLabelEnabled = true,
  icon = <img src="/assets/edit.svg" alt="" />,
  divider = false,
  onClick,
  profile,
  emailVerified,
  phoneVerified,
}: UpdateRowWithStatusProps) => {
  return (
    <Column className={className || ''} onClick={onClick}>
      <Row>
        <Column>
          {onOffLabelEnabled && (
            <OnOffLabel className="onOff-desktop" enabled={enabled} />
          )}
        </Column>
        <SpacerX size={16} />
        <Column>
          {onOffLabelEnabled && (
            <OnOffLabel className="onOff-mobile" enabled={enabled} />
          )}
          {label}
          <Spacer size={16} />
          {subLabel && <TextBox className="mb-4" text={subLabel} />}

          {profile == 'Phone Number' && !subLabel && (
            <div className="text-red-500">
              <Row>
                <Image src={alertErrorSvg} className="icon mt-1" alt="alert" />
                <TextBox
                  className="body-1 pt-1.5 ml-2"
                  text="No phone number on file."
                />
              </Row>
            </div>
          )}
          {profile == 'Email Address' && !subLabel && (
            <div className="text-red-500 ">
              <Row>
                <Image src={alertErrorSvg} className="icon mt-1" alt="alert" />
                <TextBox
                  className="body-1 pt-1.5 ml-2"
                  text="No email address on file."
                />
              </Row>
            </div>
          )}

          {!emailVerified && profile == 'Phone Number' && subLabel && (
            <div className="text-red-500">
              <Row>
                <Image src={alertErrorSvg} className="icon mt-1" alt="alert" />
                <TextBox
                  className="body-1 pt-1.5 ml-2"
                  text="Please confirm your phone number."
                />
              </Row>
            </div>
          )}

          {!phoneVerified && profile == 'Email Address' && subLabel && (
            <div className="text-red-500 ">
              <Row>
                <Image src={alertErrorSvg} className="icon mt-1" alt="alert" />
                <TextBox
                  className="body-1 pt-1.5 ml-2"
                  text="Please confirm your email address."
                />
              </Row>
            </div>
          )}

          <AppLink
            className="font-bold primary-color pl-0"
            displayStyle="flex"
            linkUnderline="!no-underline"
            label={methodName}
            icon={icon}
            type="button"
          />
        </Column>
      </Row>
      {divider && <Divider className="mt-8" />}
    </Column>
  );
};
