import { Column } from '@/components/foundation/Column';
import { TextBox } from '@/components/foundation/TextBox';
import { TextField } from '@/components/foundation/TextField';

import { Checkbox } from '@/components/foundation/Checkbox';
import { Dropdown } from '@/components/foundation/Dropdown';
import { useFormContext } from 'react-hook-form';
import { ChangeAddressTypeEnum } from '../../models/ChangeAddressTypeEnum';
import { ChangePersonalInfoEnum } from '../../models/ChangePersonalInfoEnum';
import { IHBCSchema } from '../../rules/schema';
import { usePersonalInformationStore } from '../../stores/personalInformationStore';
import { ChangeAddressForm } from './ChangeAddressForm';
import { ChangeNameForm } from './ChangeNameForm';

export const ChangePersonalInfoForm = () => {
  const [
    selectedProfileChangeItems,
    selectedAddressChangeItems,
    updateSelectedProfileChangeItems,
    updateSelectedAddressChangeItems,
  ] = usePersonalInformationStore((state) => [
    state.selectedChangeItems,
    state.selectedAddressChangeItems,
    state.updateSelectedChangeItems,
    state.updateSelectedAddressChangeItems,
  ]);

  const {
    register,
    unregister,
    getValues,
    formState: { errors },
  } = useFormContext<IHBCSchema>();

  function unregisterProfileField(field: ChangePersonalInfoEnum) {
    switch (field) {
      case ChangePersonalInfoEnum.changeName:
        unregister('changePersonalInfo.changeName');
        break;
      case ChangePersonalInfoEnum.changePhnNum:
        unregister('changePersonalInfo.changePhone');
        break;
      case ChangePersonalInfoEnum.changeEmail:
        unregister('changePersonalInfo.changeEmailAddress');
    }
  }

  return (
    <Column className="ml-10 mt-4 gap-6">
      <div>
        <Checkbox
          value="changeName"
          callback={() => {
            unregister('changePersonalInfo.changeName');
            updateSelectedProfileChangeItems(ChangePersonalInfoEnum.changeName);
          }}
          selected={selectedProfileChangeItems.includes(
            ChangePersonalInfoEnum.changeName,
          )}
          label="Change Name"
        />
        {selectedProfileChangeItems.includes(
          ChangePersonalInfoEnum.changeName,
        ) && (
          <div className="ml-10">
            <ChangeNameForm />
          </div>
        )}
      </div>
      <div>
        <Checkbox
          value={ChangePersonalInfoEnum.changeAddress}
          callback={() => {
            unregister('changePersonalInfo.changeAddress');
            updateSelectedProfileChangeItems(
              ChangePersonalInfoEnum.changeAddress,
            );
          }}
          selected={selectedProfileChangeItems.includes(
            ChangePersonalInfoEnum.changeAddress,
          )}
          label="Change Address"
        />
        {selectedProfileChangeItems.includes(
          ChangePersonalInfoEnum.changeAddress,
        ) && (
          <div className="ml-10 mt-4">
            <Column>
              <div>
                <Checkbox
                  value={ChangeAddressTypeEnum.residence}
                  callback={() => {
                    unregister('changePersonalInfo.changeAddress.residence');
                    updateSelectedAddressChangeItems(
                      ChangeAddressTypeEnum.residence,
                    );
                  }}
                  selected={selectedAddressChangeItems.includes(
                    ChangeAddressTypeEnum.residence,
                  )}
                  label="Residence (No PO Boxes are accepted)"
                />
                {selectedAddressChangeItems.includes(
                  ChangeAddressTypeEnum.residence,
                ) && (
                  <div className="ml-10">
                    <ChangeAddressForm type="residence" />
                  </div>
                )}
              </div>
              <div>
                <Checkbox
                  value={ChangeAddressTypeEnum.mailing}
                  callback={() => {
                    unregister('changePersonalInfo.changeAddress.mailing');
                    updateSelectedAddressChangeItems(
                      ChangeAddressTypeEnum.mailing,
                    );
                  }}
                  selected={selectedAddressChangeItems.includes(
                    ChangeAddressTypeEnum.mailing,
                  )}
                  label="Mailing"
                />
                {selectedAddressChangeItems.includes(
                  ChangeAddressTypeEnum.mailing,
                ) && (
                  <div className="ml-10">
                    <ChangeAddressForm type="mailing" />
                  </div>
                )}
              </div>
              <div>
                <Checkbox
                  value={ChangeAddressTypeEnum.billing}
                  callback={() => {
                    unregister('changePersonalInfo.changeAddress.billing');
                    updateSelectedAddressChangeItems(
                      ChangeAddressTypeEnum.billing,
                    );
                  }}
                  selected={selectedAddressChangeItems.includes(
                    ChangeAddressTypeEnum.billing,
                  )}
                  label="Billing"
                />
                {selectedAddressChangeItems.includes(
                  ChangeAddressTypeEnum.billing,
                ) && (
                  <div className="ml-10">
                    <ChangeAddressForm type="billing" />
                  </div>
                )}
              </div>
            </Column>
          </div>
        )}
      </div>
      <div>
        <Checkbox
          value={ChangePersonalInfoEnum.changePhnNum}
          callback={() => {
            unregisterProfileField(ChangePersonalInfoEnum.changePhnNum);
            return updateSelectedProfileChangeItems(
              ChangePersonalInfoEnum.changePhnNum,
            );
          }}
          selected={selectedProfileChangeItems.includes(
            ChangePersonalInfoEnum.changePhnNum,
          )}
          label="Change Phone Number"
        />
        {selectedProfileChangeItems.includes(
          ChangePersonalInfoEnum.changePhnNum,
        ) && (
          <div className="ml-10">
            <TextField
              otherProps={register('changePersonalInfo.changePhone')}
              label="Change Phone Number"
              errors={[errors.changePersonalInfo?.changePhone?.message]}
            />
          </div>
        )}
      </div>
      <div>
        <Checkbox
          value={ChangePersonalInfoEnum.changeEmail}
          callback={() => {
            unregisterProfileField(ChangePersonalInfoEnum.changeEmail);
            updateSelectedProfileChangeItems(
              ChangePersonalInfoEnum.changeEmail,
            );
          }}
          selected={selectedProfileChangeItems.includes(
            ChangePersonalInfoEnum.changeEmail,
          )}
          label="Change Email Address"
        />
        {selectedProfileChangeItems.includes(
          ChangePersonalInfoEnum.changeEmail,
        ) && (
          <div className="ml-10">
            <TextField
              otherProps={register('changePersonalInfo.changeEmailAddress', {
                required: true,
              })}
              label="Change Email Address"
              errors={[errors.changePersonalInfo?.changeEmailAddress?.message]}
            />
          </div>
        )}
      </div>
      <div>
        <Checkbox
          value={ChangePersonalInfoEnum.changeTobaccoUse}
          callback={() => {
            unregister('changePersonalInfo.changeTobaccoUse');
            updateSelectedProfileChangeItems(
              ChangePersonalInfoEnum.changeTobaccoUse,
            );
          }}
          selected={selectedProfileChangeItems.includes(
            ChangePersonalInfoEnum.changeTobaccoUse,
          )}
          label="Change Tobacco Use"
        />
        {selectedProfileChangeItems.includes(
          ChangePersonalInfoEnum.changeTobaccoUse,
        ) && (
          <div className="ml-10">
            <TextBox text="(Includes all tobacco products, except tobacco used for religious or ceremonial purposes.)" />
            <TextBox text="On average have you used any tobacco products four or more times per week in the past six months?:" />
            <div className="ml-10">
              <Dropdown
                label="Primary Applicant"
                initialSelectedValue={
                  getValues(
                    'changePersonalInfo.changeTobaccoUse.primaryApplicant',
                  ) ?? 'Select For Primary Applicant'
                }
                items={[
                  {
                    label: 'Select For Primary Applicant',
                    value: 'Select For Primary Applicant',
                  },
                  {
                    label: 'Yes',
                    value: 'Y',
                  },
                  {
                    label: 'No',
                    value: 'N',
                  },
                ]}
                onSelectCallback={(val) => {
                  register(
                    'changePersonalInfo.changeTobaccoUse.primaryApplicant',
                  ).onChange({
                    target: {
                      name: 'changePersonalInfo.changeTobaccoUse.primaryApplicant',
                      value: val,
                    },
                  });
                }}
              />
              <Dropdown
                label="Spouse"
                initialSelectedValue={
                  getValues('changePersonalInfo.changeTobaccoUse.spouse') ??
                  'Select For Spouse'
                }
                items={[
                  {
                    label: 'Select For Spouse',
                    value: 'Select For Spouse',
                  },
                  {
                    label: 'Yes',
                    value: 'Yes',
                  },
                ]}
                onSelectCallback={(val) => {
                  register(
                    'changePersonalInfo.changeTobaccoUse.spouse',
                  ).onChange({
                    target: {
                      name: 'changePersonalInfo.changeTobaccoUse.spouse',
                      value: val,
                    },
                  });
                }}
              />
            </div>
          </div>
        )}
      </div>
    </Column>
  );
};
