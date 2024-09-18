import { Card } from '@/components/foundation/Card';
import { Header } from '@/components/foundation/Header';
import { Spacer } from '@/components/foundation/Spacer';
import { TextBox } from '@/components/foundation/TextBox';

const AboutEnrollment = () => {
  return (
    <Card className="large-section">
      <section>
        <Header text="About Enrollment" className="title-2 font-bold" />
        <Spacer size={16} />
        <TextBox text="Complete the enrollment form to get your access code to the CareTN app." />
        <Spacer size={16} />
        <TextBox text="After enrollment, a nurse will call to welcome you and provide more details on program benefits such as the free breast pump or customized resources." />
      </section>
    </Card>
  );
};

export default AboutEnrollment;
