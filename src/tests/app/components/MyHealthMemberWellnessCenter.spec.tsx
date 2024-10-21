import { MemberWellnessCenterOptions } from '@/app/myHealth/components/MemberWellnessCenterOptions';
import {
    healthAssessmentIcon,
    interactiveProgramsIcon,
    wellnessPointsIcon,
} from '@/components/foundation/Icons';
import { render, screen } from '@testing-library/react';

const renderUI = () => {
  return render(
    <MemberWellnessCenterOptions
      className="large-section"
      options={[
        {
          id: '1',
          title: 'Your Health Assessment',
          description:
            'Your personal health assessment is the starting point for your wellness program, and the key to helping us provide a more personalized experience for you.',
          url: '#path-1',
          icon: healthAssessmentIcon,
        },
        {
          id: '2',
          title: 'Earn Wellness Points',
          description:
            'Choose from a variety of activities, including tracking your steps, completing the wellness class form, or running a 5K.',
          url: '#path-1',
          icon: wellnessPointsIcon,
        },
        {
          id: '3',
          title: 'Interactive Programs',
          description:
            'Set a goal and create healthy habits to achieve your goal. Programs include staying tobacco free, maintaining a healthy weight, and more!',
          url: '#path-1',
          icon: interactiveProgramsIcon,
        },
      ]}
    />,
  );
};

describe('MemberWellnessCenterOptions', () => {
  it('should render the UI correctly', async () => {
    const component = renderUI();
    screen.getByText('Member Wellness Center');
    screen.getByText(
      'Take a free personal health assessment, track your diet and exercise, sync your fitness apps to earn wellness points and more—all in one secure place.',
    );
    screen.getByText('Your Health Assessment');
    screen.getByText('Earn Wellness Points');
    screen.getByText('Interactive Programs');
    screen.getByText(
      'Your personal health assessment is the starting point for your wellness program, and the key to helping us provide a more personalized experience for you.',
    );
    screen.getByText(
      'Choose from a variety of activities, including tracking your steps, completing the wellness class form, or running a 5K.',
    );
    screen.getByText(
      'Set a goal and create healthy habits to achieve your goal. Programs include staying tobacco free, maintaining a healthy weight, and more!',
    );
    screen.getByText('Visit Member Wellness Center');
    expect(component).toMatchSnapshot();
  });
});
