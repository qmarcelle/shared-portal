import { Row } from '@/components/foundation/Row';
import { LabelledData } from '../../components/LabelledData';

type Props = {
  label: string;
  showData: boolean;
  eventDate: string | undefined;
  effectiveDate: string | undefined;
};

export const SepItem = ({
  label,
  showData,
  eventDate,
  effectiveDate,
}: Props) => {
  return (
    <>
      <LabelledData label={label} value={showData ? 'Yes' : 'No'} />
      {showData && (
        <Row className="gap-10">
          <LabelledData label="Event Date" value={eventDate} />
          <LabelledData label="Effective Date" value={effectiveDate} />
        </Row>
      )}
    </>
  );
};
