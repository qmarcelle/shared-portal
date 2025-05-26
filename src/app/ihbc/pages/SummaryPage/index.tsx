import { Button } from '@/components/foundation/Button';
import { Column } from '@/components/foundation/Column';
import { Divider } from '@/components/foundation/Divider';
import { Row } from '@/components/foundation/Row';
import { TextBox } from '@/components/foundation/TextBox';
import { useFormContext } from 'react-hook-form';
import { HighlightedHeader } from '../../components/HighlightedHeader';
import { LabelledData } from '../../components/LabelledData';
import { NavPagesEnum } from '../../models/NavPagesEnum';
import { SpecialEnrolmentEventEnum } from '../../models/SpecialEnrolmentEventEnum';
import { IHBCSchema } from '../../rules/schema';
import { useBenefitSelectionStore } from '../../stores/benefitSelectionStore';
import { useIhbcMainStore } from '../../stores/ihbcMainStore';
import { useNavigationStore } from '../../stores/navigationStore';
import { useSpecialEnrolmentPeriodStore } from '../../stores/specialEnrolmentPeriodStore';
import { AddDependentDataViewer } from './AddDependentDataViewer';
import { AddressDataViewer } from './AddressDataViewer';
import { PolicyCancellationViewer } from './PolicyCancellationViewer';
import { RemoveDependentDataViewer } from './RemoveDependentDataViewer';
import { SepItem } from './SepItem';
import { SummaryContainer } from './SummaryContainer';

export const SummaryPage = () => {
  const [event, eventDate, selectedEffectiveDate] =
    useSpecialEnrolmentPeriodStore((state) => [
      state.event,
      state.eventDate,
      state.selectedEffectiveDate,
    ]);
  const [medicalPlan, dentalPlan, visionPlan] = useBenefitSelectionStore(
    (state) => [
      state.selectedMedicalPlan,
      state.selectedDentalPlan,
      state.selectedVisionPlan,
    ],
  );
  const [isOEActive] = useIhbcMainStore((state) => [state.isOEActive]);
  const [goBackWard, goForward] = useNavigationStore((state) => [
    state.goBackWard,
    state.goForward,
  ]);
  const { getValues } = useFormContext<IHBCSchema>();
  const data = getValues();

  return (
    <Column className="gap-4">
      <HighlightedHeader text="Summary Of Changes" />
      <TextBox text='Please review your application information. You may make changes by selecting the "Edit" button for each appropriate section.' />
      <SummaryContainer
        title="Terminate Policy"
        className="gap-2"
        navPage={NavPagesEnum.terminatePolicyPage}
      >
        {/* Terminate Policy */}
        {[
          {
            label: 'Terminate Primary Applicant',
            value: data.terminatePolicy?.terminatePrimaryApplicant,
          },
          {
            label: 'Cancel Medical Policy',
            value: data.terminatePolicy?.cancelMedicalPolicy,
          },
          {
            label: 'Cancel Dental Policy',
            value: data.terminatePolicy?.cancelDentalPolicy,
          },
          {
            label: 'Cancel Vision Policy',
            value: data.terminatePolicy?.cancelVisionPolicy,
          },
        ].map(({ label, value }) => (
          <Column key={label}>
            <LabelledData label={label} value={value ? 'Yes' : 'No'} />
            {value && <PolicyCancellationViewer key={label} policy={value} />}
          </Column>
        ))}
      </SummaryContainer>
      {/* Change Personal Information */}
      <SummaryContainer
        title="Change Personal Information"
        navPage={NavPagesEnum.initialSelectionPage}
        className="gap-2"
      >
        <LabelledData
          label="Change Name"
          value={data.changePersonalInfo?.changeName ? 'Yes' : 'No'}
        />
        {/* Change Name */}
        {data.changePersonalInfo?.changeName && (
          <Column>
            <LabelledData
              label="Last Name"
              value={data.changePersonalInfo?.changeName?.lastName}
            />
            <LabelledData
              label="First Name"
              value={data.changePersonalInfo?.changeName?.firstName}
            />
            <LabelledData
              label="MI"
              value={data.changePersonalInfo?.changeName?.mi}
            />
            <LabelledData
              label="Reason for Change"
              value={data.changePersonalInfo?.changeName?.reason}
            />
            <Divider />
          </Column>
        )}
        <LabelledData
          label="Change Address"
          value={data.changePersonalInfo?.changeAddress ? 'Yes' : 'No'}
        />
        {/* Change Address */}
        {data.changePersonalInfo?.changeAddress && (
          <Column className="gap-2">
            <LabelledData
              label="Residence"
              value={
                data.changePersonalInfo?.changeAddress?.residence ? 'Yes' : 'No'
              }
            />
            <AddressDataViewer
              address={data.changePersonalInfo?.changeAddress?.residence}
            />
            <LabelledData
              label="Mailing"
              value={
                data.changePersonalInfo?.changeAddress?.mailing ? 'Yes' : 'No'
              }
            />
            <AddressDataViewer
              address={data.changePersonalInfo?.changeAddress?.mailing}
            />
            <LabelledData
              label="Billing"
              value={
                data.changePersonalInfo?.changeAddress?.billing ? 'Yes' : 'No'
              }
            />
            <AddressDataViewer
              address={data.changePersonalInfo?.changeAddress?.billing}
            />
          </Column>
        )}
        {/* Change Phone */}
        <LabelledData
          label="Change Phone"
          value={data.changePersonalInfo?.changePhone ? 'Yes' : 'No'}
        />
        <LabelledData
          label="Phone Number"
          value={data.changePersonalInfo?.changePhone}
        />
        {/* Change Email Address */}
        <LabelledData
          label="Change Email Address"
          value={data.changePersonalInfo?.changeEmailAddress ? 'Yes' : 'No'}
        />
        <LabelledData
          label="Email Address"
          value={data.changePersonalInfo?.changeEmailAddress}
          divider={true}
        />
        {/* Change Tobacco Use */}
        <LabelledData
          label="Change Tobacco Use"
          value={data.changePersonalInfo?.changeTobaccoUse ? 'Yes' : 'No'}
        />
        {data.changePersonalInfo?.changeTobaccoUse && (
          <Column>
            <LabelledData
              label="Primary Applicant"
              value={
                data.changePersonalInfo?.changeTobaccoUse?.primaryApplicant
              }
            />
            <LabelledData
              label="Spouse"
              value={data.changePersonalInfo?.changeTobaccoUse?.spouse}
            />
            <Divider />
          </Column>
        )}
      </SummaryContainer>
      {/* Add Dependents */}
      <SummaryContainer
        title="Add Dependents"
        navPage={NavPagesEnum.changeDeps}
      >
        <LabelledData
          label="Add Dependents"
          value={data.addDeps?.dependents ? 'Yes' : 'No'}
        />
        {data.addDeps?.dependents?.map((item) => (
          <AddDependentDataViewer key={item.firstName} dependent={item} />
        ))}
      </SummaryContainer>
      {/* Remove Dependents */}
      <SummaryContainer
        title="Terminate Dependents"
        navPage={NavPagesEnum.terminateDeps}
        className="gap-2"
      >
        <LabelledData
          label="Remove Spouse"
          value={data.removeDeps?.spouse ? 'Yes' : 'No'}
        />
        <RemoveDependentDataViewer dependent={data.removeDeps?.spouse} />
        <LabelledData
          label="Remove Dependents"
          value={(data.removeDeps?.dependents?.length ?? 0 > 0) ? 'Yes' : 'No'}
        />
        {data.removeDeps?.dependents?.map((item) => (
          <RemoveDependentDataViewer key={item.firstName} dependent={item} />
        ))}
      </SummaryContainer>
      {/* Special Enrollments */}
      <SummaryContainer
        title="Special Enrollment Periods"
        navPage={NavPagesEnum.sepPage}
        className="gap-2"
      >
        {[
          {
            title:
              'Loss of Minimum Essential Health Insurance Coverage due to Death, Termination, Reduction of Hours, Divorce/Legal Separation, Medicare Eligible, Retirement, Exceeds Age Limit, COBRA, Cancellation of Employer Sponsored. Note: Loss of coverage due to non-payment of premiums or material misrepresentation is not considered a qualifying event',
            type: SpecialEnrolmentEventEnum.lossOfCoverage,
          },
          {
            title: 'Birth/Adoption/Placement in Foster Care',
            type: SpecialEnrolmentEventEnum.birthOrAdoption,
          },
          {
            title: 'Recently Married',
            type: SpecialEnrolmentEventEnum.marriage,
          },
          {
            title: 'Permanently Moved to a New Address',
            type: SpecialEnrolmentEventEnum.permanentMove,
          },
          {
            title:
              'Loss of Dependent(s) through Divorce, Legal Separation, or Death',
            type: SpecialEnrolmentEventEnum.lossOfDep,
          },
          {
            title:
              'Gain Dependent(s) through a Child Support Order or Other Court Order',
            type: SpecialEnrolmentEventEnum.gainDep,
          },
          {
            title:
              'Gain Access to an ICHRA or QSEHRA (Individual Coverage Health Reimbursement Account or newly Qualified Small Employer Health Reimbursement Arrangement)',
            type: SpecialEnrolmentEventEnum.gainDep,
          },
        ].map(({ title, type }) => (
          <SepItem
            key={type}
            label={title}
            showData={event == type}
            eventDate={eventDate}
            effectiveDate={selectedEffectiveDate}
          />
        ))}
        <SepItem
          key="OE"
          label="Open Enrollment"
          showData={isOEActive}
          eventDate={undefined}
          effectiveDate={undefined}
        />
      </SummaryContainer>
      <SummaryContainer
        title="Change My Benefits"
        navPage={NavPagesEnum.changeDeps}
        className="gap-2"
      >
        {[
          {
            label: 'Medical Benefit Plan Change',
            value: medicalPlan,
          },
          {
            label: 'Dental Plan Change',
            value: dentalPlan,
          },
          {
            label: 'Vision Plan Change',
            value: visionPlan,
          },
        ].map(({ label, value }) => (
          <Column key={label}>
            <LabelledData label={label} value={value ? 'Yes' : 'No'} />
            {value && (
              <>
                <TextBox className="text-primary" text={value.planName} />
                <LabelledData label="Rate per month" value={value.rate} />
              </>
            )}
          </Column>
        ))}
        <TextBox text="The rates shown above are only estimated rates based upon the information you provided. Approval of coverage and the actual rates will depend on your eligibility and the date your application is submitted." />
      </SummaryContainer>
      <Row className="justify-between">
        <Button className="w-fit" callback={goBackWard} label="Back" />
        <Button className="w-fit" callback={goForward} label="Next" />
      </Row>
    </Column>
  );
};
