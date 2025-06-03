import { Column } from '@/components/foundation/Column';
import { Spacer } from '@/components/foundation/Spacer';
import { TextBox } from '@/components/foundation/TextBox';

const WellframeSection = () => {
  return (
    <section className="md:flex md:flex-row ml-7">
      <Image src={wellframeLogo} alt="" className="mt-3 md:mt-0" />
      <Spacer size={16} />
      <Column className="md:p-10">
        <TextBox
          text="Wellframe is an independent company that provides services for BlueCross BlueShield of Tennessee."
          type="body-2"
        />
        <TextBox text="Participation is optional." type="body-2" />
      </Column>
    </section>
  );
};

export default WellframeSection;
