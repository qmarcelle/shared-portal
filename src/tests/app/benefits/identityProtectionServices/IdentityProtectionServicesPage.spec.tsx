import IdentityProtectionServices from '@/app/(common)/myplan/benefits/identityProtectionServices/page';
import '@testing-library/jest-dom';
import { fireEvent, render, screen } from '@testing-library/react';

const renderUI = () => {
  return render(<IdentityProtectionServices />);
};

describe('Identity Protection Services', () => {
  it('should render UI correctly', () => {
    const component = renderUI();
    expect(screen.getByText('About Identity Protection')).toBeVisible();
    expect(
      screen.queryByText(
        'To re-enroll, select the plan and follow the steps. Remember to re-enroll all covered members.',
      ),
    ).not.toBeInTheDocument();
    fireEvent.click(screen.getByText('How to Re-enroll'));
    expect(
      screen.getByText(
        'To re-enroll, select the plan and follow the steps. Remember to re-enroll all covered members.',
      ),
    ).toBeVisible();
    expect(screen.getByText('Enrollment Options')).toBeVisible();
    expect(component.baseElement).toMatchSnapshot();
  });
});
