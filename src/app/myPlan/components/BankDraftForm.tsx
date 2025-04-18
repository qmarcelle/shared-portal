'use client';
import { Button } from '@/components/foundation/Button';
import { CalendarField } from '@/components/foundation/CalendarField';
import { Card } from '@/components/foundation/Card';
import { Checkbox } from '@/components/foundation/Checkbox';
import { Column } from '@/components/foundation/Column';
import { Radio } from '@/components/foundation/Radio';
import { RichText } from '@/components/foundation/RichText';
import { Spacer } from '@/components/foundation/Spacer';
import { TextBox } from '@/components/foundation/TextBox';
import { TextField } from '@/components/foundation/TextField';
import { IComponent } from '@/components/IComponent';
import { useState } from 'react';

export const BankDraftForm = ({ className }: IComponent) => {
  const [accountType, setAccountType] = useState<'checking' | 'savings'>(
    'checking',
  );
  const [authorityAcknowledged, setAuthorityAcknowledged] = useState(false);

  return (
    <Card className={className}>
      <Column>
        <h2 className="title-2">Bank Draft Form</h2>
        <Spacer size={16} />
        <TextBox
          className="body-1"
          text="Update the bank draft details for your form in the plan below."
        />
        <Spacer size={32} />
        <h2 className="title-3">Member Information</h2>
        <section>
          <Spacer size={24} />
          <TextField label="Member Name" />
          <Spacer size={24} />
          <TextField label="Daytime Phone Number" />
          <Spacer size={24} />
          <TextField label="Member ID number" />
          <Spacer size={24} />
          <TextField label="Member Street Address" />
          <Spacer size={24} />
          <TextField label="City" />
          <Spacer size={24} />
          <TextField label="State" />
          <Spacer size={24} />
          <TextField label="ZIP Code" />
          <Spacer size={24} />
        </section>
        <Spacer size={24} />
        <h2 className="title-3">Bank Information</h2>
        <section>
          <Spacer size={24} />
          <TextField label="Name of the Bank" />
          <Spacer size={24} />
          <TextField label="City" />
          <Spacer size={24} />
          <TextField label="State" />
          <Spacer size={24} />
          <TextField label="ZIP Code" />
          <Spacer size={24} />
          <TextField label="Name of Bank Account" />
          <Spacer size={8} />
          <Column>
            <TextBox
              type="body-1"
              className="mt-4 mb-2"
              text="Type of Bank Account:"
            />
            <Column className="body-1">
              <ul className="flex flex-col gap-2 pl-2 pt-1">
                <Radio
                  key="Checking"
                  label="Checking"
                  selected={accountType === 'checking'}
                  callback={() => {
                    setAccountType('checking');
                  }}
                />
                <Radio
                  key="savings"
                  label="Savings"
                  selected={accountType === 'savings'}
                  callback={() => {
                    setAccountType('savings');
                  }}
                />
              </ul>
            </Column>
          </Column>
          <Spacer size={24} />
          <TextField label="Bank Routing Number" />
          <Spacer size={24} />
          <TextField label="Confirm Bank Routing Number" />
          <Spacer size={24} />
          <TextField label="Bank Account Number" />
          <Spacer size={24} />
          <TextField label="Confirm Bank Account Number" />
          <Spacer size={24} />
          <Checkbox
            label=""
            className={'pl-0'}
            checked={authorityAcknowledged}
            onChange={(newValue) => setAuthorityAcknowledged(newValue)}
            body={
              <RichText
                spans={[
                  <span key="1">
                    By checking this box, I acknowledge that I have the
                    authority to allow access to this account on behalf of the
                    account holder.{' '}
                  </span>,
                  <span key="2" className="link font-bold">
                    <a>View Terms & Conditions</a>
                  </span>,
                ]}
              />
            }
          />
          <Spacer size={8} />
          <CalendarField label="Today's Date" isSuffixNeeded={true} />
          <Spacer size={8} />
          <Button label="Submit Form" />
        </section>
      </Column>
    </Card>
  );
};
