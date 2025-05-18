'use client';
import { AppLink } from '@/components/foundation/AppLink';
import { CalendarField } from '@/components/foundation/CalendarField';
import { Dropdown } from '@/components/foundation/Dropdown';
import { Row } from '@/components/foundation/Row';
import { Spacer } from '@/components/foundation/Spacer';
import { TextBox } from '@/components/foundation/TextBox';
import { TextField } from '@/components/foundation/TextField';
import { statesList } from '@/utils/states_list';
import { firstColumnWidth } from '../types/RedeterminationFormTypes';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const EnrolleeInfoStep = ({ register, errors, setValue, watch }: any) => {
  const isEnrolleeRequestor = watch('isEnrolleeRequestor', true);

  return (
    <div className="formBoundary" style={{ padding: '16px' }}>
      <div className="p-2 bg-primary">
        <TextBox className="text-white" text="Enrollee/Requestor Information" />
      </div>
      <Spacer size={32} />
      <Row>
        <TextField
          label="First Name"
          required={true}
          errors={
            errors.enrolleeFirstName?.message
              ? [String(errors.enrolleeFirstName.message)]
              : null
          }
          otherProps={register('enrolleeFirstName', {
            required: 'First name is required',
          })}
          maxWidth={firstColumnWidth}
        />

        <Spacer axis="horizontal" size={64} />

        <TextField
          label="Middle Initial"
          otherProps={register('enrolleeMiddleInitial')}
          maxWidth={firstColumnWidth}
        />

        <Spacer axis="horizontal" size={64} />
        <TextField
          label="Last Name"
          required={true}
          errors={
            errors.enrolleeLastName?.message
              ? [String(errors.enrolleeLastName.message)]
              : null
          }
          otherProps={register('enrolleeLastName', {
            required: 'Last name is required',
          })}
          maxWidth={firstColumnWidth}
        />
      </Row>

      <Spacer size={16} />
      <CalendarField
        label="Date of Birth"
        type="date"
        valueCallback={(value: string) => {
          setValue('enrolleeDateOfBirth', value);
        }}
        errors={
          errors.enrolleeDateOfBirth?.message
            ? [String(errors.enrolleeDateOfBirth.message)]
            : null
        }
        isSuffixNeeded={true}
        maxWidth={'10rem'}
      />

      <Spacer size={16} />
      <TextField
        label="Address 1"
        errors={
          errors.enrolleeAddress1?.message
            ? [String(errors.enrolleeAddress1.message)]
            : null
        }
        otherProps={register('enrolleeAddress1', {
          required: 'Address is required',
        })}
        maxWidth="80%"
      />

      <Spacer size={16} />

      <TextField
        label="Address 2"
        maxWidth={'80%'}
        otherProps={register('enrolleeAddress2')}
      />

      <Spacer size={16} />
      <Row>
        <TextField
          label="City"
          errors={
            errors.enrolleeCity?.message
              ? [String(errors.enrolleeCity.message)]
              : null
          }
          otherProps={register('enrolleeCity', {
            required: 'City is required',
          })}
          maxWidth={firstColumnWidth}
        />

        <Spacer axis="horizontal" size={64} />

        <div style={{ width: firstColumnWidth }}>
          <TextBox type="body-1" className="mr-2" text="State: " />
          <Dropdown
            items={statesList}
            initialSelectedValue={''}
            onSelectCallback={(value: string) =>
              setValue('enrolleeState', value)
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
            errors.enrolleeZipCode?.message
              ? [String(errors.enrolleeZipCode.message)]
              : null
          }
          otherProps={register('enrolleeZipCode', {
            required: 'Zip code is required',
          })}
          maxWidth={firstColumnWidth}
        />
      </Row>
      <Spacer size={16} />
      <Row>
        <TextField
          label="Phone"
          required={true}
          errors={
            errors.enrolleePhone?.message
              ? [String(errors.enrolleePhone.message)]
              : null
          }
          otherProps={register('enrolleePhone', {
            required: 'Phone number is required',
          })}
          maxWidth={firstColumnWidth}
        />

        <Spacer axis="horizontal" size={64} />

        <TextField
          label="Enrollee's Member ID Number"
          required={true}
          errors={
            errors.enrolleeMemberId?.message
              ? [String(errors.enrolleeMemberId.message)]
              : null
          }
          otherProps={register('enrolleeMemberId', {
            required: 'Member ID is required',
          })}
          maxWidth={'40%'}
        />
      </Row>
      <Spacer size={32} />
      <Row>
        <TextBox
          type="body-1"
          className="mr-2"
          text="Is the enrollee making this request?"
        />
        <Dropdown
          items={[
            { label: 'Yes', value: 'true' },
            { label: 'No', value: 'false' },
          ]}
          initialSelectedValue={'true'}
          onSelectCallback={(value: string) =>
            setValue('isEnrolleeRequestor', value === 'true')
          }
          error={
            errors.isEnrolleeRequestor?.message
              ? String(errors.isEnrolleeRequestor.message)
              : undefined
          }
          className="input"
          maxWidth={'100%'}
          iconAlignment="right"
        />
      </Row>
      <Spacer size={32} />
      {!isEnrolleeRequestor && (
        <>
          <Row>
            <TextField
              label="First Name"
              required={true}
              errors={
                errors.requestorFirstName?.message
                  ? [String(errors.requestorFirstName.message)]
                  : null
              }
              otherProps={register('requestorFirstName', {
                required: 'First name is required',
              })}
              maxWidth={firstColumnWidth}
            />

            <Spacer axis="horizontal" size={64} />

            <TextField
              label="Middle Initial"
              otherProps={register('requestorMiddleInitial')}
              maxWidth={firstColumnWidth}
            />

            <Spacer axis="horizontal" size={64} />
            <TextField
              label="Last Name"
              required={true}
              errors={
                errors.requestorLastName?.message
                  ? [String(errors.requestorLastName.message)]
                  : null
              }
              otherProps={register('requestorLastName', {
                required: 'Last name is required',
              })}
              maxWidth={firstColumnWidth}
            />
          </Row>

          <Spacer size={16} />
          <TextField
            label="Requestor's Relationship to Enrollee"
            required={true}
            errors={
              errors.requestorRelationship?.message
                ? [String(errors.requestorRelationship.message)]
                : null
            }
            otherProps={register('requestorAddress1', {
              required: 'Relationship is required',
            })}
            maxWidth="80%"
          />

          <Spacer size={16} />
          <TextField
            label="Address 1"
            errors={
              errors.requestorAddress1?.message
                ? [String(errors.requestorAddress1.message)]
                : null
            }
            otherProps={register('requestorAddress1', {
              required: 'Address is required',
            })}
            maxWidth="80%"
          />

          <Spacer size={16} />

          <TextField
            label="Address 2"
            maxWidth={'80%'}
            otherProps={register('requestorAddress2')}
          />

          <Spacer size={16} />
          <Row>
            <TextField
              label="City"
              errors={
                errors.requestorCity?.message
                  ? [String(errors.requestorCity.message)]
                  : null
              }
              otherProps={register('requestorCity', {
                required: 'City is required',
              })}
              maxWidth={firstColumnWidth}
            />

            <Spacer axis="horizontal" size={64} />

            <div style={{ width: firstColumnWidth }}>
              <TextBox type="body-1" className="mr-2" text="State: " />
              <Dropdown
                items={statesList}
                initialSelectedValue={'Tennessee'}
                onSelectCallback={(value: string) =>
                  setValue('requestorState', value)
                }
                className="input"
                maxWidth={'100%'}
                iconAlignment="right"
                scrollThreshold={20}
              />
            </div>

            <Spacer axis="horizontal" size={32} />

            <TextField
              label="Zip Code"
              errors={
                errors.requestorZipCode?.message
                  ? [String(errors.requestorZipCode.message)]
                  : null
              }
              otherProps={register('requestorZipCode', {
                required: 'Zip code is required',
              })}
              maxWidth={firstColumnWidth}
            />
          </Row>
          <Spacer size={16} />
          <Row>
            <TextField
              label="Phone"
              required={true}
              errors={
                errors.requestorPhone?.message
                  ? [String(errors.requestorPhone.message)]
                  : null
              }
              otherProps={register('requestorPhone', {
                required: 'Phone number is required',
              })}
              maxWidth={firstColumnWidth}
            />
          </Row>
        </>
      )}
      <Spacer size={16} />
      <strong>
        <TextBox
          className="title-2"
          text="Representation documentation for requests made by someone other than the enrollee or the enrollee's prescriber:"
        />
      </strong>
      <Spacer size={16} />
      <strong>
        <TextBox className="body-1" text="For Medicare Part D Members:" />
      </strong>
      <Spacer size={16} />
      <TextBox text="You will need to provide documentation showing the authority to represent the enrollee (a completed Appointment of Representative Form CMS -1696 or written equivalent). To access the Appointment of Representative Form CMS-1696, visit:" />
      <AppLink
        className="link"
        url={'https://www.cms.gov/cmsforms/downloads/cms1696.pdf'}
        label="https://www.cms.gov/cmsforms/downloads/cms1696.pdf"
      />
    </div>
  );
};

export default EnrolleeInfoStep;
