'use client';
import { Column } from '@/components/foundation/Column';
import { MemberWellnessCenterOptions } from './Components/MemberWellnessCenterOptions';
import {
  healthAssessmentIcon,
  interactiveProgramsIcon,
  wellnessPointsIcon,
} from '@/components/foundation/Icons';
import { HealthLibraryOptions } from './Components/HealthLibraryOptions';

const MyHealth = () => {
  const MemberWellnessCenterDetails = [
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
  ];
  const HealthLibraryDetails = [
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
  ];
  return (
    <main className="flex flex-col justify-center items-center page">
      <Column className="app-content app-base-font-color">
        <section>
          <MemberWellnessCenterOptions
            className="large-section"
            options={MemberWellnessCenterDetails}
          />
        </section>

        <section>
          <HealthLibraryOptions
            className="large-section"
            options={HealthLibraryDetails}
          />
        </section>
      </Column>
    </main>
  );
};

export default MyHealth;
