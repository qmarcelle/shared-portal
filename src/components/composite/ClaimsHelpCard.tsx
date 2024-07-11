/* eslint-disable react/jsx-key */
import { Card } from '../foundation/Card';
import { Column } from '../foundation/Column';
import { Header } from '../foundation/Header';
import { RichText } from '../foundation/RichText';
import { Spacer } from '../foundation/Spacer';

export const ClaimsHelpCard = () => {
  return (
    <Column>
      <Card type="elevated" className="small-section">
        <Column>
          <Header className="title-2" text="Get Help with Claims" />
          <Spacer size={16} />
          <RichText
            spans={[
              <span>If you need help, please reach out to us. You can </span>,
              <span className="link">
                <a>start a chat</a>
              </span>,
              <span> or call us at [1-800-000-000].</span>,
            ]}
          />
          <Spacer size={16} />
          <RichText
            spans={[
              <span>You can also try our </span>,
              <span className="link">
                <a>Claims FAQ.</a>
              </span>,
            ]}
          />
        </Column>
      </Card>
    </Column>
  );
};
