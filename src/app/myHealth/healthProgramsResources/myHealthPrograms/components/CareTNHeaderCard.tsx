import { Button } from '@/components/foundation/Button';
import { Column } from '@/components/foundation/Column';
import { Header } from '@/components/foundation/Header';
import { Spacer } from '@/components/foundation/Spacer';
import { TextBox } from '@/components/foundation/TextBox';
import { IComponent } from '@/components/IComponent';

interface CareTNHeaderCardProps extends IComponent {
  callBackCareTNSteps: () => void;
}

export const CareTNHeaderCard = ({
  callBackCareTNSteps,
}: CareTNHeaderCardProps) => {
  return (
    <Column className="pl-3 md:w-[78%]">
      <Spacer size={32} />
      <Header type="title-1" text="CareTN One-on-One Health Support" />
      <Spacer size={8} />
      <TextBox
        className="body-1"
        text="Did you know you can talk to your very own care team? The CareTN program lets you message a nurse or other health professional for support and answers — at no cost to you."
      />
      <Spacer size={16} />
      <TextBox
        className="body-1"
        text="Download the CareTN app, and we’ll contact you after you register. "
      />
      <Spacer size={23} />
      <Button
        label="Get Started with CareTN"
        className="my-health-programs-header-button"
        callback={() => callBackCareTNSteps()}
      />
    </Column>
  );
};
