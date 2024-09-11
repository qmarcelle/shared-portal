'use client';
import { Column } from '@/components/foundation/Column';
import { Filter } from '@/components/foundation/Filter';
import { externalIcon } from '@/components/foundation/Icons';
import { RichText } from '@/components/foundation/RichText';
import { Row } from '@/components/foundation/Row';
import { Spacer } from '@/components/foundation/Spacer';
import { Title } from '@/components/foundation/Title';
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
              buttons={{
                className: 'font-bold',
                type: 'primary',
                label: 'Estimate Cost',
                callback: (value) => {
                  handleDentalCard(value);
                },
              }}
              filterItems={[
                {
                  type: 'dropdown',
                  label: 'Dental Network',
                  value: [
                    {
                      label: 'Choose Network',
                      value: '1',
                      id: '1',
                    },
                    {
                      label: 'BlueCare Plus',
                      value: '2',
                      id: '2',
                    },
                    {
                      label: 'BlueChoice (HMO)',
                      value: '3',
                      id: '3',
                    },
                    {
                      label: 'In TN & border counties (DentalBlue)',
                      value: '4',
                      id: '4',
                    },
                    {
                      label: 'Outside TN',
                      value: '5',
                      id: '5',
                    },
                  ],
                  selectedValue: {
                    label: 'Choose Network',
                    value: '1',
                    id: '1',
                  },
                },
                {
                  type: 'dropdown',
                  label: 'Category',
                  value: [
                    {
                      label: 'Select Category',
                      value: '1',
                      id: '1',
                    },
                    {
                      label: 'Exams',
                      value: '2',
                      id: '2',
                    },
                    {
                      label: 'Fluoride',
                      value: '3',
                      id: '3',
                    },
                    {
                      label: 'Cleanings',
                      value: '4',
                      id: '4',
                    },
                    {
                      label: 'X-rays',
                      value: '5',
                      id: '5',
                    },
                    {
                      label: 'Sealants',
                      value: '3',
                      id: '3',
                    },
                    {
                      label: 'Space Maintainer Bilateral',
                      value: '6',
                      id: '6',
                    },
                    {
                      label: 'Fillings',
                      value: '7',
                      id: '7',
                    },
                    {
                      label: 'Crowns and related services',
                      value: '8',
                      id: '8',
                    },
                    {
                      label: 'Periodontal Surgery and related services ',
                      value: '9',
                      id: '9',
                    },
                    {
                      label: 'Dentures and related services',
                      value: '10',
                      id: '10',
                    },
                    {
                      label: 'Extractions-Simple and Surgical',
                      value: '11',
                      id: '11',
                    },
                    {
                      label: 'Fixed Bridge',
                      value: '12',
                      id: '12',
                    },
                    {
                      label: 'Endodontics',
                      value: '13',
                      id: '13',
                    },
                  ],
                  selectedValue: {
                    label: 'Select Category',
                    value: '1',
                    id: '1',
                  },
                },
                {
                  type: 'dropdown',
                  label: 'Procedure',
                  value: [
                    {
                      label: 'Select Procedure',
                      value: '1',
                      id: '1',
                    },
                    {
                      label: 'Topical fluoride varnish',
                      value: '2',
                      id: '2',
                    },
                  ],
                  selectedValue: {
                    label: 'Select Procedure',
                    value: '1',
                    id: '1',
                  },
                },
                { type: 'input', label: 'Zip Code', value: '' },
              ]}
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
