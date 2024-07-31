import { Card } from '@/components/foundation/Card';
import { Column } from '@/components/foundation/Column';
import { Header } from '@/components/foundation/Header';
import { Spacer } from '@/components/foundation/Spacer';
import { TextBox } from '@/components/foundation/TextBox';

export const AboutOtherInsurance = () => {
  return (
    <Card className="small-section !mt-0">
      <Column>
        <Header type="title-2" text="About Other Insurance" />
        <Spacer size={16} />
        <TextBox text="Even if you don't have other coverage, we still need to know that we can process your claims correctly" />
        <Spacer size={32} />
      </Column>
    </Card>
  );
};
