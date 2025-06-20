import { ReactElement } from 'react';
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
