import { AppLink } from '@/components/foundation/AppLink';
import { Card } from '@/components/foundation/Card';
import { Column } from '@/components/foundation/Column';
import { Header } from '@/components/foundation/Header';
import { Spacer } from '@/components/foundation/Spacer';
import { TextBox } from '@/components/foundation/TextBox';
import { IComponent } from '@/components/IComponent';

interface BecomeRepresentativeProps extends IComponent {
  linkLabel: string;
  linkURL?: string;
  isRepresentative: boolean;
}

export const BecomeRepresentative = ({
  linkLabel,
  isRepresentative,
}: BecomeRepresentativeProps) => {
  function getRepresentativeContent() {
    return (
      <Card className="large-section p-8">
        <Column>
          <Header type="title-2" text="Become a Representative" />
          <Spacer size={22} />
          <TextBox text="You can register to become a personal representative online. It can take up to five business days to process the request." />
          <Spacer size={22} />
          <AppLink label={linkLabel} className="!contents" />
        </Column>
      </Card>
    );
  }
  return <div>{isRepresentative ? getRepresentativeContent() : null}</div>;
};
