import { InitModalSlide } from '@/components/composite/InitModalSlide';
import { InputModalSlide } from '@/components/composite/InputModalSlide';
import { SuccessSlide } from '@/components/composite/SuccessSlide';
import {
  ModalChildProps,
  useAppModalStore,
} from '@/components/foundation/AppModal';
import { Column } from '@/components/foundation/Column';
import { Radio } from '@/components/foundation/Radio';
import { Spacer } from '@/components/foundation/Spacer';
import { TextBox } from '@/components/foundation/TextBox';
import { useRef, useState } from 'react';

import { MemberData } from '@/actions/loggedUserInfo';
import { AddMemberDetails } from '@/models/add_member_details';
import { createOtherInsurance } from '../actions/createOtherInsurance';
import AddMemberPlan from '../components/AddMemberPlan';
import OtherHealthInsurancePlan from '../components/OtherHealthInsurancePlan';
import SelectMemberPlan from '../components/SelectMemberPlan';
import { OtherHealthInsuranceDetails } from '../models/api/otherhealthinsurance_details';

export type OtherHealthInsuranceProps = {
  memberDetails: AddMemberDetails[];
  membersData: MemberData[];
  selectedName: string;
};

export const OtherHealthInsurance = ({
  changePage,
  pageIndex,
  memberDetails,
  membersData,
  selectedName,
}: ModalChildProps & OtherHealthInsuranceProps) => {
  const [selectedData, setSelectedData] = useState(false);
  const [selectedCheckbox, setSelectedCheckbox] = useState<string[] | null>([]);
  const checkCountRef = useRef<number>(0);
  const [checkboxState, setCheckboxState] = useState({
    medicalPlan: false,
    dentalPlan: false,
    medicarePlan: false,
  });
  const [isAnyChecked, setIsAnyChecked] = useState(false);
  const [selectedOption, setSelectedOption] = useState<'all' | 'selected'>(
    'selected',
  );
  const [selectedCheckboxes, setSelectedCheckboxes] = useState<string[]>([
    selectedName,
  ]);

  const [companyName, setCompanyName] = useState('');
  const [policyNumber, setPolicyNumber] = useState('');
  const [companyNumber, setCompanyNumber] = useState('');
  const [policyEffectiveDate, setPolicyEffectiveDate] = useState('');
  const [policyEndDate, setPolicyEndDate] = useState('');
  const [policyFirstName, setPolicyFirstName] = useState('');
  const [policyLastName, setPolicyLastName] = useState('');
  const [holderDOB, setHolderDOB] = useState('');

  const handleCheckboxChange = (checkboxValue: string[]) => {
    const newState = { ...checkboxState };
    // Toggle checkbox state
    if (checkboxValue.includes('medicarePlan')) {
      newState.medicarePlan = !newState.medicarePlan;
      if (newState.medicarePlan) {
        newState.medicalPlan = false;
        newState.dentalPlan = false;
      }
    } else if (checkboxValue.includes('medicalPlan')) {
      newState.medicalPlan = !newState.medicalPlan;
      if (newState.medicalPlan) {
        newState.medicarePlan = false;
      }
    } else if (checkboxValue.includes('dentalPlan')) {
      newState.dentalPlan = !newState.dentalPlan;
      if (newState.dentalPlan) {
        newState.medicarePlan = false;
      }
    }

    // Update checkbox states
    setCheckboxState(newState);

    // Set the selected checkbox value
    setSelectedCheckbox(
      newState.medicarePlan
        ? ['medicarePlan']
        : newState.medicalPlan
          ? ['medicalPlan']
          : newState.dentalPlan
            ? ['dentalPlan']
            : null,
    );

    // Check if any checkbox is selected
    setIsAnyChecked(
      newState.medicarePlan || newState.medicalPlan || newState.dentalPlan,
    );
  };

  const handleNextCall = () => {
    checkCountRef.current += 1;
    if (
      checkboxState.medicalPlan &&
      checkboxState.dentalPlan &&
      checkCountRef.current <= 2
    ) {
      if (checkCountRef.current == 1) {
        otherInsuranceData.medicalBean!.otherInsuranceCompanyCode =
          companyNumber;
        otherInsuranceData.medicalBean!.otherInsuranceCompanyName = companyName;
        otherInsuranceData.medicalBean!.policyIdNum = policyNumber;
        otherInsuranceData.medicalBean!.policyEffectiveDate =
          policyEffectiveDate;
        otherInsuranceData.medicalBean!.policyCancelDate = policyEndDate;
        otherInsuranceData.medicalBean!.policyHolderFirstName = policyFirstName;
        otherInsuranceData.medicalBean!.policyHolderLastName = policyLastName;
        otherInsuranceData.memberName = policyFirstName + ' ' + policyLastName;
        otherInsuranceData.dob = holderDOB;
        if (selectedOption == 'all') {
          otherInsuranceData.forAllDependents = true;
          otherInsuranceData.noOtherInsurance = false;
          createOtherInsurance(otherInsuranceData);
        } else if (selectedOption == 'selected') {
          otherInsuranceData.forAllDependents = false;
          otherInsuranceData.noOtherInsurance = false;
          createOtherInsurance(otherInsuranceData, selectedCheckboxes);
        }
      }
      if (checkCountRef.current == 2) {
        otherInsuranceData.dentalBean!.otherInsuranceCompanyCode =
          companyNumber;
        otherInsuranceData.dentalBean!.otherInsuranceCompanyName = companyName;
        otherInsuranceData.dentalBean!.policyIdNum = policyNumber;
        otherInsuranceData.dentalBean!.policyEffectiveDate =
          policyEffectiveDate;
        otherInsuranceData.dentalBean!.policyCancelDate = policyEndDate;
        otherInsuranceData.dentalBean!.policyHolderFirstName = policyFirstName;
        otherInsuranceData.dentalBean!.policyHolderLastName = policyLastName;
        otherInsuranceData.memberName = policyFirstName + ' ' + policyLastName;
        otherInsuranceData.dob = holderDOB;
        if (selectedOption == 'all') {
          otherInsuranceData.forAllDependents = true;
          otherInsuranceData.noOtherInsurance = false;
          createOtherInsurance(otherInsuranceData);
        } else if (selectedOption == 'selected') {
          otherInsuranceData.forAllDependents = false;
          otherInsuranceData.noOtherInsurance = false;
          createOtherInsurance(otherInsuranceData, selectedCheckboxes);
        }
      }
      setSelectedCheckbox(['dentalPlan']);
      changePage?.(2, true);
    } else {
      submitCOBMemberData();
      if (selectedOption == 'all') {
        otherInsuranceData.forAllDependents = true;
        otherInsuranceData.noOtherInsurance = false;
        createOtherInsurance(otherInsuranceData);
      } else if (selectedOption == 'selected') {
        otherInsuranceData.forAllDependents = false;
        otherInsuranceData.noOtherInsurance = false;
        createOtherInsurance(otherInsuranceData, selectedCheckboxes);
      }
      changePage?.(4, true);
    }
  };

  const noOtherInsuranceData: OtherHealthInsuranceDetails = {};

  const submitCOBData = () => {
    if (selectedOption == 'all') {
      noOtherInsuranceData.forAllDependents = true;
      noOtherInsuranceData.noOtherInsurance = true;
      createOtherInsurance(noOtherInsuranceData);
    } else if (selectedOption == 'selected') {
      noOtherInsuranceData.forAllDependents = false;
      noOtherInsuranceData.noOtherInsurance = true;
      createOtherInsurance(noOtherInsuranceData, selectedCheckboxes);
    }
    changePage?.(2, true);
  };

  const otherInsuranceData: OtherHealthInsuranceDetails = {};

  const submitCOBMemberData = () => {
    if (checkboxState.medicalPlan && !checkboxState.dentalPlan) {
      otherInsuranceData.medicalBean!.otherInsuranceCompanyCode = companyNumber;
      otherInsuranceData.medicalBean!.otherInsuranceCompanyName = companyName;
      otherInsuranceData.medicalBean!.policyIdNum = policyNumber;
      otherInsuranceData.medicalBean!.policyEffectiveDate = policyEffectiveDate;
      otherInsuranceData.medicalBean!.policyCancelDate = policyEndDate;
      otherInsuranceData.medicalBean!.policyHolderFirstName = policyFirstName;
      otherInsuranceData.medicalBean!.policyHolderLastName = policyLastName;
      otherInsuranceData.memberName = policyFirstName + ' ' + policyLastName;
      otherInsuranceData.dob = holderDOB;
    } else if (!checkboxState.medicalPlan && checkboxState.dentalPlan) {
      otherInsuranceData.dentalBean!.otherInsuranceCompanyCode = companyNumber;
      otherInsuranceData.dentalBean!.otherInsuranceCompanyName = companyName;
      otherInsuranceData.dentalBean!.policyIdNum = policyNumber;
      otherInsuranceData.dentalBean!.policyEffectiveDate = policyEffectiveDate;
      otherInsuranceData.dentalBean!.policyCancelDate = policyEndDate;
      otherInsuranceData.dentalBean!.policyHolderFirstName = policyFirstName;
      otherInsuranceData.dentalBean!.policyHolderLastName = policyLastName;
      otherInsuranceData.memberName = policyFirstName + ' ' + policyLastName;
      otherInsuranceData.dob = holderDOB;
    } else if (checkboxState.medicarePlan) {
      otherInsuranceData.medicareBean!.otherInsuranceCompanyCode =
        companyNumber;
      otherInsuranceData.medicareBean!.otherInsuranceCompanyName = companyName;
      otherInsuranceData.medicareBean!.policyIdNum = policyNumber;
      otherInsuranceData.medicareBean!.policyEffectiveDate =
        policyEffectiveDate;
      otherInsuranceData.medicareBean!.policyCancelDate = policyEndDate;
      otherInsuranceData.medicareBean!.policyHolderFirstName = policyFirstName;
      otherInsuranceData.medicareBean!.policyHolderLastName = policyLastName;
      otherInsuranceData.memberName = policyFirstName + ' ' + policyLastName;
      otherInsuranceData.dob = holderDOB;
    }
  };

  function handleClick() {
    setSelectedData(true);
    setSelectedData(!selectedData);
  }

  const { dismissModal } = useAppModalStore();

  const pages = [
    <InitModalSlide
      key="first"
      label="Other Health Insurance"
      subLabel={
        <Column>
          <TextBox
            className="text-center"
            text="Does this plan member have other insurance?"
          />
          <Spacer size={24} />

          <Column>
            <Radio selected={!selectedData} callback={handleClick} label="No" />
            <Spacer size={8} />
            <Radio label="Yes" selected={selectedData} callback={handleClick} />
          </Column>
        </Column>
      }
      changeAuthButton={undefined}
      buttonLabel="Next"
      nextCallback={() => changePage?.(1, true)}
      cancelCallback={() => dismissModal()}
    />,
    <InputModalSlide
      key="second"
      label="Other Health Insurance"
      subLabel=""
      actionArea={
        <OtherHealthInsurancePlan
          checkboxState={checkboxState}
          onCheckboxChange={handleCheckboxChange}
          selectedData={selectedData}
          selectedOption={selectedOption}
          setSelectedOption={setSelectedOption}
          selectedCheckboxes={selectedCheckboxes}
          setSelectedCheckboxes={setSelectedCheckboxes}
          membersData={membersData}
        />
      }
      buttonLabel={selectedData ? 'Next' : 'Save Answer'}
      nextCallback={
        selectedData
          ? isAnyChecked
            ? () => submitCOBData()
            : undefined
          : () => changePage?.(4, true)
      }
      cancelCallback={() => dismissModal()}
    />,
    <InputModalSlide
      key="third"
      label=""
      subLabel=""
      actionArea={
        <AddMemberPlan
          selectedCheckbox={selectedCheckbox}
          memberDetails={memberDetails}
          selectedCompanyName={companyName}
          onCompanyNameChange={setCompanyName}
          selectedCompanyNumber={companyNumber}
          onCompanyNumberChange={setCompanyNumber}
          selectedPolicyEffectiveDate={policyEffectiveDate}
          onEffectiveDateChange={setPolicyEffectiveDate}
          selectedPolicyEndDate={policyEndDate}
          onEndDateChange={setPolicyEndDate}
          selectedPolicyNumber={policyNumber}
          onPolicyNumberChange={setPolicyNumber}
          selectedPolicyFirstName={policyFirstName}
          onPolicyFirstNameChange={setPolicyFirstName}
          selectedPolicyLastName={policyLastName}
          onPolicyLastNameChange={setPolicyLastName}
          selectedHolderDOB={holderDOB}
          onPolicyDOBeChange={setHolderDOB}
        />
      }
      buttonLabel="Next"
      nextCallback={() => changePage?.(3, true)}
      cancelCallback={() => dismissModal()}
    />,
    <InputModalSlide
      key="Fourth"
      label=""
      subLabel=""
      actionArea={
        <SelectMemberPlan
          selectedCheckbox={selectedCheckbox}
          selectedOption={selectedOption}
          setSelectedOption={setSelectedOption}
          selectedCheckboxes={selectedCheckboxes}
          setSelectedCheckboxes={setSelectedCheckboxes}
          otherInsuranceCompanyName={companyName}
          otherInsurancePolicyNumber={policyNumber}
          otherInsuranceEffectiveDate={policyEffectiveDate}
        />
      }
      buttonLabel="Save Answer"
      nextCallback={handleNextCall}
      cancelCallback={() => dismissModal()}
    />,
    <SuccessSlide
      key="Fifth"
      label="Other Insurance Updated"
      body={
        <Column className="items-center">
          <TextBox
            className="text-center w-[125%]"
            text="Thanks for confirming your plan information. We'll check in with you next year. If anything changes before then, you can make updates anytime."
          />
          <Spacer size={16} />
        </Column>
      }
      doneCallBack={() => dismissModal()}
    />,
  ];

  return pages[pageIndex!];
};
