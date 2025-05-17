import { Spacer } from '@/components/foundation/Spacer';
import { TextBox } from '@/components/foundation/TextBox';

const CoverageDeterminationInfo = () => {
  return (
    <>
      <TextBox
        text="Request for Medicare Prescription Drug Coverage Determination"
        type="title-2"
      />
      <Spacer size={16} />
      <TextBox
        text="To initiate a coverage review request, please complete the form below and click submit."
        type="body-1"
      />
      <Spacer size={8} />
      <TextBox
        text="Please note that the completion of this form does not constitute completion of the coverage review process and is not a guarantee of plan coverage. Upon receipt of this request, we will begin the coverage review process for the medication indicated below."
        type="body-1"
      />
      <Spacer size={8} />
      <TextBox
        text="Once the completed form is submitted, the patient or his/her representative or prescriber may be contacted by fax or phone for additional information."
        type="body-1"
      />
    </>
  );
};

export default CoverageDeterminationInfo;
