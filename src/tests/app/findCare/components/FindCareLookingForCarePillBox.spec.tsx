import { FindCarePillBox } from '@/app/(protected)/(common)/member/findcare/components/FindCarePillBox';
import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import Image from 'next/image';
import findCareIcon from '/assets/find_care_search.svg';

const renderUI = () => {
  return render(
    <FindCarePillBox
      className="md:w-[480px] md:h-[200px] md:my-8 p-4 w-11/12 sm:m-4"
      title="Looking for care? Find a:"
      icon={<Image src={findCareIcon} className="w-[40px] h-[40px]" alt="" />}
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
    />,
  );
};

describe('FindCarePillBox', () => {
  it('should render UI correctly', () => {
    const component = renderUI();

    screen.getByRole('heading', {
      name: 'Looking for care? Find a:',
    });

    screen.getByLabelText('Primary Care Provider');
    screen.getByLabelText('Dentist');
    screen.getByLabelText('Mental Health Provider');
    screen.getByLabelText('Eye Doctor');
    screen.getByLabelText('Pharmacy');
    screen.getByLabelText('Virtual Care');
    expect(component.baseElement).toMatchSnapshot();
  });
});
