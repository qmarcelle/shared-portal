import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import Image from 'next/image';
import { PillBox } from '../../../app/(main)/dashboard/components/PillBox';
import FindCare from '../../public/Find-Care.svg';

const renderUI = () => {
  return render(
    <PillBox
      title="Looking for Care? Find A:"
      icon={
        <Image
          src={FindCare}
          className="icon w-[50px] h-[50px]"
          alt="Find Care"
        />
      }
      pillObjects={[
        {
          label: 'Primary Care Provider',
          callback: () => {
            console.log('Clicked Pill PCP');
          },
        },
        {
          label: 'Dentist',
          callback: () => {
            console.log('Clicked Pill Dentist');
          },
        },
        {
          label: 'Mental Health Provider',
          callback: () => {
            console.log('Clicked Pill Mental Health Provider');
          },
        },
        {
          label: 'Eye Doctor',
          callback: () => {
            console.log('Clicked Pill Eye Doctor');
          },
        },
        {
          label: 'Pharmacy',
          callback: () => {
            console.log('Clicked Pill Pharmacy');
          },
        },
        {
          label: 'Virtual Care',
          callback: () => {
            console.log('Clicked Pill Virtual Care');
          },
        },
      ]}
    ></PillBox>,
  );
};

describe('PillBox', () => {
  it('should render UI correctly', () => {
    const component = renderUI();

    screen.getAllByAltText(/Find Care/i);
    screen.getByRole('heading', { name: 'Looking for Care? Find A:' });

    screen.getByLabelText('Primary Care Provider');
    screen.getByLabelText('Dentist');
    screen.getByLabelText('Mental Health Provider');
    screen.getByLabelText('Eye Doctor');
    screen.getByLabelText('Pharmacy');
    screen.getByLabelText('Virtual Care');

    expect(component.baseElement).toMatchSnapshot();
  });
});
