import { Button } from '@/components/foundation/Button';
import { Column } from '@/components/foundation/Column';
import { Radio } from '@/components/foundation/Radio';
import { RichText } from '@/components/foundation/RichText';
import { Row } from '@/components/foundation/Row';
import { TextBox } from '@/components/foundation/TextBox';
import { SpecialEnrolmentEventEnum } from '../../models/SpecialEnrolmentEventEnum';
import { useNavigationStore } from '../../stores/navigationStore';
import { useSpecialEnrolmentPeriodStore } from '../../stores/specialEnrolmentPeriodStore';
import { EventDateForm } from './EventDateForm';

const SpecialEnrolmentPage = () => {
  const [
    event,
    eventDate,
    effectiveDates,
    selectedEffectiveDate,
    updateEvent,
    updateEventDate,
    updateSelectedEffectiveDate,
  ] = useSpecialEnrolmentPeriodStore((state) => [
    state.event,
    state.eventDate,
    state.effectiveDates,
    state.selectedEffectiveDate,
    state.updateEvent,
    state.updateEventDate,
    state.updateSelectedEffectiveDate,
  ]);

  const [goBackWard, goForward] = useNavigationStore((state) => [
    state.goBackWard,
    state.goForward,
  ]);

  return (
    <Column className="gap-8">
      <div className="p-2 bg-primary">
        <TextBox className="text-white" text="Special Enrollment Periods" />
      </div>
      <TextBox text="You have indicated that you would like to add a spouse, add a dependent(s), and/or make a change in your medical coverage. Please select the reason for the change, the date of your event, as well as the preferred effective date of the change below." />

      <Column>
        <Radio
          selected={event == SpecialEnrolmentEventEnum.lossOfCoverage}
          callback={() => updateEvent(SpecialEnrolmentEventEnum.lossOfCoverage)}
          label="Loss of Minimum Essential Health Insurance Coverage due to Death, Termination, Reduction of Hours, Divorce/Legal Separation, Medicare Eligible, Retirement, Exceeds Age Limit, COBRA, Cancellation of Employer Sponsored. Note: Loss of coverage due to non-payment of premiums or material misrepresentation is not considered a qualifying event."
        />
        <Radio
          selected={event == SpecialEnrolmentEventEnum.birthOrAdoption}
          callback={() =>
            updateEvent(SpecialEnrolmentEventEnum.birthOrAdoption)
          }
          label="Birth/Adoption/Placement in Foster Care"
        />
        <Radio
          selected={event == SpecialEnrolmentEventEnum.marriage}
          callback={() => updateEvent(SpecialEnrolmentEventEnum.marriage)}
          label="Recently Married"
        />
        <Radio
          selected={event == SpecialEnrolmentEventEnum.permanentMove}
          callback={() => updateEvent(SpecialEnrolmentEventEnum.permanentMove)}
          label="Permanently Moved to a New Address"
        />
        <Radio
          selected={event == SpecialEnrolmentEventEnum.lossOfDep}
          callback={() => updateEvent(SpecialEnrolmentEventEnum.lossOfDep)}
          label="Loss of Dependent(s) through Divorce, Legal Separation, or Death"
        />
        <Radio
          selected={event == SpecialEnrolmentEventEnum.gainDep}
          callback={() => updateEvent(SpecialEnrolmentEventEnum.gainDep)}
          label="Gain Dependent(s) through a Child Support Order or Other Court Order"
        />
        <Radio
          selected={false}
          label="Gain Access to an ICHRA or QSEHRA (Individual Coverage Health Reimbursement Account or newly Qualified Small Employer Health Reimbursement Arrangement)"
        />
      </Column>
      {event != null && (
        <EventDateForm
          key={event}
          effectiveDates={effectiveDates}
          eventDate={eventDate}
          selectedDate={selectedEffectiveDate}
          updateEventDate={updateEventDate}
          updateSelectedEffectiveDate={updateSelectedEffectiveDate}
        />
      )}
      <Column>
        <RichText
          spans={[
            <TextBox
              key="one"
              display="inline"
              text="For quicker processing of your application, you may submit "
            />,
            <span key="two">
              <a className="link">Acceptable Documentation</a>
            </span>,
            <TextBox
              key="three"
              display="inline"
              text=" by email or fax to:"
            />,
          ]}
        />
        <RichText
          spans={[
            <p key="one">Email: </p>,
            <a key={2} className="link" href="">
              Individual_Residency_SEP@bcbst.com
            </a>,
          ]}
        />
        <TextBox text="Fax: 423-591-9244" />
      </Column>
      <Column>
        <TextBox text="When submitting documentation, please include the following:" />
        <TextBox text="Subscriber ID" />
        <TextBox text="First and Last Name" />
        <TextBox text="Date of birth" />
      </Column>
      <Row className="justify-between">
        <Button className="w-fit" callback={goBackWard} label="Back" />
        <Button className="w-fit" callback={goForward} label="Next" />
      </Row>
    </Column>
  );
};

export default SpecialEnrolmentPage;
