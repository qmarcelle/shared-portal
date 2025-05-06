import SendEmailForm from '@/app/(protected)/(common)/member/support/sendAnEmail/components/SendEmailForm';
import { fireEvent, render, screen } from '@testing-library/react';

const renderUI = () => {
  return render(
    <SendEmailForm
      topicsDropdown={[
        {
          label: 'Select',
          value: '43',
          id: '1',
        },
        {
          label: 'Benefits & Coverage',
          value: '2',
          id: '2',
        },
        {
          label: 'New or Existing Claims',
          value: '3',
          id: '3',
        },
        {
          label: 'Deductibles',
          value: '4',
          id: '4',
        },
        {
          label: 'Pharmacy & Prescriptions',
          value: '5',
          id: '5',
        },
        {
          label: 'Find Care',
          value: '6',
          id: '6',
        },
        {
          label: 'Dental',
          value: '7',
          id: '7',
        },
        {
          label: 'Membership & Billing Questions',
          value: '8',
          id: '8',
        },
        {
          label: 'Other',
          value: '9',
          id: '9',
        },
      ]}
      onSelectedDateChange={() => {}}
      selectedtopic={{
        label: 'Select',
        value: '43',
        id: '1',
      }}
      nameDropdown={[
        {
          label: 'Chris Hall',
          value: '43',
          id: '1',
        },
        {
          label: 'John',
          value: '2',
          id: '2',
        },
      ]}
      selectedName={{
        label: 'Chris Hall',
        value: '43',
        id: '1',
      }}
      email={''}
      phone={''}
    />,
  );
};

describe('Send an Email', () => {
  it('should render the UI correctly', async () => {
    const component = renderUI();

    screen.getByRole('heading', {
      name: 'Email Form',
    });
    screen.getByText('Fill out the form below to send us your message.');
    screen.getByText(/We'll send an email reply to:/i);
    screen.getByText(
      /Changing this email won't change the email we have on file./i,
    );
    screen.getByText('Who do you need to discuss?');
    screen.getByText('What can we help you with?');

    fireEvent.click(screen.getByText('Chris Hall'));
    screen.getByText('John');

    fireEvent.click(screen.getByText('Select'));
    screen.getByText('Benefits & Coverage');

    expect(component).toMatchSnapshot();
  });
});
