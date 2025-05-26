import { TextBox } from '@/components/foundation/TextBox';

type Props = {
  text: string;
};

export const HighlightedHeader = ({ text }: Props) => {
  return (
    <div className="p-2 bg-primary">
      <TextBox className="text-white" text={text} />
    </div>
  );
};
