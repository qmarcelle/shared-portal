import Image from 'next/image';
import { ReactElement } from 'react';
import editIcon from '../../../public/assets/edit.svg';
import { IComponent } from '../IComponent';
import { Column } from '../foundation/Column';
import { Divider } from '../foundation/Divider';
import { OnOffLabel } from '../foundation/OnOffLabel';
import { Row } from '../foundation/Row';
import { Spacer, SpacerX } from '../foundation/Spacer';
import { TextBox } from '../foundation/TextBox';
import { Title } from '../foundation/Title';

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
  icon = <Image src={editIcon} alt="link" />,
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
          <Title
            className="body-bold primary-color"
            text={methodName}
            suffix={icon}
          />
        </Column>
      </Row>
      {divider && <Divider className="mt-8" />}
    </Column>
  );
};
