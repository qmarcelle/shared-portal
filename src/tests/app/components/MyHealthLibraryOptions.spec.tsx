import { HealthLibraryOptions } from '@/app/(protected)/(common)/member/myhealth/components/HealthLibraryOptions';
import { render, screen } from '@testing-library/react';

const renderUI = () => {
  return render(
    <HealthLibraryOptions
      className="large-section"
      options={[
        {
          id: '1',
          title: 'Learning Center',
          description:
            'Get more information about specific health terms, topics and conditions to better manage your health.',
          url: '#path-1',
          icon: null,
        },
        {
          id: '2',
          title: 'Interactive Tools',
          description:
            'Our personal calculators and short quizzes make it easier for you to learn more about your health from knowing your BMI to managing stress.',
          url: '#path-1',
          icon: null,
        },
        {
          id: '3',
          title: 'Health Videos',
          description:
            'Find out about health-related topics with our extensive selection of videos featuring general wellness, specific conditions and more.',
          url: '#path-1',
          icon: null,
        },
        {
          id: '4',
          title: 'Symptom Checker',
          description:
            'Get more reliable information about the symptom you’re experiencing to help find the care you need.',
          url: '#path-1',
          icon: null,
        },
        {
          id: '5',
          title: 'Manage Your Diabetes',
          description:
            'Get the information you need and stay up-to-date on tests using our resources to help manage your diabetes.',
          url: '#path-1',
          icon: null,
        },
        {
          id: '6',
          title: 'Decision Support',
          description:
            'We’ll help you get the facts, ask the right questions and weigh your options before making any health decision, big or small.',
          url: '#path-1',
          icon: null,
        },
      ]}
    />,
  );
};

describe('MyHealthLibraryOptions', () => {
  it('should render the UI correctly', async () => {
    const component = renderUI();
    screen.getByText('Health Library');
    screen.getByText(
      'From checking symptoms to answering your health questions, we have a collection of useful tools and resources to help you manage your health.',
    );
    screen.getByText('Learning Center');
    screen.getByText(
      'Get more information about specific health terms, topics and conditions to better manage your health.',
    );
    screen.getByText('Interactive Tools');
    screen.getByText(
      'Our personal calculators and short quizzes make it easier for you to learn more about your health from knowing your BMI to managing stress.',
    );
    screen.getByText('Health Videos');
    screen.getByText(
      'Find out about health-related topics with our extensive selection of videos featuring general wellness, specific conditions and more.',
    );
    screen.getByText('Symptom Checker');
    screen.getByText(
      'Get more reliable information about the symptom you’re experiencing to help find the care you need.',
    );
    screen.getByText('Manage Your Diabetes');
    screen.getByText(
      'Get the information you need and stay up-to-date on tests using our resources to help manage your diabetes.',
    );
    screen.getByText('Decision Support');
    screen.getByText(
      'We’ll help you get the facts, ask the right questions and weigh your options before making any health decision, big or small.',
    );
    screen.getByText('Visit The Health Library');
    expect(component).toMatchSnapshot();
  });
});
