import PlanDocuments from '@/app/benefits/planDocuments/page';
import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';

const renderUI = () => {
  return render(
    <>
      <PlanDocuments />
    </>,
  );
};

describe('planDocuments', () => {
  it('should render the UI correctly', async () => {
    const component = renderUI();
    expect(screen.getByText('Plan Documents')).toBeVisible();
    const text =
      'We’ve put together quick-reference guides that explain your plan details and help you get the most from your benefits.';
    expect(text).toContain(
      'We’ve put together quick-reference guides that explain your plan details and help you get the most from your benefits.',
    );
    expect(screen.getByText('Request Printed Material')).toBeVisible();
    expect(
      screen.getByText('Ask us to mail your plan documents to you.'),
    ).toBeVisible();
    expect(component).toMatchSnapshot();
  });
});
