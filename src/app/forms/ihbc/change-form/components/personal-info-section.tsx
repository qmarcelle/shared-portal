'use client';

import { AlertBar } from '@/components/foundation/AlertBar';
import { Column } from '@/components/foundation/Column';
import { Dropdown } from '@/components/foundation/Dropdown';
import { Radio } from '@/components/foundation/Radio';
import { Row } from '@/components/foundation/Row';
import { Section } from '@/components/foundation/Section';
import { TextField } from '@/components/foundation/TextField';
import { Title } from '@/components/foundation/Title';
import { useState } from 'react';

interface PersonalInfoData {
  firstName: string;
  lastName: string;
  relationship: string;
  gender: string;
  email: string;
  phone: string;
}

interface PersonalInfoSectionProps {
  formData: PersonalInfoData;
  onChange: (field: keyof PersonalInfoData, value: string) => void;
  onValidate: () => void;
}

const relationshipOptions = [
  { value: 'self', label: 'Self' },
  { value: 'spouse', label: 'Spouse' },
  { value: 'dependent', label: 'Dependent' },
];

const genderOptions = [
  { value: 'male', label: 'Male' },
  { value: 'female', label: 'Female' },
  { value: 'other', label: 'Other' },
];

export function PersonalInfoSection({
  formData,
  onChange,
  onValidate,
}: PersonalInfoSectionProps) {
  const [errors, setErrors] = useState<string[]>([]);

  const validateField = (field: keyof PersonalInfoData, value: string) => {
    const newErrors = [...errors];
    const fieldIndex = newErrors.findIndex((err) => err.includes(field));

    switch (field) {
      case 'email':
        if (!value.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
          if (fieldIndex === -1)
            newErrors.push('Please enter a valid email address');
        } else if (fieldIndex !== -1) {
          newErrors.splice(fieldIndex, 1);
        }
        break;
      case 'phone':
        if (!value.match(/^\d{10}$/)) {
          if (fieldIndex === -1)
            newErrors.push('Please enter a valid 10-digit phone number');
        } else if (fieldIndex !== -1) {
          newErrors.splice(fieldIndex, 1);
        }
        break;
      default:
        if (!value) {
          if (fieldIndex === -1) newErrors.push(`${field} is required`);
        } else if (fieldIndex !== -1) {
          newErrors.splice(fieldIndex, 1);
        }
    }

    setErrors(newErrors);
    onValidate();
  };

  const handleChange = (field: keyof PersonalInfoData, value: string) => {
    onChange(field, value);
    validateField(field, value);
  };

  return (
    <Section>
      <div className="w-full">
        <Title text="Personal Information" />

        {errors.length > 0 && <AlertBar alerts={errors} />}

        <Row>
          <Column>
            <TextField
              label="First Name"
              value={formData.firstName}
              valueCallback={(value) => handleChange('firstName', value)}
              type="text"
            />
          </Column>
          <Column>
            <TextField
              label="Last Name"
              value={formData.lastName}
              valueCallback={(value) => handleChange('lastName', value)}
              type="text"
            />
          </Column>
        </Row>

        <Row>
          <Column>
            <TextField
              label="Email"
              value={formData.email}
              valueCallback={(value) => handleChange('email', value)}
              type="email"
            />
          </Column>
          <Column>
            <TextField
              label="Phone"
              value={formData.phone}
              valueCallback={(value) => handleChange('phone', value)}
              type="text"
            />
          </Column>
        </Row>

        <Row>
          <Column>
            <Dropdown
              items={relationshipOptions}
              initialSelectedValue={formData.relationship}
              onSelectCallback={(value) => handleChange('relationship', value)}
            />
          </Column>
          <Column>
            {genderOptions.map((option) => (
              <Radio
                key={option.value}
                selected={formData.gender === option.value}
                label={option.label}
                value={option.value}
                callback={(value: string) => handleChange('gender', value)}
              />
            ))}
          </Column>
        </Row>
      </div>
    </Section>
  );
}
