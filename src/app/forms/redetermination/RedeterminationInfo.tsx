import { Column } from '@/components/foundation/Column';
import { RichText } from '@/components/foundation/RichText';
import { Row } from '@/components/foundation/Row';
import { Spacer } from '@/components/foundation/Spacer';
import { TextBox } from '@/components/foundation/TextBox';

const RedeterminationFormInfo = () => {
  return (
    <>
      <TextBox
        text="Because we, BlueAdvantage (PPO)SM, denied your request for
                coverage of (or payment for) a prescription drug, you have the
                right to ask us for a redetermination (appeal) of our decision.
                You have 60 days from the date of our Notice of Denial of
                Medicare Prescription Drug Coverage to ask us for a
                redetermination. You can submit this form by mail, fax or
                online."
        type="body-1"
      />
      <Spacer size={8} />
      <TextBox
        text=" You'll find the coverage redetermination form at the bottom of the page. To submit the form by mail or fax, use this information:"
        type="body-1"
      />
      <Spacer size={8} />
      <Row>
        <Column>
          <TextBox text="Address: " className="font-bold" />
          <TextBox text="BlueCross BlueShield of Tennessee" />
          <TextBox text="Medicare Part D Coverage Determinations and Appeals" />
          <TextBox text="1 Cameron Hill Circle, Suite 51" />
          <TextBox text="Chattanooga, TN 37402-0051" />
        </Column>
        <Spacer axis="horizontal" size={16} />
        <Column>
          <TextBox text="Fax Number:" className="font-bold" />
          <TextBox text="423-591-9514" />
        </Column>
      </Row>
      <Spacer size={8} />
      <TextBox
        text="Expedited appeal requests can be made by phone at 1-800-831-2583, (TTY users can call 711), 24 hours a day, 7 days a week."
        type="body-1"
      />
      <Spacer size={8} />
      <RichText
        spans={[
          <span className="font-bold" key={5}>
            Who May Make a Request:
          </span>,
          <span key={6}>
            Your prescriber may ask us for an appeal on your behalf. If you want
            another individual (such as a family member or friend) to request an
            appeal for you, that individual must be your representative. Contact
            us to learn how to name a representative.
          </span>,
        ]}
        type="body-1"
      />
    </>
  );
};

export default RedeterminationFormInfo;
