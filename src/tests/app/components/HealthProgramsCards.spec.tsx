import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import { VirtualMentalHealthCareSection } from '../../../app/mentalHealthOptions/components/VirtualMentalHealthCareSection';

const renderUI = () => {
  return render(
    <VirtualMentalHealthCareSection
      mentalHealthCareOptions={[
        {
          healthcareType: 'Advice & Support',
          icon: 'Alight',
          healthCareName: 'Alight Second Opinion Advice & Support',
          description:
            'Use My Medical Ally to get a second medical opinion on a diagnosis or recommended surgery at no extra cost.',
          link: 'Learn More About Alight',
          itemDataTitle: 'Generally good for:',
          itemData: [
            'Speaking with an expert about your diagnosis',
            'Rare or life-threatening condition support',
            'Considering risky or complicated treatment',
            'Compare costs of treatment or tests',
          ],
        },
        {
          healthcareType: 'Advice & Support',
          icon: 'CareTN',
          healthCareName: 'CareTN One-on-One Health Support',
          description:
            // eslint-disable-next-line quotes
            'Did you know you can talk to your very own care team? The care management program lets you message a BlueCross nurse or other health professional for support and answers — at no cost to you.',
          link: 'Learn More About CareTN',
          itemDataTitle: 'Generally good for:',
          itemData: [
            'Living with long-term health conditions',
            'Diabetes',
            'Respiratory health',
            'Mental health',
          ],
        },
        {
          healthcareType: 'Blood Pressure',
          icon: 'TelaDoc',
          healthCareName: 'Teladoc Health Blood Pressure Management Program',
          description:
            // eslint-disable-next-line quotes
            'Get a free smart blood pressure monitor, expert tips and action plans and health coaching at no extra cost.',
          link: 'Learn More About Blood Pressure Management',
          itemDataTitle: 'Generally good for:',
          itemData: [
            'High blood pressure management',
            'Meal planning',
            'Building healthy habits',
          ],
        },
      ]}
    />,
  );
};

describe('VirtualMentalHealthCareSection', () => {
  it('should render the UI correctly', async () => {
    const component = renderUI();
    screen.getByText('Alight Second Opinion Advice & Support');
    screen.getByAltText(/Alight/i);
    screen.getByAltText(/CareTN/i);
    screen.getByAltText(/Teladoc/i);
    screen.getByText(
      'Use My Medical Ally to get a second medical opinion on a diagnosis or recommended surgery at no extra cost.',
    );
    screen.getByText('Speaking with an expert about your diagnosis');
    screen.getByText('Compare costs of treatment or tests');
    screen.getByText('CareTN One-on-One Health Support');
    screen.getByText('Respiratory health');
    screen.getByText('Teladoc Health Blood Pressure Management Program');
    screen.getByText('High blood pressure management');
    screen.getByText('Living with long-term health conditions');

    screen.getByText('Diabetes');
    screen.getByText(
      // eslint-disable-next-line quotes
      'Get a free smart blood pressure monitor, expert tips and action plans and health coaching at no extra cost.',
    );

    expect(component).toMatchSnapshot();
  });
});
