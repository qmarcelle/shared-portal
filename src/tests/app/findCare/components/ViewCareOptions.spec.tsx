import { ViewCareOptions } from '@/app/(protected)/(common)/member/findcare/components/ViewCareOptions';
import { render, screen } from '@testing-library/react';
import Image from 'next/image';
import MentalCareIcon from '/assets/mental_health.svg';
import PrimaryCareIcon from '/assets/primary_care.svg';

// Mock useRouter:
const mockReplace = jest.fn();
jest.mock('next/navigation', () => ({
  useRouter() {
    return {
      prefetch: () => null,
      replace: mockReplace,
    };
  },
}));

const renderUI = () => {
  return render(
    <ViewCareOptions
      className="large-section"
      options={[
        {
          title: 'Primary Care Options',
          description:
            'Learn more about Primary Care Providers and view your options.',
          image: (
            <Image
              className="max-md:w-[80px] max-md:h-[80px]"
              src={PrimaryCareIcon}
              alt="Primary Care"
            />
          ),
          url: '/findcare/primaryCareOptions',
        },
        {
          title: 'Mental Care Options',
          description:
            'Learn more about Mental Health Providers and view your options.',
          image: (
            <Image
              className="max-md:w-[80px] max-md:h-[80px]"
              src={MentalCareIcon}
              alt="Mental Care"
            />
          ),
          url: '',
        },
      ]}
    />,
  );
};

describe('ViewCareOptions', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should render UI correctly', () => {
    const component = renderUI();

    // screen.getByRole('heading', { name: 'View Care Options' })
    screen.getByText('View Care Options');

    screen.getByText('Primary Care Options');
    screen.getByText(
      'Learn more about Primary Care Providers and view your options.',
    );
    screen.getByAltText(/Primary Care/i);

    screen.getByText('Mental Care Options');
    screen.getByText(
      'Learn more about Mental Health Providers and view your options.',
    );
    screen.getByAltText(/Mental Care/i);

    expect(component.baseElement).toMatchSnapshot();
  });
});
