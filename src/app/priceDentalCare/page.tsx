'use client';
import { Column } from '@/components/foundation/Column';
import { Filter } from '@/components/foundation/Filter';
import { externalIcon } from '@/components/foundation/Icons';
import { RichText } from '@/components/foundation/RichText';
import { Row } from '@/components/foundation/Row';
import { Spacer } from '@/components/foundation/Spacer';
import { Title } from '@/components/foundation/Title';
import { PriceDentalFilterItems } from '@/mock/PriceDentalFilterItems';
import { useState } from 'react';
import DentalIcon from '../../../public/assets/dental.svg';
import { PriceDentalCareCard } from './components/PriceDentalCareCard';

const PriceDentalCare = () => {
  const [showEstimateCost, setShowEstimateCost] = useState(false);

  const handleDentalCard = (showEstimateCost: boolean) => {
    setShowEstimateCost(showEstimateCost);
  };
  return (
    <main className="flex flex-col justify-center items-center page">
      <Column className="app-content app-base-font-color">
        <Title className="title-1" text="Price Dental Care" />
        <section className="flex justify-start self-start">
          <RichText
            spans={[
              <Row className="m-4 mb-0" key={0}>
                We&apos;ll help give you a better idea of what your dental care
                will cost. We base these costs on the type of care you need and
                where you live.
              </Row>,
            ]}
          />
        </section>

        <section className="flex flex-row items-start app-body" id="Filter">
          <Column className=" flex-grow page-section-36_67 items-stretch">
            <Filter
              className="small-section px-0 m-0  md:w-[288px] w-auto"
              filterHeading="Filter Dental Costs"
              onReset={() => {}}
              showReset={false}
              onSelectCallback={() => {}}
              buttons={{
                className: 'font-bold',
                type: 'primary',
                label: 'Estimate Cost',
                callback: (value) => {
                  handleDentalCard(value);
                },
              }}
              filterItems={PriceDentalFilterItems}
            />
          </Column>
          <Spacer axis="horizontal" size={32} />
          <Column className="flex-grow page-section-63_33 items-stretch">
            <PriceDentalCareCard
              procedures={[
                {
                  id: '1',
                  label: 'Find a Dentist',
                  body: 'Get started searching for a dentist near you.',
                  icon: DentalIcon,
                  link: externalIcon,
                },
              ]}
              showEstimateCost={showEstimateCost}
            />
          </Column>
        </section>
      </Column>
    </main>
  );
};

export default PriceDentalCare;
