import { AppLink } from '@/components/foundation/AppLink';
import { Card } from '@/components/foundation/Card';
import { Circle } from '@/components/foundation/Circle';
import { Column } from '@/components/foundation/Column';
import { Header } from '@/components/foundation/Header';
import { externalIcon } from '@/components/foundation/Icons';
import { RichText } from '@/components/foundation/RichText';
import { Row } from '@/components/foundation/Row';
import { Spacer } from '@/components/foundation/Spacer';
import { TextBox } from '@/components/foundation/TextBox';
import Image from 'next/image';

const PharmacyBenefits = () => {
  return (
    <Card className="large-section">
      <section>
        <Header text="Pharmacy Benefits" className="title-2 font-bold" />
        <Spacer size={16} />
        <TextBox text="You have a pharmacy card just for your prescription drugs. Here are some helpful things to know:" />
        <Spacer size={16} />
        <Row>
          <Column className="no-shrink">
            <Circle
              width={5}
              height={5}
              color="#5DC1FD"
              radius={50}
              top={7}
              right={0}
            />
          </Column>
          <TextBox
            text="Coverage and claims for prescriptions are managed by your pharmacy benefit manager. That’s an independent company that specializes in these services."
            className="ml-4"
          />
        </Row>
        <Spacer size={16} />
        <Row>
          <Column className="no-shrink">
            <Circle
              width={5}
              height={5}
              color="#5DC1FD"
              radius={50}
              top={7}
              right={0}
            />
          </Column>
          <TextBox
            text="If you have questions or need a new card, call 1-888-816-1680."
            className="ml-4"
          />
        </Row>
        <Spacer size={16} />

        <RichText
          type="body-1"
          className="md:!inline-flex"
          spans={[
            <span key={0}>You can also&nbsp;</span>,
            <span key={1}>
              <AppLink
                className="link hover:!underline !flex p-0"
                label="visit TennCare’s site for more info"
                url="https://www.tn.gov/tenncare/members-applicants/pharmacy.html"
                icon={<Image src={externalIcon} alt="external" />}
              />
            </span>,
            <span key={2}>on prescription coverage.</span>,
          ]}
        />
      </section>
    </Card>
  );
};

export default PharmacyBenefits;
