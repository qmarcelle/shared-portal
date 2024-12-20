import { render, screen } from '@testing-library/react';
import { NotificationSection } from '../../../app/inbox/components/notification/NotificationSection';

const renderUI = () => {
  return render(
    <NotificationSection
      notificationCards={[
        {
          title: 'Important Pharmacy Changes',
          body: 'Read about changes to your pharmacy and prescription coverage.',
          time: '4 mins ago',
          readIndicator: false,
        },
        {
          title: 'FSA Balance Reminder',
          body: 'FSA funds many not carry over, so check your balance by the end of the year.',
          time: '8 months ago',
          readIndicator: true,
        },
      ]}
    />,
  );
};

describe('NotificationSection', () => {
  it('should render UI correctly', () => {
    const component = renderUI();

    screen.getByRole('heading', { name: 'Important Pharmacy Changes' });
    screen.getByText(
      'Read about changes to your pharmacy and prescription coverage.',
    );
    screen.getByText('4 mins ago');

    screen.getByRole('heading', { name: 'FSA Balance Reminder' });

    expect(component.baseElement).toMatchSnapshot();
  });
});
