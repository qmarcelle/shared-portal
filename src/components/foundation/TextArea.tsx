import { SetStateAction } from 'react';
import { IComponent } from '../IComponent';

export interface TextAreaProps extends IComponent {
  value?: string | number;
  onChange: (e: { target: { value: SetStateAction<string> } }) => void;
  className?: string;
  placeholder?: string;
}

export const TextArea = ({
  value,
  className,
  onChange,
  placeholder,
}: TextAreaProps) => {
  return (
    <textarea
      value={value}
      onChange={onChange}
      className={className}
      placeholder={placeholder}
    ></textarea>
  );
};
