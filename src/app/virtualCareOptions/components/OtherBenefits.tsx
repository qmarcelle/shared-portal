import { VirtualCareOptionsCard } from '@/app/findcare/components/VirtualCareOptionsCard';
import { AppLink } from '@/components/foundation/AppLink';
import { Card } from '@/components/foundation/Card';
import { Column } from '@/components/foundation/Column';
import { Header } from '@/components/foundation/Header';
import { SlidingCarousel } from '@/components/foundation/SlidingCarousel';
import { Spacer } from '@/components/foundation/Spacer';
import { TextBox } from '@/components/foundation/TextBox';
import { IComponent } from '../../../components/IComponent';
import { OtherBenefitsInfo } from '../models/OtherBenefitsInfo';

interface OtherBenefitsProps extends IComponent {
  options: OtherBenefitsInfo[];
}

export const OtherBenefits = ({ options, className }: OtherBenefitsProps) => {
  return (
    <Card className={className}>
      <Column>
        <Header className="mb-0 title-2" text="Health Programs & Resources" />
        <Spacer size={16} />
        <TextBox
          className="body-1 mb-0"
          text="Your plan includes programs, guides and discounts to help make taking charge of your health easier and more affordable."
        ></TextBox>
        <Spacer size={32} />
        <SlidingCarousel>
          {options.map((item) => (
            <VirtualCareOptionsCard
              key={item.id}
              id={item.id}
              className="mr-4 shrink-0 "
              description={item.description}
              title={item.title}
              url={item.url}
            />
          ))}
        </SlidingCarousel>
        <Spacer size={23} />
        <AppLink label="View All Health Programs & Resources" />
      </Column>
    </Card>
  );
};
