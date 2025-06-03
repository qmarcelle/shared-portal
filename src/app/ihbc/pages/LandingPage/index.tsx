import { Button } from '@/components/foundation/Button';
import { Column } from '@/components/foundation/Column';
import { TextBox } from '@/components/foundation/TextBox';
import { LoggedInMember } from '@/models/app/loggedin_member';
import { toPascalCase } from '@/utils/pascale_case_formatter';
import { useContext, useEffect } from 'react';
import { useFormContext } from 'react-hook-form';
import { DependentsContext } from '../../providers/dependentsProvider';
import { LoggedInMemberContext } from '../../providers/loggedInMemberProvider';
import { IHBCSchema } from '../../rules/schema';
import { useIhbcMainStore } from '../../stores/ihbcMainStore';
import { useNavigationStore } from '../../stores/navigationStore';
import { PastApplications } from './PastApplications';

export const LandingPage = () => {
  const [goForward] = useNavigationStore((state) => [state.goForward]);
  const [applications, loadApplications] = useIhbcMainStore((state) => [
    state.applications,
    state.loadApplications,
  ]);
  const loggedInMember = useContext<LoggedInMember>(LoggedInMemberContext);
  const { members } = useContext(DependentsContext);

  const {
    formState: { isValid, errors },
    setValue,
  } = useFormContext<IHBCSchema>();

  useEffect(() => {
    loadApplications();
    setValue(
      'addDeps.existingDeps',
      members.map((item) => ({
        firstName: `${item.firstName}`,
        dob: item.dob,
        relationship: item.relationship == 'M' ? 'Self' : item.relationship!,
        tobaccoUse: '0' as const,
        gender: item.gender == 'M' ? ('M' as const) : ('F' as const),
      })),
      {
        shouldValidate: false,
      },
    );
  }, []);
  return (
    <Column className="my-4 gap-4">
      <TextBox
        type="title-2"
        text={`Welcome ${toPascalCase(`${loggedInMember!.firstName} ${loggedInMember.lastName}`)}`}
      />
      <TextBox
        text="You can make benefit changes, update personal information such as name, address, phone number, or e-mail address. You can also add or remove dependents or terminate benefits.

Plan changes related to qualifying events will be effective based on the event date. Termination and/or cancellation requests will be effective on the requested effective date. If you have questions, please contact 1-800-845-2738."
      />
      {applications.length > 0 && (
        <PastApplications applications={applications} />
      )}
      <Button
        callback={goForward}
        className="w-fit self-center"
        label="Start New Change Request"
      />
    </Column>
  );
};
