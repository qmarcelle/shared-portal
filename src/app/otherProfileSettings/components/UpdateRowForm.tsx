import Image from 'next/image';
import { ReactElement, useState } from 'react';
import editIcon from '../../../../../public/assets/edit.svg';
import { IComponent } from '../../../../components/IComponent';
import { Button } from '../../../../components/foundation/Button';
import { Checkbox } from '../../../../components/foundation/Checkbox';
import { Column } from '../../../../components/foundation/Column';
import { Divider } from '../../../../components/foundation/Divider';
import { Radio } from '../../../../components/foundation/Radio';
import { Row } from '../../../../components/foundation/Row';
import { Spacer } from '../../../../components/foundation/Spacer';
import { TextBox } from '../../../../components/foundation/TextBox';
import { TextField } from '../../../../components/foundation/TextField';
import { Title } from '../../../../components/foundation/Title';
type OptionType = 'radio' | 'checkbox' | 'textbox' | 'currentselection';

export interface UpdateRowFormProps extends IComponent {
  label: ReactElement;
  subLabel?: string;
  divider?: boolean;
  enabled: boolean;
  optionObjects: OptionData[];
  saveCallback?: () => void | Promise<void> | null;
  cancelCallback?: boolean;
  type: OptionType;
  icon?: JSX.Element;
}

export interface OptionData {
  label: string;
  enabled: boolean;
}

export const UpdateRowForm = ({
  label,
  subLabel,
  divider = false,
  type,
  optionObjects,
  saveCallback,
  cancelCallback,
}: UpdateRowFormProps) => {
  const [isCancel, setCancel] = useState(false);

  const updateCallBack = () => {
    setCancel(true);
  };

  return (
    <Column className="w-[460px]">
      {label}
      <Column className="body-2">{subLabel}</Column>
      <Spacer size={16} />
      <Column>
        {type === 'radio' &&
          optionObjects.map((OptionData, index) => (
            <Column key={index}>
              <Radio label={OptionData.label} selected={OptionData.enabled} />
            </Column>
          ))}
        {type === 'checkbox' &&
          optionObjects.map((OptionData, index) => (
            <Column key={index}>
              <Checkbox label={OptionData.label} selected={false} />
            </Column>
          ))}
        {type === 'textbox' && (
          <Column className=" w-[300px] body-1 ">
            <Radio label="Enter Language" selected={false} />
            <Column className="px-10 ">
              <TextField type="text" label=""></TextField>
            </Column>
            <Radio label="Decline to answer" selected={false} />
          </Column>
        )}
        {type === 'currentselection' && (
          <Column className=" body-1 px-1" onClick={saveCallback}>
            <TextBox text="Current Selection: Hispanic or Latino" />
            <Spacer size={8} />
            <Title
              className="font-bold primary-color"
              text="Update"
              suffix={<Image src={editIcon} alt="link" />}
            />
          </Column>
        )}
      </Column>
      <Spacer size={16} />
      <Row className="flex-row">
        {type != 'currentselection' && (
          <Button
            className="w-[250px]"
            label="Save Answer"
            type="primary"
            callback={saveCallback}
          />
        )}
        <Spacer axis="horizontal" size={16} />
        {cancelCallback === true && isCancel === false && (
          <Button
            className="w-[250px]"
            label="Cancel"
            type="secondary"
            callback={updateCallBack}
          />
        )}
      </Row>
      <Spacer size={32} />
      {divider && <Divider />}
    </Column>
  );
};
