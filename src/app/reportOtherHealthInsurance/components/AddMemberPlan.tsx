'use client';
import { CalendarField } from '@/components/foundation/CalendarField';
import { Checkbox } from '@/components/foundation/Checkbox';
import { Column } from '@/components/foundation/Column';
import { Header } from '@/components/foundation/Header';
import { Radio } from '@/components/foundation/Radio';
import { Row } from '@/components/foundation/Row';
import { Spacer } from '@/components/foundation/Spacer';
import { TextBox } from '@/components/foundation/TextBox';
import { TextField } from '@/components/foundation/TextField';
import { AddMemberDetails } from '@/models/add_member_details';
import alertErrorSvg from '@/public/assets/alert_error_red.svg';
import Image from 'next/image';
import { useState } from 'react';

interface AddMemberPlanProps {
  selectedCheckbox: string[] | null;
  memberDetails: AddMemberDetails[];
  selectedCompanyName: string;
  selectedCompanyNumber: string;
  selectedPolicyEffectiveDate: string;
  selectedPolicyEndDate: string;
  selectedPolicyNumber: string;
  selectedPolicyFirstName: string;
  selectedPolicyLastName: string;
  selectedHolderDOB: string;
  onCompanyNameChange: React.Dispatch<React.SetStateAction<string>>;
  onCompanyNumberChange: React.Dispatch<React.SetStateAction<string>>;
  onEffectiveDateChange: React.Dispatch<React.SetStateAction<string>>;
  onEndDateChange: React.Dispatch<React.SetStateAction<string>>;
  onPolicyNumberChange: React.Dispatch<React.SetStateAction<string>>;
  onPolicyFirstNameChange: React.Dispatch<React.SetStateAction<string>>;
  onPolicyLastNameChange: React.Dispatch<React.SetStateAction<string>>;
  onPolicyDOBeChange: React.Dispatch<React.SetStateAction<string>>;
}
const AddMemberPlan: React.FC<AddMemberPlanProps> = ({
  memberDetails,
  selectedCheckbox,
  onCompanyNameChange,
  onCompanyNumberChange,
  onEffectiveDateChange,
  onEndDateChange,
  onPolicyNumberChange,
  onPolicyFirstNameChange,
  onPolicyLastNameChange,
  onPolicyDOBeChange,
}) => {
  const [selectedMemberData, setSelectedMemberData] = useState(false);
  const [error, setError] = useState('');
  const [partA, setPartA] = useState(false);
  const [partB, setPartB] = useState(false);
  const [partD, setPartD] = useState(false);
  const [isOver65, setIsOver65] = useState(false);

  function handleClick() {
    setSelectedMemberData(!selectedMemberData);
  }

  const handleCompanyChange = (companyName: string) => {
    onCompanyNameChange(companyName);
  };

  const handlePolicyChange = (policyNumber: string) => {
    onPolicyNumberChange(policyNumber);
  };

  const handleCompanyNumber = (companyNumber: string) => {
    onCompanyNumberChange(companyNumber);
  };

  const handlePolicyEffectiveDate = (policyEffectiveDate: string) => {
    onEffectiveDateChange(policyEffectiveDate);
  };

  const handleFirstNameChange = (policyFirstName: string) => {
    onPolicyFirstNameChange(policyFirstName);
  };

  const handleLastNameChange = (policyLastName: string) => {
    onPolicyLastNameChange(policyLastName);
  };

  const handleDOBChange = (holderDOB: string) => {
    onPolicyDOBeChange(holderDOB);
  };

  const handlePolicyEndDate = (policyEndDate: string) => {
    onEndDateChange(policyEndDate);
  };

  const handleDateSelection = (enterDOB: string) => {
    if (!enterDOB) {
      setError('');
      return;
    }

    if (enterDOB && memberDetails[0].dob) {
      if (enterDOB === memberDetails[0].dob) {
        handleDOBChange(enterDOB);
        setError('');
      } else {
        setError(
          'Your date of birth does not match the information in our system. Please update and try again.',
        );
      }
    }
  };

  return (
    <main>
      <Column className="items-center">
        {selectedCheckbox && (
          <Header
            type="title-2"
            text={
              selectedCheckbox.includes('medicarePlan')
                ? 'Add Medicare Plan'
                : selectedCheckbox.includes('medicalPlan')
                  ? 'Add Medical Plan'
                  : selectedCheckbox.includes('dentalPlan')
                    ? 'Add Dental Plan'
                    : ''
            }
          />
        )}

        <Spacer size={32} />
        <TextBox
          className="body-1 w-[130%] text-center"
          text="Tell us about your other insurance. All fields are required unless noted as optional."
        />
        <Spacer size={32} />
      </Column>
      <Column className="items-left">
        <TextBox className="title-3 !items-left" text="Insurance Company" />
        <Spacer size={24} />
        <TextField label="Company Name" valueCallback={handleCompanyChange} />
        <Spacer size={24} />
        <TextField
          label="Policy Identification Number"
          valueCallback={handlePolicyChange}
        />
        <Spacer size={24} />
        <TextField
          label="Company Phone Number"
          valueCallback={handleCompanyNumber}
        />
        <Spacer size={24} />
        <TextBox
          className="body-1"
          text="Is this coverage part of a court order? (if applicable, optional)"
        />
        <Spacer size={24} />
        <Radio
          label="Yes"
          selected={selectedMemberData}
          callback={handleClick}
        />
        <Radio
          selected={!selectedMemberData}
          callback={handleClick}
          label="No"
        />
        <Spacer size={8} />
        {selectedCheckbox && selectedCheckbox.includes('medicarePlan') && (
          <Column>
            <TextBox
              className="body-1"
              text="Policy type (check all that apply):"
            />
            <Spacer size={16} />

            <Checkbox
              label={'Medicare Part A'}
              classProps="!p-0"
              checked={partA}
              onChange={(newValue) => setPartA(newValue)}
              id="medicare-part-a"
            ></Checkbox>
            <Spacer size={8} />
            <Checkbox
              label={'Medicare Part B'}
              checked={partB}
              onChange={(newValue) => setPartB(newValue)}
              id="medicare-part-b"
            ></Checkbox>
            <Spacer size={8} />
            <Checkbox
              label={'Medicare Part D'}
              checked={partD}
              onChange={(newValue) => setPartD(newValue)}
              id="medicare-part-d"
            ></Checkbox>
          </Column>
        )}
        <Spacer size={16} />
        <CalendarField
          isSuffixNeeded={true}
          label={'Policy Effective Date (MM/DD/YYYY)'}
          valueCallback={handlePolicyEffectiveDate}
        />
        <Spacer size={16} />
        <CalendarField
          isSuffixNeeded={true}
          label={'Policy End Date (MM/DD/YYYY) (optional)'}
          valueCallback={handlePolicyEndDate}
        />
        <Spacer size={16} />
        <TextBox className="title-3" text="Policyholder Information" />
        <Spacer size={24} />
        <TextField
          label="Policyholder First Name"
          valueCallback={handleFirstNameChange}
        />
        <Spacer size={8} />
        <TextField
          label="Policyholder Last Name"
          valueCallback={handleLastNameChange}
        />
        <Spacer size={16} />
        <CalendarField
          isSuffixNeeded={true}
          label={'Policyholder Birth Date (MM/DD/YYYY)'}
          valueCallback={(val) => {
            handleDateSelection(val);
          }}
          maxDate={new Date()}
          maxDateErrMsg="Invalid birth date."
        />
        <Spacer size={16} />
        {selectedCheckbox && selectedCheckbox.includes('medicarePlan') && (
          <Column>
            <TextBox
              className="body-1"
              text="Is this member eligible for Medicare due to disability?"
            />
            <Spacer size={16} />
            <Radio
              selected={selectedMemberData}
              callback={handleClick}
              label="Yes"
            />
            <Spacer size={8} />
            <Radio
              label="No"
              selected={!selectedMemberData}
              callback={handleClick}
            />
            <Spacer size={16} />
            <TextBox
              className="body-1"
              text="Is this member eligible for Medicare due to End Stage Renal Disease?"
            />
            <Spacer size={16} />
            <Radio
              selected={selectedMemberData}
              callback={handleClick}
              label="Yes"
            />
            <Spacer size={8} />
            <Radio
              label="No"
              selected={!selectedMemberData}
              callback={handleClick}
            />
            <Spacer size={16} />
            <TextBox className="body-1" text="Is this member still employed?" />
            <Spacer size={16} />
            <Radio
              selected={selectedMemberData}
              callback={handleClick}
              label="Yes"
            />
            <Spacer size={8} />
            <Radio
              label="No"
              selected={!selectedMemberData}
              callback={handleClick}
            />
            <Spacer size={8} />
            <TextBox
              className="body-1"
              text="Check the box if this statement applies:"
            />
            <Spacer size={8} />
            <Checkbox
              label={'This member is over 65.'}
              checked={isOver65}
              onChange={(newValue) => setIsOver65(newValue)}
            ></Checkbox>
            <Spacer size={32} />
            {error && (
              <div className="text-red-500 mt-1">
                <Row>
                  <Image
                    src={alertErrorSvg}
                    className="icon mt-1"
                    alt="alert"
                  />
                  <TextBox className="body-1 pt-1.5 ml-2" text={error} />
                </Row>
                <Spacer size={32} />
              </div>
            )}
          </Column>
        )}
      </Column>
    </main>
  );
};

export default AddMemberPlan;
