import FullAndBasicAccessOption from '@/app/personalRepresentativeAccess/components/FullAndBasicAccessOption';
import { InputModalSlide } from '@/components/composite/InputModalSlide';
import { SuccessSlide } from '@/components/composite/SuccessSlide';
import {
  ModalChildProps,
  useAppModalStore,
} from '@/components/foundation/AppModal';
import { Checkbox } from '@/components/foundation/Checkbox';
import { Column } from '@/components/foundation/Column';
import { RichText } from '@/components/foundation/RichText';
import { Spacer } from '@/components/foundation/Spacer';
import { TextBox } from '@/components/foundation/TextBox';
import { TextField } from '@/components/foundation/TextField';
import { capitalizeName } from '@/utils/capitalizeName';
import {
  formatDate,
  formatPhoneNumber,
  isValidEmailAddress,
  isValidMobileNumber,
  validateLength,
} from '@/utils/inputValidator';
import { useState } from 'react';
import {
  SelectedAccountDetails,
  ShareOutsideMemberPlanDetails,
} from '../models/sharemyinfo_details';

export const AddUserShareOutsideMyPlan = ({
  changePage,
  pageIndex,
}: ModalChildProps) => {
  const { dismissModal } = useAppModalStore();
  const [auFirstName, setAUFirstName] = useState('');
  const [auLastName, setAULastName] = useState('');
  const [auDOB, setAUDOB] = useState('');
  const [auDetailsCheckBox, setAUDetailsCheckBox] = useState(false);
  const [auAddressLine1, setAUAddressLine1] = useState('');
  const [auAddressLine2, setAUAddressLine2] = useState('');
  const [auCity, setAUCity] = useState('');
  const [auState, setAUState] = useState('');
  const [auZipCode, setAUZipCode] = useState('');
  const [auEmailAddress, setAUEmailAddress] = useState('');
  const [auConfirmEmailAddress, setAUConfirmEmailAddress] = useState('');
  const [auPhoneNumber, setAUPhoneNumber] = useState('');
  const accountList: SelectedAccountDetails[] = [];
  const [auAccountDetailsCheckBox, setAUAccountDetailsCheckBox] =
    useState(accountList);
  const [auSelectedAccountEnabled, setAUSelectedAccountEnabled] =
    useState(false);
  const [auAgreementCheckBox, setAUAgreementCheckBox] = useState(false);

  const samplePlanDetails: ShareOutsideMemberPlanDetails[] = [
    {
      memberName: 'Chris Hall',
      planDetails: 'Vision',
      subscriberId: 'ABC12345',
    },
    {
      memberName: 'Chris Hall',
      planDetails: 'Vision/Medical/Dental',
      subscriberId: 'ABC67890',
    },
  ];
  samplePlanDetails.map((item) => {
    accountList.push({
      memberName: item.memberName,
      planDetails: item.planDetails,
      subscriberId: item.subscriberId,
      enabled: false,
    });
  });

  let isBackSpacePressed: boolean = false;
  const keyDownCallBackDOB = (keyCode: string) => {
    isBackSpacePressed = keyCode == 'Backspace' || keyCode == '/';
  };
  const handleChange = (val: string) => {
    let formattedDate = val;
    if (!isBackSpacePressed) {
      formattedDate = formatDate(val);
    }
    setAUDOB(formattedDate);
  };

  const handleEmailAddress = (value: string) => {
    setAUEmailAddress(value);
    const isValidEmail = isValidEmailAddress(value);
    const isValidLength = validateLength(value);
    if (!isValidEmail || !isValidLength) {
    }
  };

  const handleConfirmEmailChange = (val: string) => {
    setAUConfirmEmailAddress(val);
    if (val !== auEmailAddress) {
      //setError('The email addresses must match. Please check and try again.');
    }
  };

  let isBackSpacePressedForPhoneNo: boolean = false;
  const keyDownCallBackPhoneNo = (keyCode: string) => {
    isBackSpacePressedForPhoneNo = keyCode == 'Backspace';
  };
  const handlePhoneNumber = (phoneNumber: string) => {
    let value = phoneNumber;
    if (!isBackSpacePressedForPhoneNo) {
      value = formatPhoneNumber(phoneNumber);
    }
    setAUPhoneNumber(value);
    if (!isValidMobileNumber(value) && !(value.length == 0)) {
    }
  };

  function selectionPlanDetails(subscriberId: string, isChecked: boolean) {
    setAUSelectedAccountEnabled(false);
    const selectedPlan = auAccountDetailsCheckBox.find(
      (item) => item.subscriberId === subscriberId,
    );
    if (selectedPlan) selectedPlan.enabled = isChecked;
    setAUAccountDetailsCheckBox([...auAccountDetailsCheckBox]);
    auAccountDetailsCheckBox.map((item) => {
      if (item.enabled) setAUSelectedAccountEnabled(true);
    });
  }

  // function updateAgreementSelection(val?: boolean) {
  //   setAUAgreementCheckBox(Boolean(val));
  // }

  const pages = [
    <InputModalSlide
      key={0}
      label="Add an Authorized User"
      subLabel="We'll send an email inviting an authorized user to register. Once they've completed registration, they'll be able to see a read-only version of your account."
      buttonLabel="Next"
      actionArea={
        <Column>
          <TextField
            label="First Name"
            value={auFirstName}
            valueCallback={(val) => setAUFirstName(val)}
          />
          <Spacer size={16} />
          <TextField
            label="Last Name"
            value={auLastName}
            valueCallback={(val) => setAULastName(val)}
          />
          <Spacer size={16} />
          <TextField
            ariaLabel="Date of Birth (MM/DD/YYYY)"
            label="Date of Birth (MM/DD/YYYY)"
            valueCallback={(val) => handleChange(val)}
            onKeydownCallback={(val) => keyDownCallBackDOB(val)}
            value={auDOB}
            maxLength={10}
          ></TextField>
          <Spacer size={16} />
          <Checkbox
            label={
              'I certify that I have permission to share this person’s personal information for the purpose of sending this email invitation.'
            }
            checked={auDetailsCheckBox}
            onChange={(isChecked) => {
              setAUDetailsCheckBox(isChecked);
            }}
          />
          <Spacer size={24} />
        </Column>
      }
      cancelCallback={() => dismissModal()}
      nextCallback={auDetailsCheckBox ? () => changePage!(1, true) : undefined}
    />,
    <InputModalSlide
      key={1}
      label="Add an Authorized User"
      subLabel="Provide the authorized user’s mailing address."
      buttonLabel="Next"
      actionArea={
        <Column>
          <TextField
            label="Street Address 1"
            value={auAddressLine1}
            valueCallback={(val) => setAUAddressLine1(val)}
          />
          <Spacer size={16} />
          <TextField
            label="Street Address 2 (optional)"
            value={auAddressLine2}
            valueCallback={(val) => setAUAddressLine2(val)}
          />
          <Spacer size={16} />
          <TextField
            label="City"
            value={auCity}
            valueCallback={(val) => setAUCity(val)}
          />
          <Spacer size={16} />
          <TextField
            label="State"
            value={auState}
            valueCallback={(val) => setAUState(val)}
          />
          <Spacer size={16} />
          <TextField
            label="ZIP Code"
            value={auZipCode}
            valueCallback={(val) => setAUZipCode(val)}
          />
          <Spacer size={30} />
        </Column>
      }
      cancelCallback={() => dismissModal()}
      nextCallback={true ? () => changePage!(2, true) : undefined}
    />,
    <InputModalSlide
      key={2}
      label="Add an Authorized User"
      subLabel="Provide the authorized user’s email and phone number."
      buttonLabel="Next"
      actionArea={
        <Column>
          <Spacer size={24} />
          <TextField
            label="Their Email Address"
            value={auEmailAddress}
            valueCallback={(val) => handleEmailAddress(val)}
          />
          <Spacer size={24} />
          <TextField
            label="Confirm Their Email Address"
            value={auConfirmEmailAddress}
            valueCallback={(val) => handleConfirmEmailChange(val)}
          />
          <Spacer size={24} />
          <TextField
            label="Their Phone Number"
            value={auPhoneNumber}
            valueCallback={(val) => handlePhoneNumber(val)}
            onKeydownCallback={(val) => keyDownCallBackPhoneNo(val)}
          />
          <Spacer size={32} />
        </Column>
      }
      cancelCallback={() => dismissModal()}
      nextCallback={true ? () => changePage!(3, true) : undefined}
    />,
    <InputModalSlide
      key={3}
      label="Add an Authorized User"
      subLabel="Select which plans the authorized user will be able to view."
      buttonLabel="Next"
      actionArea={
        <Column>
          <TextBox text={'Select at least one account:'}></TextBox>
          <Spacer size={24} />
          {auAccountDetailsCheckBox.map((accountData, index) => (
            <Column key={index}>
              <Checkbox
                label=""
                body={
                  <RichText
                    spans={[
                      <span key={0} className="font-bold">
                        Active Account for {accountData.memberName}
                        <Spacer size={8} />
                      </span>,
                      <span key={1}>
                        {accountData.planDetails}
                        <Spacer size={8} />
                      </span>,
                      <span key={2}>Subscriber ID:</span>,
                      <span key={2} className="font-bold">
                        {' '}
                        {accountData.subscriberId}
                        <Spacer size={16} />
                      </span>,
                    ]}
                  />
                }
                checked={accountData.enabled}
                onChange={(isChecked) => {
                  selectionPlanDetails(accountData.subscriberId, isChecked);
                }}
              />
            </Column>
          ))}
          <Spacer size={16} />
        </Column>
      }
      cancelCallback={() => dismissModal()}
      nextCallback={
        auSelectedAccountEnabled ? () => changePage!(4, true) : undefined
      }
    />,
    <InputModalSlide
      key={4}
      label="Edit Level Of Access"
      subLabel=""
      actionArea={
        <FullAndBasicAccessOption
          isAUAccess={true}
          accessType={'full'}
          memberName={capitalizeName(auFirstName + ' ' + auLastName)}
          selectionCallBack={(val) => {
            setAUAgreementCheckBox(Boolean(val));
          }}
          isCheckBoxChecked={auAgreementCheckBox}
        />
      }
      buttonLabel="Save Permissions"
      nextCallback={
        auAgreementCheckBox ? () => changePage!(5, false) : undefined
      }
      cancelCallback={() => dismissModal()}
    />,
    <SuccessSlide
      key={5}
      label={'An Invitation to View Your Plan Information Has Been Sent'}
      body={
        <Column className="items-center ">
          <TextBox className="text-center" text="An email has been sent to:" />
          <Spacer size={16} />
          <TextBox
            className="text-center font-bold"
            text={capitalizeName(auFirstName + ' ' + auLastName)}
          />
          <Spacer size={16} />
          <TextBox
            className="text-center"
            text="They will have full access to your account information. You can remove their access at any time."
          />
        </Column>
      }
      doneCallBack={() => dismissModal()}
    />,
    // <ErrorDisplaySlide
    //   key={2}
    //   label="Try Again Later"
    //   body={
    //     <Column className="items-center">
    //       <TextBox
    //         className="text-center"
    //         text="We weren't able to complete this request at this time. Please try again later."
    //       />
    //     </Column>
    //   }
    //   doneCallBack={() => dismissModal()}
    // />,
  ];

  return pages[pageIndex!];
};
