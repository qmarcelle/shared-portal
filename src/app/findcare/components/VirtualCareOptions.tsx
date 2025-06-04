'use client';

import { VirtualCareOptionsCard } from '@/app/findcare/components/VirtualCareOptionsCard';
import { VirtualCareOptionsInfo } from '@/app/findcare/models/VirtualCareOptionsInfo';
import { IComponent } from '@/components/IComponent';
import { AppLink } from '@/components/foundation/AppLink';
import { Card } from '@/components/foundation/Card';
import { Column } from '@/components/foundation/Column';
import { Header } from '@/components/foundation/Header';
import { SlidingCarousel } from '@/components/foundation/SlidingCarousel';
import { Spacer } from '@/components/foundation/Spacer';
import { TextBox } from '@/components/foundation/TextBox';

interface VirtualCareOptionsProps extends IComponent {
  options: VirtualCareOptionsInfo[];
}

export const VirtualCareOptions = ({
  options,
  className,
}: VirtualCareOptionsProps) => {
  return (
    <Card className={className}>
      <Column>
        <Header type="title-2" text="Virtual Care Options" />
        <Spacer size={16} />
        <TextBox text="The following options offer quick, high-quality care for a range of non-emergency needs." />
        <Spacer size={32} />
        <SlidingCarousel>
          {options
            .filter((item) => item.isShow)
            .map((item) => (
              <VirtualCareOptionsCard
                key={item.id}
                id={item.id}
                className="mr-4 shrink-0"
                description={item.description}
                title={item.title}
                url={item.url}
                isShow={item.isShow}
              />
            ))}
        </SlidingCarousel>
        <Spacer size={23} />
        <AppLink label="Learn More & Compare Virtual Care Options" />
      </Column>
    </Card>
  );
};
