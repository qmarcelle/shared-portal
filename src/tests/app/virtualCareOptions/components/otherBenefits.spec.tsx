import { OtherBenefits } from '@/app/(protected)/(common)/member/virtualCareOptions/components/OtherBenefits';
import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';

const renderUI = () => {
  return render(
    <OtherBenefits
      className="large-section"
      options={[
        {
          id: '1',
          title: 'Alight Second Opinion Advice & Support',
          description:
            'Use My Medical Ally to get a second medical opinion on a diagnosis or recommended surgery at no extra cost. ',
          url: 'null',
        },
        {
          id: '2',
          title: 'CareTN One-on-One Health Support ',
          description:
            'The care management program lets you message a BlueCross nurse or other health professional for support and answers — at no cost to you.',
          url: 'null',
        },
        {
          id: '3',
          title: 'Healthy Maternity',
          description:
            'This program offers personalized pre- and post-natal care, confidential maternity health advice and around-the-clock support to keep you and your baby healthy. ',
          url: 'null',
        },
        {
          id: '4',
          title: 'Test',
          description: 'THis is test card.',
          url: 'null',
        },
      ]}
    />,
  );
};

describe('Other Benefits', () => {
  it('should render UI correctly', async () => {
    const component = renderUI();

    expect(
      screen.getByRole('heading', { name: 'Health Programs & Resources' }),
    ).toBeVisible();
    expect(
      screen.getByText(
        'Your plan includes programs, guides and discounts to help make taking charge of your health easier and more affordable.',
      ),
    ).toBeVisible();
    expect(
      screen.getByText('View All Health Programs & Resources'),
    ).toBeVisible();

    expect(component).toMatchSnapshot();
  });
});
