import { Radio } from '@/components/foundation/Radio';

interface IRadioButtonFormatterProps {
  value: any;
  isSelected: any;
  handleRadioChange: (value: any) => void;
}
function OnChange() {
  console.log('radio button click');
}

export function RadioButtonFormatter({
  value,
  isSelected,
  handleRadioChange,
}: IRadioButtonFormatterProps) {
  console.log(value, 'value');
  return (
    <Radio
      label=""
      value={value}
      selected={isSelected}
      callback={() => {
        handleRadioChange(value);
      }}
    />
    // <input
    //   type="radio"
    //   value={value}
    //   checked={isSelected}
    //   onChange={(e) => {
    //     OnChange();
    //   }}
    ///>
  );
}
