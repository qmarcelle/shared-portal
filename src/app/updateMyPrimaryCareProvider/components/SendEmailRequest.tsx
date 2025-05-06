import { updatePCPhysician } from '@/app/(commo../(common)/findcare/primaryCareOptions/actions/pcpInfo';
import { UpdatePCPPhysicianRequest } from '@/app/(commo../(common)/findcare/primaryCareOptions/model/app/updatePCPPhysicianRequest';
import { EmailSuccessFailure } from '@/app/(commo../(common)/support/sendAnEmail/components/EmailSuccessFailure';
import { IComponent } from '@/components/IComponent';
import { Button } from '@/components/foundation/Button';
import { Card } from '@/components/foundation/Card';
import { Column } from '@/components/foundation/Column';
import { Filter } from '@/components/foundation/Filter';
import { Header } from '@/components/foundation/Header';
import { Spacer } from '@/components/foundation/Spacer';
import { TextBox } from '@/components/foundation/TextBox';
import { TextField } from '@/components/foundation/TextField';
import { AppProg } from '@/models/app_prog';
import { FilterItem } from '@/models/filter_dropdown_details';
import { isValidMobileNumber } from '@/utils/inputValidator';
import { isValidZipCode } from '@/utils/zipcode_formatter';
import { FormEvent, useState } from 'react';

interface SendEmailRequestProps extends IComponent {
  icon?: JSX.Element;
  filters: FilterItem[];
}

interface FormData {
  provider: string[];
  city: string[];
  state: string[];
  zipCode: string[];
  county: string[];
  phoneNumber: string[];
  streetAddress: string[];
}

export const SendEmailRequest = ({ filters }: SendEmailRequestProps) => {
  const [progress, setProgress] = useState(AppProg.init);
  const [filter, setFilter] = useState(filters);

  function onFilterSelect(index: number, filter: FilterItem[]) {
    setFilter(filter);
  }
  const [formData, setFormData] = useState({
    provider: '',
    streetAddress: '',
    city: '',
    state: '',
    zipCode: '',
    county: '',
    phoneNumber: '',
  });

  const [errors, setErrors] = useState<Partial<FormData>>({
    provider: [],
    city: [],
    state: [],
    zipCode: [],
    county: [],
    phoneNumber: [],
  });

  const requiredFieldError = '(Required Field)';

  const handleChange = (name: keyof FormData, value: string) => {
    setFormData({
      ...formData,
      [name]: value,
    });
    setErrors({
      ...errors,
      [name]: value ? [] : [requiredFieldError],
    });
    if (value.length > 0) {
      if (name === 'zipCode' && !isValidZipCode(value)) {
        setErrors({
          ...errors,
          [name]: value ? ['Please enter a valid zip code.'] : [],
        });
      }
      if (name === 'phoneNumber' && !isValidMobileNumber(value)) {
        setErrors({
          ...errors,
          [name]: value
            ? ['Please enter a valid contact phone number (XXX-XXX-XXXX).']
            : [],
        });
      }
    }
  };

  const validate = () => {
    const tempErrors: Partial<FormData> = { ...errors };
    if (!isValidMobileNumber(formData.phoneNumber)) {
      tempErrors.phoneNumber = [
        'Please enter a valid contact phone number (XXX-XXX-XXXX).',
      ];
    }
    if (!isValidZipCode(formData.zipCode)) {
      tempErrors.zipCode = ['Please enter a valid zip code.'];
    }
    (Object.keys(formData) as (keyof FormData)[]).forEach((key) => {
      if (!formData[key] && key !== 'streetAddress') {
        tempErrors[key] = [requiredFieldError];
      }
    });
    setErrors(tempErrors);
    let ifError: boolean = false;
    ifError = Object.values(tempErrors).every((value) => value.length === 0);

    return ifError;
  };

  async function invokeSendEmail(e?: FormEvent<HTMLFormElement>) {
    e?.preventDefault();
    if (validate()) {
      // Submit the form
      const emailRequest: UpdatePCPPhysicianRequest = {
        contactName: filter[0].selectedValue?.label ?? '',
        physicianName: formData.provider,
        physicianAddress: formData.streetAddress,
        physicianCity: formData.city,
        physicianState: formData.state,
        physicianZip: formData.zipCode,
        physicianCounty: formData.county,
        contactPhone: formData.phoneNumber,
        contactRelation: '',
        memberCK: '',
        subscriberID: '',
        subscriberName: '',
      };
      const result = await updatePCPhysician(emailRequest);
      if (result.status == 200) {
        setProgress(AppProg.success);
      } else {
        setProgress(AppProg.failed);
      }
      getComponent();
    }
  }
  function resetForm() {
    setFormData({
      provider: '',
      streetAddress: '',
      city: '',
      state: '',
      zipCode: '',
      county: '',
      phoneNumber: '',
    });
    setErrors({
      provider: [],
      city: [],
      state: [],
      zipCode: [],
      county: [],
      phoneNumber: [],
    });
    setProgress(AppProg.init);
  }
  function getComponent() {
    switch (progress) {
      case AppProg.init:
        return (
          <form
            onSubmit={(e) => {
              invokeSendEmail(e);
            }}
          >
            <Column>
              <Header
                className="title-2"
                text="Option 2: Send an Email Request"
              />
              <Spacer size={16} />
              <TextBox
                className="body-1"
                text="Enter your doctor's information in the form below.if there are any issues with your request, we'll contact you."
              />
              <Spacer size={32} />

              <Filter
                className="px-0 m-0 !border-none"
                filterHeading="Member Information"
                onReset={() => {}}
                showReset={false}
                onSelectCallback={(index, data) => onFilterSelect(index, data)}
                filterItems={filter}
              />
              <Header className="title-2" text="Provider Information"></Header>
              <Spacer size={32} />

              <TextField
                label="Name of Provider (First & Last Name)"
                value={formData.provider}
                valueCallback={(event) => handleChange('provider', event)}
                errors={errors.provider}
              />
              <Spacer size={32} />
              <TextField
                label="Street Address"
                value={formData.streetAddress}
                valueCallback={(event) => handleChange('streetAddress', event)}
              />
              <Spacer size={32} />
              <TextField
                label="City"
                value={formData.city}
                valueCallback={(event) => handleChange('city', event)}
                errors={errors.city}
              />
              <Spacer size={32} />
              <TextField
                label="State"
                value={formData.state}
                valueCallback={(event) => handleChange('state', event)}
                errors={errors.state}
              />
              <Spacer size={32} />
              <TextField
                label="Zip Code"
                value={formData.zipCode}
                valueCallback={(event) => handleChange('zipCode', event)}
                errors={errors.zipCode}
              />
              <Spacer size={32} />
              <TextField
                label="County"
                value={formData.county}
                valueCallback={(event) => handleChange('county', event)}
                errors={errors.county}
              />
              <Spacer size={32} />
              <TextField
                label="Phone Number"
                value={formData.phoneNumber}
                valueCallback={(event) => handleChange('phoneNumber', event)}
                errors={errors.phoneNumber}
              />
              <Spacer size={32} />
              <Button
                callback={invokeSendEmail}
                label="Submit Request"
                style="submit"
              ></Button>
            </Column>
          </form>
        );
      case AppProg.failed:
        return (
          <EmailSuccessFailure
            key={1}
            label="Try Again Later"
            isSuccess={false}
            body={
              <Column className="items-center">
                <TextBox
                  className="text-center"
                  text="We're sorry, something went wrong. Please try again later."
                />
                <Spacer size={8} />
                <Button
                  className="text-center"
                  label="Done"
                  callback={resetForm}
                />
              </Column>
            }
          />
        );
      case AppProg.success:
        return (
          <EmailSuccessFailure
            key={2}
            label="Got it!"
            isSuccess={true}
            body={
              <Column className="items-center">
                <TextBox
                  className="text-center"
                  text="We're reading your request. If there are any issues, we'll contact you. "
                />

                <Spacer size={8} />
                <Button
                  className="text-center"
                  label="Done"
                  callback={resetForm}
                />
              </Column>
            }
          />
        );
    }
  }
  return (
    <Card className="large-section">
      <Column className="w-[100%]">{getComponent()}</Column>
    </Card>
  );
};
