'use client';
import { Column } from '@/components/foundation/Column';
import { Dropdown } from '@/components/foundation/Dropdown';
import { Row } from '@/components/foundation/Row';
import { Spacer } from '@/components/foundation/Spacer';
import { TextBox } from '@/components/foundation/TextBox';
import { TextField } from '@/components/foundation/TextField';
import { statesList } from '@/utils/states_list';
import { firstColumnWidth } from '../types/RedeterminationFormTypes';
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const PrescriberInfoStep = ({ register, errors, setValue }: any) => {
  return (
    <div className="formBoundary" style={{ padding: '16px' }}>
      <Column className="form-container">
        <div className="p-2 bg-primary">
          <TextBox className="text-white" text="Prescriber's Information" />
        </div>
        <Spacer size={32} />
        <Row className="form-row">
          <TextField
            label="Name"
            required={true}
            otherProps={register('prescriberName', {
              required: 'Name is required',
            })}
            errors={
              errors.prescriberName ? [errors.prescriberName.message] : null
            }
          />
        </Row>
        <Spacer size={16} />
        <Row className="form-row">
          <TextField
            label="Address 1"
            required={true}
            otherProps={register('prescriberAddress1', {
              required: 'Address is required',
            })}
            errors={
              errors.prescriberAddress1
                ? [errors.prescriberAddress1.message]
                : null
            }
          />
        </Row>
        <Spacer size={16} />
        <Row className="form-row">
          <TextField
            label="Address 2"
            otherProps={register('prescriberAddress2', { required: false })}
            errors={
              errors.prescriberAddress2
                ? [errors.prescriberAddress2.message]
                : null
            }
          />
        </Row>
        <Spacer size={16} />
        <Row>
          <TextField
            label="City"
            required={true}
            errors={
              errors.prescriberCity?.message
                ? [String(errors.prescriberCity.message)]
                : null
            }
            otherProps={register('prescriberCity', {
              required: 'City is required',
            })}
            maxWidth={firstColumnWidth}
          />

          <Spacer axis="horizontal" size={64} />

          <div style={{ width: firstColumnWidth }}>
            <TextBox
              type="body-1"
              className="mr-2"
              text="State: "
              isRequiredLabel={true}
            />
            <Dropdown
              items={statesList}
              error={
                errors.prescriberState?.message
                  ? String(errors.prescriberState.message)
                  : undefined
              }
              initialSelectedValue={'Tennessee'}
              onSelectCallback={(value: string) =>
                setValue('prescriberState', value)
              }
              className="input"
              maxWidth={'100%'}
              iconAlignment="right"
            />
          </div>

          <Spacer axis="horizontal" size={32} />

          <TextField
            label="Zip Code"
            errors={
              errors.prescriberZipCode?.message
                ? [String(errors.prescriberZipCode.message)]
                : null
            }
            required={true}
            otherProps={register('prescriberZipCode', {
              required: 'Zip code is required',
            })}
            maxWidth={firstColumnWidth}
          />
        </Row>
        <Spacer size={16} />
        <Row className="form-row">
          <TextField
            label="Phone Number"
            required={true}
            otherProps={register('prescriberPhoneNumber', {
              required: 'Phone number is required',
            })}
            errors={
              errors.prescriberPhoneNumber
                ? [errors.prescriberPhoneNumber.message]
                : null
            }
            maxWidth={firstColumnWidth}
          />
          <Spacer axis="horizontal" size={64} />
          <TextField
            label="Fax"
            required={true}
            otherProps={register('prescriberFax', {
              required: 'Fax is required',
            })}
            errors={
              errors.prescriberFax ? [errors.prescriberFax.message] : null
            }
            maxWidth={firstColumnWidth}
          />
        </Row>
        <Spacer size={16} />

        <TextField
          label="Office Contact Person"
          otherProps={register('prescriberContact')}
          errors={
            errors.prescriberContact ? [errors.prescriberContact.message] : null
          }
          maxWidth={'70%'}
        />
        <Spacer size={16} />
        <TextBox
          text="Indicates required fields"
          className="form-note"
          isRequiredLabel={true}
        />
      </Column>
    </div>
  );
};

export default PrescriberInfoStep;
