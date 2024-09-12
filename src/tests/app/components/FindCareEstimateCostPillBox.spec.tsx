import { FindCarePillBox } from '@/app/findcare/components/FindCarePillBox';
import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import Image from 'next/image';
import EstimateCost from '../../../public/assets/Estimate-Cost.svg';

const renderUI = () => {
  return render(
    <FindCarePillBox
      className="md:w-[480px] md:h-[164px] md:my-8 p-4 w-11/12 sm:m-4"
      title="Planning for a procedure? Estimate costs for:"
      icon={<Image src={EstimateCost} className="w-[40px] h-[40px]" alt="" />}
      pillObjects={[
        {
          label: 'Medical',
          callback: () => {
            console.log('Clicked Pill Medical');
          },
        },
        {
          label: 'Dental',
          callback: () => {
            console.log('Clicked Pill Dental');
          },
        },
        {
          label: 'Prescription Drugs',
          callback: () => {
            console.log('Clicked Pill Prescription Drugs');
          },
        },
        {
          label: 'Vision',
          callback: () => {
            console.log('Clicked Pill Vision');
          },
        },
      ]}
    />,
  );
};

describe('FindCarePillBox', () => {
  it('should render UI correctly', () => {
    const component = renderUI();

    screen.getByRole('heading', {
      name: 'Planning for a procedure? Estimate costs for:',
    });

    screen.getByLabelText('Medical');
    screen.getByLabelText('Dental');
    screen.getByLabelText('Prescription Drugs');
    screen.getByLabelText('Vision');

    expect(component.baseElement).toMatchSnapshot();
  });
});
