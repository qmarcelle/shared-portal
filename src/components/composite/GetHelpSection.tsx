import { IComponent } from '../../components/IComponent';
import { Card } from '../foundation/Card';
import { Column } from '../foundation/Column';
import { Header } from '../foundation/Header';
import { RichText } from '../foundation/RichText';
import { Spacer } from '../foundation/Spacer';
export interface GetHelpProps extends IComponent {
  link?: string;
  linkURL: string;
  headerText: string;
  contact: string;
}

export const GetHelpSection = ({
  link,
  linkURL,
  headerText,
  contact,
}: GetHelpProps) => {
  return (
    <Card className="large-section">
      <Column className="flex flex-col">
        <Header type="title-2" text={headerText}></Header>
        <Spacer size={16} />
        <RichText
          spans={[
            <span key={0}>
              if you need help, please help reach out to us.You can{' '}
            </span>,
            <span className="link" key={1}>
              <a>start a chat </a>
            </span>,
            <span key={2}>or call us at {contact}</span>,
          ]}
        />
        <Spacer size={32} />

        <RichText
          spans={[
            <span key={0}>You can also try our </span>,
            <span className="link" key={1}>
              <a href={link}>{linkURL}</a>
            </span>,
          ]}
        />
        <Spacer size={24} />
      </Column>
    </Card>
  );
};
