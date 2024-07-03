import { Card } from '../../../components/foundation/Card';
import { Column } from '../../../components/foundation/Column';
import { Spacer } from '../../../components/foundation/Spacer';
import { TextBox } from '../../../components/foundation/TextBox';

export const AboutMyProfileSlide = () => {
  return (
    <Card className="small-section">
      <Column className="app-content app-base-font-color">
        <section className="flex flex-row items-start app-body">
          <Column className="flex-grow page-section-36_67 items-stretch">
            <TextBox className="title-2" text="About My Profile" />
            <Spacer size={16} />
            <TextBox
              className="body-1"
              text="We'll ask for your race, ethnicity and preferred language. You don't have to tell us. But if you do, we'll keep your answers private. And we'll use secure digital protections to keep your information safe."
            />
          </Column>
        </section>
      </Column>
    </Card>
  );
};
