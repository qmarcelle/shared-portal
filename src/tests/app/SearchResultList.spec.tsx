import { SearchResultList } from '@/app/searchResults/components/SearchResultList';
import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';

const resultList = [
  {
    title: '508C Telehealth and Telephonic/Audio-Only Services',
    description: 'Telehealth and Telephonic/Audio-Only Services',
  },
  {
    title: 'Mobile Apps | BlueCross BlueShield of Tennessee',
    description:
      ', telehealth, and provider search with cost estimates -- all from your mobile device.',
  },
  {
    title: 'Use Your Health Insurance Plan | BlueCross BlueShield of Tennessee',
    description:
      'Manage your BCBS of Tennessee health insurance plans, login to your account and use our cost estimator tools to help you understand various health insurance coverage options.',
  },
  {
    title: 'Find a Doctor Near You | BlueCross BlueShield of Tennessee',
    description:
      'Search for a doctor, hospital, dental and vision providers or pharmacies in your area. You can search by specialty, location or network to find the healthcare provider that meets your needs. ',
  },
  {
    title: 'Get Healthcare Near You | BlueCross BlueShield of Tennessee',
    description:
      'Find a doctor, pharmacy or other healthcare and wellness providers in your area.',
  },
  {
    title: '508C Frequently Asked Questions',
    description: 'Frequently Asked Questions',
  },
  {
    title:
      '508C REVISION -Update to Stand-alone Vaccine Counseling (replaces March 15, 2023 memo)',
    description:
      'REVISION -Update to Stand-alone Vaccine Counseling (replaces March 15, 2023 memo)',
  },
  {
    title: 'Healthymom | Providers | BlueCare Tennessee',
    description:
      'Helpful resources to assist with language interpretation when talking to your patients. *These resources are NOT affiliated with or endorsed by BlueCare Tennessee. Fees for their services may apply.',
  },
  {
    title:
      'Individual and Family Health Insurance Plans | BlueCross BlueShield of Tennessee',
    description:
      'We have a wide range of health insurance plans for you and your family, with premiums as low as $0. Protect yourself and your family with free quotes and easy enrollment.',
  },
  {
    title: 'BlueCross BlueShield of Tennessee Health Insurance',
    description:
      'Learn more about BlueCross BlueShield of Tennessee (BCBST) health insurance and the medical, dental and vision plans we offer for employers, individuals and families.',
  },
];

const setupUI = () => {
  return render(<SearchResultList searchResults={resultList} />);
};

describe('Search Results List', () => {
  it('should render all the required components', () => {
    const component = setupUI();
    expect(screen.getAllByRole('img').length).toBe(10);
    expect(component).toMatchSnapshot();
  });
});
