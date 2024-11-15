import { IComponent } from '../IComponent';
import { Spacer } from '../foundation/Spacer';

interface WelcomeBannerProps extends IComponent {
  name?: string;
  titleText?: string;
  body?: JSX.Element;
  minHeight?: string;
}

export const WelcomeBanner = ({
  name,
  body,
  titleText,
  className,
  minHeight,
}: WelcomeBannerProps) => {
  return (
    <div
      className={`flex flex-col h-175px w-full text-white justify-center items-center brand-gradient ${className ?? ''} ${minHeight ?? ''}`}
    >
      <div className="flex flex-col items-start w-full app-content px-4">
        <Spacer size={32}></Spacer>
        <h1 className="title-1 font-thin">
          {titleText} {name}
        </h1>
        <Spacer size={16} />
        {body}
      </div>
    </div>
  );
};
