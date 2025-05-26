import { Column } from '@/components/foundation/Column';
import { Dropdown } from '@/components/foundation/Dropdown';
import { Row } from '@/components/foundation/Row';
import { TextField } from '@/components/foundation/TextField';
import { useEffect, useState } from 'react';
import { useFormContext } from 'react-hook-form';
import getCounties from '../../actions/getCounties';
import { IHBCSchema } from '../../rules/schema';
import { usStateCodes } from '../../rules/statesOfUSA';

type ChangeAddressProps = {
  type: 'billing' | 'residence' | 'mailing';
};

export const ChangeAddressForm = ({ type }: ChangeAddressProps) => {
  const { register, getValues, watch } = useFormContext<IHBCSchema>();
  const [counties, setCounties] = useState<string[]>([]);
  const residenceZip = watch('changePersonalInfo.changeAddress.residence.zip');
  useEffect(() => {
    if (type == 'residence') {
      if (residenceZip?.length == 5) {
        loadCounties();
      } else {
        if (counties.length > 0) {
          setCounties([]);
        }
      }
    }
  }, [residenceZip]);

  async function loadCounties() {
    const result = await getCounties(residenceZip);
    if (result) {
      setCounties(result);
    }
  }

  return (
    <Column className="gap-2">
      <Row className="gap-4">
        <TextField
          otherProps={register(
            `changePersonalInfo.changeAddress.${type}.street`,
          )}
          label="Street"
        />
        <TextField
          otherProps={register(`changePersonalInfo.changeAddress.${type}.city`)}
          label="City"
        />
      </Row>
      <Row className="gap-4">
        <Column className="w-fit shrink-0">
          <p>State</p>
          <Dropdown
            initialSelectedValue={
              getValues(`changePersonalInfo.changeAddress.${type}.state`) ??
              'Select State'
            }
            items={[
              { label: 'Select State', value: 'Select State' },
              ...usStateCodes.map((item) => ({ label: item, value: item })),
            ]}
            onSelectCallback={(val) => {
              register(
                `changePersonalInfo.changeAddress.${type}.state`,
              ).onChange({
                target: {
                  name: `changePersonalInfo.changeAddress.${type}.state`,
                  value: val,
                },
              });
            }}
          />
        </Column>
        <TextField
          otherProps={register(`changePersonalInfo.changeAddress.${type}.zip`)}
          label="Zip"
        />
        {type == 'residence' && (
          <Column className="shrink-0">
            <p>County</p>
            <Dropdown
              initialSelectedValue={
                getValues(`changePersonalInfo.changeAddress.${type}.county`) ??
                'Select County'
              }
              items={[
                { label: 'Select County', value: 'Select County' },
                ...counties.map((item) => ({ label: item, value: item })),
              ]}
              onSelectCallback={(val) => {
                register(
                  `changePersonalInfo.changeAddress.${type}.county`,
                ).onChange({
                  target: {
                    name: `changePersonalInfo.changeAddress.${type}.county`,
                    value: val,
                  },
                });
              }}
            />
          </Column>
        )}
      </Row>
    </Column>
  );
};
