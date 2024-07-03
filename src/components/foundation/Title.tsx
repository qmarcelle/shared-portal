import { IComponent } from '../IComponent';

interface TitleProps extends IComponent {
  text: string;
  prefix?: JSX.Element;
  suffix?: JSX.Element;
  callback?: () => void;
}

export const Title = ({
  prefix,
  text,
  suffix,
  className,
  callback,
}: TitleProps) => {
  return (
    <div className="flex flex-row" onClick={callback}>
      {prefix && <div className="mr-2">{prefix}</div>}
      <p className={className}>{text}</p>
      {suffix && <div className="ml-2">{suffix}</div>}
    </div>
  );
};
