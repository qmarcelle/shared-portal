import SiteHeader from '@/components/foundation/SiteHeader';
import { fireEvent, render, screen } from '@testing-library/react';

const renderUI = () => {
  return render(
    <>
      <SiteHeader />
    </>,
  );
};
const mockReplace = jest.fn();
jest.mock('next/navigation', () => ({
  useRouter() {
    return {
      prefetch: () => null,
      replace: mockReplace,
    };
  },
}));
describe('MenuNavigation', () => {
  it('should render the UI correctly', async () => {
    const component = renderUI();
    fireEvent.click(screen.getAllByText('Pharmacy')[0]);
    expect(
      screen.getByRole('link', { name: 'My Prescriptions External Link' }),
    ).toHaveProperty('href', 'https://www.caremark.com/refillRx?newLogin=yes');

    expect(
      screen.getByRole('link', { name: 'Mail Order External Link' }),
    ).toHaveProperty('href', 'https://www.caremark.com/refillRx?newLogin=yes');

    expect(
      screen.getByRole('link', { name: 'Find a Pharmacy External Link' }),
    ).toHaveProperty(
      'href',
      'https://www.caremark.com/pharmacySearchFast?newLogin=yes',
    );

    expect(
      screen.getAllByRole('link', {
        name: 'Price a Medication External Link',
      })[1],
    ).toHaveProperty(
      'href',
      'https://www.caremark.com/drugSearchInit.do?newLogin=yes',
    );

    expect(component).toMatchSnapshot();
  });
});
