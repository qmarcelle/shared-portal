/* eslint-disable quotes */
import { FaqTopics } from '@/app/support/faqTopics/components/FaqTopics';
import { fireEvent, render, screen } from '@testing-library/react';

const renderUI = () => {
  return render(<FaqTopics />);
};

describe('Prior Authorization FAQ', () => {
  it('should render the UI correctly', async () => {
    const component = renderUI();
    const priorAuth = screen.getByRole('button', {
      name: 'Prior Authorization',
    });

    fireEvent.click(priorAuth);
    screen.getByText('Learn more about prior authorizations and statuses.');

    screen.getByRole('heading', {
      name: 'Understanding Prior Authorization',
    });
    screen.getByText('What is a prior authorization?');
    fireEvent.click(screen.getByText('What is a prior authorization?'));
    screen.getByText(
      "Prior authorization is a process that ensures any prescribed treatments or drugs are appropriate and safe. Prior authorizations require your health provider to get approval from your health insurance plan. It's also known as preauthorization or pre-certification.",
    );

    screen.getByText('How do I get a prior authorization?');
    fireEvent.click(screen.getByText('How do I get a prior authorization?'));
    screen.getByText(
      'If your doctor prescribes a treatment that needs prior authorization, they’ll ask us for one when they write your treatment plan. We’ll review the case, make sure the treatment is appropriate and safe, and make a decision. If it’s approved, we’ll send you a letter to let you know.',
    );

    screen.getByRole('heading', {
      name: 'Help with Prior Authorization Status',
    });
    screen.getByText('What does the status of my prior authorizations mean?');
    fireEvent.click(
      screen.getByText('What does the status of my prior authorizations mean?'),
    );
    screen.getByText(
      'Prior authorizations can have one of three statuses: approved, partially approved or denied. Approved means that your health plan agrees with your doctor that the medical service or prescription drug is necessary and safe. Partially approved means that your health plan has concerns about the safety or need of part of your request. Denied means that your health plan does not agree with your doctor that a medical service or prescription drug is necessary or safe.',
    );

    screen.getByText('My prior authorization was approved. What do I do next?');
    fireEvent.click(
      screen.getByText(
        'My prior authorization was approved. What do I do next?',
      ),
    );
    screen.getByText(
      'If your request was approved, move forward with the medical service or drug as your doctor instructed.',
    );

    screen.getByText(
      'What can I do if my prior authorization is partially approved or denied?',
    );

    fireEvent.click(
      screen.getByText(
        'What can I do if my prior authorization is partially approved or denied?',
      ),
    );

    screen.getByText(
      "I'm expecting a prior authorization. Where are all my prior authorizations?",
    );

    fireEvent.click(
      screen.getByText(
        "I'm expecting a prior authorization. Where are all my prior authorizations?",
      ),
    );

    screen.getByRole('heading', {
      name: 'Other FAQ Topics',
    });
    screen.getByText('Benefits & Coverage');
    screen.getByText('Claims');
    screen.getByText('ID Cards');
    screen.getByText('My Plan Information');
    screen.getByText('Pharmacy');
    screen.getByText('Prior Authorization');
    screen.getByText('Security');

    expect(component.container).toMatchSnapshot();
  });
});
