import VirtualCareOptions from '@/app/virtualCareOptions/page';
import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';

const renderUI = () => {
  return render(<VirtualCareOptions />);
};

describe('VirtualCareOptions Page', () => {
  it('should render UI correctly', async () => {
    const component = renderUI();

    expect(
      screen.getByRole('heading', { name: 'Virtual Care Options' }),
    ).toBeVisible();
    expect(
      screen.getByText(
        'The options below offer quick, high-quality care for a range of non-emergency needs. You can also search for in-network providers that offer in-person and virtual visits with our Find Care tool.',
      ),
    ).toBeVisible();
    expect(
      screen.getByText(
        'In case of a medical emergency, call 911. In case of a mental health crisis, call 988.',
      ),
    ).toBeVisible();

    expect(component).toMatchSnapshot();
  });
});
