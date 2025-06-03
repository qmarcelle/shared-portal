import { Button } from '@/components/foundation/Button';
import { Checkbox } from '@/components/foundation/Checkbox';
import { Column } from '@/components/foundation/Column';
import { RichText } from '@/components/foundation/RichText';
import { Row } from '@/components/foundation/Row';
import { TextBox } from '@/components/foundation/TextBox';
import { formatDateToLocale } from '@/utils/date_formatter';
import { useContext, useEffect, useState } from 'react';
import { useFormContext } from 'react-hook-form';
import { HighlightedHeader } from '../../components/HighlightedHeader';
import { ImpersonatingContext } from '../../providers/impersonatingProvider';
import { LoggedInMemberContext } from '../../providers/loggedInMemberProvider';
import { IHBCSchema } from '../../rules/schema';
import { useNavigationStore } from '../../stores/navigationStore';
import { useSubmitApplicationStore } from '../../stores/submitApplicationStore';

export const TnCSubmissionPage = () => {
  const {
    handleSubmit,
    formState: { isSubmitSuccessful },
    reset,
    getValues,
  } = useFormContext<IHBCSchema>();
  const loggedInMem = useContext(LoggedInMemberContext);
  const impersonating = useContext(ImpersonatingContext);
  const [goBackWard, goForward] = useNavigationStore((state) => [
    state.goBackWard,
    state.goForward,
  ]);
  const [attested, setAttested] = useState(false);
  const [submitApplication] = useSubmitApplicationStore((state) => [
    state.submitApplication,
  ]);

  async function initSubmit(data: IHBCSchema) {
    console.log('Submit called');
    await submitApplication(data);
  }

  useEffect(() => {
    if (isSubmitSuccessful) {
      reset();
      goForward();
    }
  }, [isSubmitSuccessful]);

  return (
    <form
      onSubmit={
        attested && !impersonating ? handleSubmit(initSubmit) : undefined
      }
    >
      <Column className="gap-2">
        <HighlightedHeader text="Terms & Conditions" />
        <TextBox text='Please review the following terms and conditions and select "I Agree" to continue.' />
        <TextBox className="font-bold" text="Electronic Signature Agreement" />
        <TextBox text="I consent to the use of electronic signatures with documents related to this application. An electronic signature is an electronic sound, symbol, or process attached to or logically associated with a record, and executed or adopted by a person, with the intent to sign the record." />
        <TextBox text="I understand that my electronic signature has the same effect as my written signature. I understand that I can withdraw my consent to the use of electronic signature by sending or delivering in person a non-electronic, signed statement that withdraws my consent (this request has to be sent to BlueCross BlueShield of Tennessee)." />
        <TextBox text="I know that I am responsible for all hardware and software necessary to access the service and use the electronic signature function." />
        <TextBox text="I understand that my consent to the use of electronic signature is valid for my dependents under the age of 18 for whom I am requesting a change in coverage." />
        <TextBox text='By activating the "Agree" button below, I intend to be bound by the terms of this application, and intend to provide my electronic signature to demonstrate my agreement and acceptance of these terms and conditions.' />
        <TextBox
          className="font-bold"
          text="Affirmation of Understanding and of Statements Made on BlueCross BlueShield of Tennessee Individual Coverage Application"
        />
        <TextBox text="I have read the statements and answers recorded on this application. They are true and complete and correctly recorded. They will become part of this application and any policy(ies) issued on it." />
        <TextBox text="I understand that BlueCross BlueShield of Tennessee is relying on the truthfulness and completeness of the statements and answers on this application in making the decision to issue any policies of health insurance." />
        <TextBox text="I understand that if my answers on this application are incorrect or untrue, BlueCross BlueShield of Tennessee may, in its own discretion, as permitted by applicable laws, terminate or rescind my policy or amend it so that my coverage, including my premium, would be the same as it would have been had the answers on the application been correct." />
        <TextBox text="No insurance agent or broker has authority to waive any BlueCross BlueShield of Tennessee's rights or requirements, or to make or alter any contract or policy, including this application." />
        <TextBox text="This insurance coverage is not designed or marketed as employer-provided insurance. I certify that I understand that I am applying for personal health coverage." />
        <TextBox text="I understand that a broker or agent may receive a portion of my premiums as commission. For more information I will contact my broker or agent." />
        <TextBox text="It is a crime to knowingly provide false, incomplete, or misleading information to an insurance company for the purpose of defrauding the company. Penalties include imprisonment, fines, and denial of coverage." />
        <TextBox text="If I have other health coverage, such coverage will be terminated upon the issue of the BlueCross BlueShield of Tennessee policy for which I have applied." />
        <TextBox text="By submitting this application, I agree that BlueCross BlueShield of Tennessee's grievance process will govern any dispute with the application or any policy issued." />
        <TextBox text="I understand that my broker or agent cannot change any of the terms, conditions, or rates of a BlueCross BlueShield of Tennessee Policy." />
        <TextBox
          className="mt-5"
          text={`E-Sign if you are ${loggedInMem.firstName} ${loggedInMem.lastName} and whether you agree or do not agree to the above items:`}
        />
        <TextBox text="* Required" />
        <Checkbox
          selected={attested}
          callback={() => setAttested(!attested)}
          value="Agree"
          label="I Agree"
        />
        <RichText
          spans={[
            <p key="sign">Signature:</p>,
            <TextBox
              className="!inline"
              key="user"
              text={`"Electronic Signature"  ${loggedInMem.firstName} ${loggedInMem.lastName}`}
            />,
          ]}
        />
        <Row className="gap-5">
          <TextBox text={`Relationship: ${loggedInMem.memRelation}`} />
          <TextBox text={`Date: ${formatDateToLocale(new Date())}`} />
        </Row>
        <Row className="justify-between">
          <Button className="w-fit" callback={goBackWard} label="Back" />
          <Button
            className="w-fit"
            callback={attested ? () => {} : undefined}
            label="Submit"
            style="submit"
            disable={impersonating}
          />
        </Row>
      </Column>
    </form>
  );
};
