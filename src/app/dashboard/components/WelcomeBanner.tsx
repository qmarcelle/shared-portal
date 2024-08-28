import { IComponent } from '../../../components/IComponent';
import { Spacer } from '../../../components/foundation/Spacer';

interface WelcomeBannerProps extends IComponent {
  name: string;
  titleText?: string;
  body?: JSX.Element;
}

export const WelcomeBanner = ({
  name,
  body,
  titleText,
}: WelcomeBannerProps) => {
  return (
    <div className="flex flex-col h-[auto] w-full text-white justify-center items-center brand-gradient">
      <div className="flex flex-col items-start w-full app-content px-4">
        <h1 className="title-1">
          {titleText} {name}
        </h1>
        <Spacer size={16} />
        {body}
      </div>
    </div>
  );
};
