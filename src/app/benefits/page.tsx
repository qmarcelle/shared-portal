import { Column } from '@/components/foundation/Column';
import { Spacer } from '@/components/foundation/Spacer';
import { Title } from '@/components/foundation/Title';

const BenefitsAndCoverage = () => {
  return (
    <main className="flex flex-col justify-center items-center page">
      <Column className="app-content">
        <Spacer size={32} />
        <Title className="title-1" text="Benefits And Coverage Dummy Page" />
      </Column>
    </main>
  );
};

export default BenefitsAndCoverage;
