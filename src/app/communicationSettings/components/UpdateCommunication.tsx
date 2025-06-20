import { IComponent } from '@/components/IComponent';
import { Column } from '@/components/foundation/Column';
import { Divider } from '@/components/foundation/Divider';
import { Spacer } from '@/components/foundation/Spacer';
import { TextBox } from '@/components/foundation/TextBox';
import { Title } from '@/components/foundation/Title';
import { ReactElement } from 'react';

export interface UpdateCommunicationProps extends IComponent {
  label: ReactElement;
  subLabel?: string;
  methodName: string;
  icon?: JSX.Element;
  divider?: boolean;
}

export const UpdateCommunication = ({
  label,
  subLabel,
  methodName,
  icon = <img src="/assets/edit.svg" alt="link" />,
  divider = false,
  onClick,
}: UpdateCommunicationProps) => {
  return (
    <Column>
      {label}
      <Spacer size={16} />
      {subLabel && <TextBox className="mb-4" text={subLabel} />}
      <Title
        className="font-bold primary-color"
        text={methodName}
        callback={onClick}
        suffix={icon}
      />

      <Spacer size={24} />
      {divider && <Divider />}
    </Column>
  );
};
