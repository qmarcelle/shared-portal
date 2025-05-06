import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import { VirtualMentalHealthCareSection } from '../../../../app/(protected)/(common)/member/mentalHealthOptions/components/VirtualMentalHealthCareSection';

const renderUI = () => {
  return render(
    <VirtualMentalHealthCareSection
      mentalHealthCareOptions={[
        {
          healthcareType: 'Mental Health',
          icon: 'TelaDoc',
          healthCareName: 'Teladoc Mental Health',
          description:
            'Speak with a therapist, psychologist or psychiatrist seven days a week from anywhere.',
          link: 'Learn More About Teladoc Mental Health',
          itemDataTitle: '',
          itemData: [
            'Anxieties',
            'Stress',
            'feeling overwhelmed',
            'Relationship conflicts',
            'Depression',
            'Trauma and PTSD',
          ],
        },
        {
          healthcareType: '',
          icon: 'AbleToIcon',
          healthCareName: 'AbleTo',
          description:
            // eslint-disable-next-line quotes
            "AbleTo's personalized and focused 8-week programs help you with sleep, stress, anxiety and more. Get the help you need",
          link: 'Learn More About AbleTo',
          itemDataTitle: 'Generally good for:',
          itemData: ['Anxiety', 'Grief'],
        },
      ]}
    />,
  );
};

describe('VirtualMentalHealthCareSection', () => {
  it('should render the UI correctly', async () => {
    const component = renderUI();
    screen.getByText('Mental Health');
    screen.getByText('Teladoc Mental Health');
    screen.getByAltText(/TelaDoc/i);
    screen.getByText(
      'Speak with a therapist, psychologist or psychiatrist seven days a week from anywhere.',
    );
    screen.getByText('Learn More About Teladoc Mental Health');
    screen.getByText('Anxiety');
    screen.getByText('Stress');
    screen.getByText('feeling overwhelmed');
    screen.getByText('Relationship conflicts');
    screen.getByText('Depression');
    screen.getByText('Trauma and PTSD');

    screen.getByText('AbleTo');
    screen.getByText(
      // eslint-disable-next-line quotes
      "AbleTo's personalized and focused 8-week programs help you with sleep, stress, anxiety and more. Get the help you need",
    );
    screen.getByText('Learn More About AbleTo');
    screen.getByAltText(/AbleToIcon/i);
    screen.getByText('Generally good for:');
    screen.getByText('Depression');
    screen.getByText('Grief');

    expect(component).toMatchSnapshot();
  });
});
