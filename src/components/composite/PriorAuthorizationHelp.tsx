import { Card } from '../foundation/Card';
import { Column } from '../foundation/Column';
import { Header } from '../foundation/Header';
import { RichText } from '../foundation/RichText';
import { Spacer } from '../foundation/Spacer';

export const PriorAuthorizationHelp = () => {
  return (
    <Card className="!mt-0 md:ml-8 p-8">
      <Column className="flex flex-col">
        <Header
          type="title-2"
          text="Get Help With Prior Authorization"
        ></Header>
        <Spacer size={16} />
        <RichText
          spans={[
            <span key={0}>
              if you need help, please help reach out to us.You can{' '}
            </span>,
            <span className="link" key={1}>
              <a>start a chat </a>
            </span>,
            <span key={2}>or call us at [1-800-000-000]</span>,
          ]}
        />
        <Spacer size={32} />

        <RichText
          spans={[
            <span key={0}>You can also try our </span>,
            <span className="link" key={1}>
              <a>Prior Authorization FAQ</a>
            </span>,
          ]}
        />
        <Spacer size={24} />
      </Column>
    </Card>
  );
};
