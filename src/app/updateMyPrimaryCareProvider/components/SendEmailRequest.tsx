import { IComponent } from '@/components/IComponent';
import { Button } from '@/components/foundation/Button';
import { Card } from '@/components/foundation/Card';
import { Column } from '@/components/foundation/Column';
import { Filter } from '@/components/foundation/Filter';
import { Header } from '@/components/foundation/Header';
import { Spacer } from '@/components/foundation/Spacer';
import { TextBox } from '@/components/foundation/TextBox';
import { TextField } from '@/components/foundation/TextField';
import { isValidMobileNumber } from '@/utils/inputValidator';
import { isValidZipCode } from '@/utils/zipcode_formatter';
import { useState } from 'react';

interface SendEmailRequestProps extends IComponent {
  icon?: JSX.Element;
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

export const SendEmailRequest = ({}: SendEmailRequestProps) => {
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
      if (!formData[key]) {
        tempErrors[key] = [requiredFieldError];
      }
    });
    setErrors(tempErrors);
    return !Object.values(tempErrors).every((error) => !error);
  };

  const invokeSendEmail = () => {
    if (validate()) {
      // Submit the form
    }
  };

  return (
    <Card className="large-section">
      <Column>
        <Header className="title-2" text="Option 2: Send an Email Request" />
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
          onSelectCallback={() => {}}
          filterItems={[
            {
              type: 'dropdown',
              label: 'Member Name',
              value: [
                {
                  label: 'Chris Hall',
                  value: '1',
                  id: '1',
                },
                {
                  label: 'Forest Hall',
                  value: '2',
                  id: '2',
                },
              ],
              selectedValue: { label: 'Chris Hall', value: '1', id: '1' },
            },
          ]}
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
          callback={() => invokeSendEmail()}
          label="Submit Request"
        ></Button>
      </Column>
    </Card>
  );
};
