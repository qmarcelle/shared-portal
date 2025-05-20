import { IComponent } from '@/components/IComponent';
import { Button } from '@/components/foundation/Button';
import { Checkbox } from '@/components/foundation/Checkbox';
import { Column } from '@/components/foundation/Column';
import { Divider } from '@/components/foundation/Divider';
import { Radio } from '@/components/foundation/Radio';
import { Row } from '@/components/foundation/Row';
import { Spacer } from '@/components/foundation/Spacer';
import { TextBox } from '@/components/foundation/TextBox';
import { TextField } from '@/components/foundation/TextField';
import { Title } from '@/components/foundation/Title';
import Image from 'next/image';
import { ReactElement } from 'react';
import editIcon from '../../../../public/assets/edit.svg';
import { LangauageDetails } from '../model/api/language';
type OptionType = 'radio' | 'checkbox' | 'textbox' | 'currentselection';

export interface UpdateRowFormProps extends IComponent {
  label: ReactElement;
  subLabel?: string;
  divider?: boolean;
  enabled: boolean;
  optionObjects: OptionData[];
  saveCallback?: () => void | Promise<void> | null;
  cancelCallback?: () => void;
  type: OptionType;
  icon?: JSX.Element;
  optionsEnabled?: boolean;
  isRaceField?: boolean;
  languageOptions?: LangauageDetails[];
  isDeclineLanguageSelected?: boolean;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  selectionCallBack?: (val: any, isChecked?: boolean) => void;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  languageSelectionCallBack?: (val: any) => void;
  validLanguage?: boolean;
  languageEmptySelect?: boolean;
  isImpersonated?: boolean;
}

export interface OptionData {
  label: string;
  code: string;
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
  isRaceField,
  optionsEnabled,
  languageOptions,
  isDeclineLanguageSelected,
  selectionCallBack,
  languageSelectionCallBack,
  validLanguage,
  languageEmptySelect,
  isImpersonated = false,
}: UpdateRowFormProps) => {
  function currentSelectionText(optionObjects: OptionData[]) {
    if (!isRaceField)
      return <TextBox text={'Current Selection: ' + optionObjects[0].label} />;
    else {
      const raceText = optionObjects.map((item) => item.label).join(',');
      return <TextBox text={`Current Selection: ${raceText}`} />;
    }
  }

  function languageErrorText() {
    if (!validLanguage) return ['Invalid entry.Please try again'];
    else return [];
  }

  function checkImpersonationForSaveCallback() {
    if (isImpersonated) {
      alert('This functionality is not available in impersonation mode');
      return;
    }
    saveCallback?.();
  }

  return (
    <Column className="w-[460px]">
      {label}
      <Column className="body-2">{subLabel}</Column>
      <Spacer size={16} />
      <Column>
        {type === 'radio' &&
          optionObjects.map((OptionData, index) => (
            <Column key={index}>
              <Radio
                label={OptionData.label}
                selected={OptionData.enabled}
                value={OptionData.code}
                callback={(val) => selectionCallBack?.(val)}
              />
            </Column>
          ))}
        {type === 'checkbox' &&
          optionObjects.map((OptionData, index) => (
            <Column key={index}>
              <Checkbox
                label={OptionData.label}
                checked={OptionData.enabled}
                onChange={(isChecked) =>
                  selectionCallBack?.(OptionData.code, isChecked)
                }
              />
            </Column>
          ))}
        {type === 'textbox' && (
          <div className=" w-[300px] body-1">
            <Radio
              label="Enter Language"
              selected={
                !isDeclineLanguageSelected && Boolean(languageEmptySelect)
              }
              value="L2"
              callback={(val) => selectionCallBack?.(val)}
            />
            {!isDeclineLanguageSelected && Boolean(languageEmptySelect) && (
              <Column className="px-10">
                <TextField
                  type="text"
                  value={optionObjects[0]?.label}
                  label=""
                  list="languageList"
                  valueCallback={(val) => languageSelectionCallBack?.(val)}
                  errors={languageErrorText()}
                ></TextField>

                <datalist id="languageList">
                  {languageOptions
                    ?.filter((item) => {
                      if (optionObjects.length > 0) {
                        return item.ncqaLanguageDesc
                          .toLowerCase()
                          .startsWith(optionObjects[0]?.label.toLowerCase());
                      } else {
                        return item;
                      }
                    })
                    .slice(0, 4)
                    .map((item) => (
                      <option
                        key={item.ncqaLanguageDesc}
                        value={item.ncqaLanguageDesc}
                        data-value={item.ncqaLanguageCode}
                      >
                        {item.ncqaLanguageDesc}
                      </option>
                    ))}
                </datalist>
              </Column>
            )}
            <Radio
              label="Decline to answer"
              selected={
                Boolean(isDeclineLanguageSelected) &&
                Boolean(languageEmptySelect)
              }
              value="Z2"
              callback={(val) => selectionCallBack?.(val)}
            />
          </div>
        )}
        {type === 'currentselection' && (
          <Column className=" body-1 px-1">
            {currentSelectionText(optionObjects)}

            <Spacer size={8} />
            <Column onClick={saveCallback}>
              <Title
                className="font-bold primary-color"
                text="Update"
                suffix={<Image src={editIcon} alt="link" />}
              />
            </Column>
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
            callback={checkImpersonationForSaveCallback}
            disable={isImpersonated}
          />
        )}
        <Spacer axis="horizontal" size={16} />
        {type != 'currentselection' && optionsEnabled && (
          <Button
            className="w-[250px]"
            label="Cancel"
            type="secondary"
            callback={cancelCallback}
          />
        )}
      </Row>
      <Spacer size={32} />
      {divider && <Divider />}
    </Column>
  );
};
