import { Divider } from '@/components/foundation/Divider';
import { RichText } from '@/components/foundation/RichText';

type Props = {
  label: string;
  value: string | undefined;
  divider?: boolean;
};

export const LabelledData = ({ label, value, divider }: Props) => {
  if (!value) {
    return <></>;
  }
  return (
    <>
      <RichText
        spans={[
          <p key="label">{label} - </p>,
          <p key="value" className="font-bold">
            {value}
          </p>,
        ]}
      />
      {divider && <Divider />}
    </>
  );
};
