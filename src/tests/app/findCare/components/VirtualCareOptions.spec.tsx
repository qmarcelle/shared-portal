import { VirtualCareOptions } from '@/app/findcare/components/VirtualCareOptions';
import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';

const renderUI = () => {
  return render(
    <VirtualCareOptions
      className="large-section"
      options={[
        {
          id: '1',
          title: 'AbleTo',
          description:
            // eslint-disable-next-line quotes
            "AbleTo's personalized and focused 8-week programs help you with sleep, stress, anxiety and more. Get the help you need.",
          url: 'null',
        },
        {
          id: '3',
          title: 'Hinge Health Back & Joint Care',
          description:
            'You and your eligible family members can get help for back and joint issues with personalized therapy from the comfort of your home.',
          url: 'null',
        },
        {
          id: '4',
          title: 'yyt',
          description: 'xxx',
          url: 'null',
        },
      ]}
    />,
  );
};

describe('VirtualCareOptions', () => {
  it('should render UI correctly', async () => {
    const component = renderUI();

    expect(
      screen.getByRole('heading', { name: 'Virtual Care Options' }),
    ).toBeVisible();
    expect(
      screen.getByText(
        'The following options offer quick, high-quality care for a range of non-emergency needs.',
      ),
    ).toBeVisible();
    expect(
      screen.getByText('Learn More & Compare Virtual Care Options'),
    ).toBeVisible();

    expect(component).toMatchSnapshot();
  });
});
