import { Card } from '@/components/foundation/Card';
import { Column } from '@/components/foundation/Column';
import { Header } from '@/components/foundation/Header';
import { Spacer } from '@/components/foundation/Spacer';
import { TextBox } from '@/components/foundation/TextBox';

export const AboutSocialSecurityNumberCard = () => {
  return (
    <Card className="small-section">
      <Column>
        <Header
          className="mb-0 title-2"
          text="About Social Security Number"
          aria-level={2}
        />
        <Spacer size={16} />
        <TextBox
          className="body-1 mb-0"
          text="For privacy and security, we will not display the current social security number we have on file."
          ariaLabel="For privacy and security, we will not display the current social security number we have on file."
        ></TextBox>
        <Spacer size={16} />
        <TextBox
          className="body-1 mb-0"
          text="Your SSN is used to process important tax related documents. Adding or updating your SSN will ensure that your documents are accurate and timely."
          ariaLabel="Your SSN is used to process important tax related documents. Adding or updating your SSN will ensure that your documents are accurate and timely."
        ></TextBox>
        <Spacer size={16} />
      </Column>
    </Card>
  );
};
