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

import { AddMemberDetails } from '@/models/add_member_details';
import AddMemberPlan from '@/components/AddMemberPlan';
import OtherHealthInsurancePlan from '@/components/OtherHealthInsurancePlan';
import SelectMemberPlan from '@/components/SelectMemberPlan';
export type OtherHealthInsuranceProps = {
  memberDetails: AddMemberDetails[];
};
export const OtherHealthInsurance = ({
  changePage,
  pageIndex,
  memberDetails,
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
      checkCountRef.current === 1
    ) {
      changePage?.(2, true);
      setSelectedCheckbox(['dentalPlan']);
    } else {
      changePage?.(4, true);
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
        />
      }
      buttonLabel={selectedData ? 'Next' : 'Save Answer'}
      nextCallback={
        selectedData
          ? isAnyChecked
            ? () => changePage?.(2, true)
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
      actionArea={<SelectMemberPlan selectedCheckbox={selectedCheckbox} />}
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
