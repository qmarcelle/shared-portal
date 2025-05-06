/* eslint-disable quotes */
import EnrollmentForm from '@/app/(protected)/(common)/member/healthyMaternity/components/EnrollmentForm';
import '@testing-library/jest-dom';
import { fireEvent, render, screen } from '@testing-library/react';

const renderUI = () => {
  return render(<EnrollmentForm accessCode="BlueAccess" />);
};

describe('EnrollmentForm Section', () => {
  it('should render the UI correctly', async () => {
    const component = renderUI();
    expect(screen.getByText('Member Information')).toBeVisible();
    expect(
      screen.getByText('Please confirm your details below.'),
    ).toBeVisible();
    expect(
      screen.getByText(
        "By checking this box I agree to BlueCross, its affiliates and its service providers sending me communications via email. Unencrypted email may possibly be intercepted and read by people other than those it's addressed to.",
      ),
    );
    fireEvent.click(screen.getByRole('button', { name: /Next/i }));
    expect(
      screen.getByText(
        "You'll need a compatible Apple or Android mobile device. Your nurse may call you but most of the time they'll message you through the app.",
      ),
    ).toBeVisible();
    expect(screen.getByText('Preferred Contact Method')).toBeVisible();
    expect(
      screen.getByText(
        'I prefer that my healthy maternity nurse contacts me via:',
      ),
    ).toBeVisible();
    expect(screen.getByText('Phone call')).toBeVisible();
    expect(
      screen.getByText('Your nurse will call you during your pregnancy.'),
    ).toBeVisible();
    fireEvent.click(screen.getByRole('button', { name: /Next/i }));
    expect(
      screen.getByText("You're Enrolled in the Healthy Maternity Program"),
    ).toBeVisible();
    expect(
      screen.getByText(
        "We'll review your information and a nurse will reach out to you soon.",
      ),
    ).toBeVisible();
    expect(component).toMatchSnapshot();
  });
});
