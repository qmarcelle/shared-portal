import { OtherBenefits } from '@/app/virtualCareOptions/components/OtherBenefits';
import { render, screen } from '@testing-library/react';

const renderUI = () => {
  return render(
    <OtherBenefits
      className="large-section"
      options={[
        {
          id: '1',
          title: 'CareTN One-on-One Health Support',
          description:
            'The care management program lets you message a BlueCross nurse or other health professional for support and answers — at no cost to you.',
          url: 'null',
        },
        {
          id: '2',
          title: 'Healthy Maternity',
          description:
            'This program offers personalized pre- and post-natal care, confidential maternity health advice and around-the-clock support to keep you and your baby healthy. ',
          url: 'null',
        },
        {
          id: '3',
          title: 'Teladoc Health Blood Pressure Management Program',
          description:
            'Get a free smart blood pressure monitor, expert tips and action plans and health coaching at no extra cost.',
          url: 'null',
        },
        {
          id: '4',
          title: 'Teladoc Health Diabetes Management Program',
          description:
            'Personalized coaching, unlimited strips, a smart meter, tips and action plans at no extra cost.',
          url: 'null',
        },
        {
          id: '5',
          title: 'Teladoc Health Diabetes Prevention Program',
          description:
            'Get a personal action plan, health coaching and a smart scale at no extra cost.',
          url: 'null',
        },
        {
          id: '6',
          title: 'Teladoc Second Opinion Advice & Support',
          description:
            'Use Teladoc Health to get a second opinion on any diagnosis, treatment or surgery at no extra cost.',
          url: 'null',
        },
        {
          id: '7',
          title: 'QuestSelect™ Low-Cost Lab Testing',
          description:
            'As an independent lab, QuestSelect can make sure you get the lowest price when you need lab testing — even if you have your sample drawn at another provider.',
          url: 'null',
        },
        {
          id: '8',
          title: 'Silver&Fit Fitness Program',
          description:
            'Get healthy with gym memberships, a personalized Get Started Program and a library of digital workout videos.',
          url: 'null',
        },
      ]}
    />,
  );
};

describe('Member Programs and Resources', () => {
  it('should render the UI correctly', async () => {
    const component = renderUI();
    screen.getByText('CareTN One-on-One Health Support');
    screen.getByText(
      'Get a free smart blood pressure monitor, expert tips and action plans and health coaching at no extra cost.',
    );
    screen.getByText('Teladoc Health Diabetes Management Program');
    screen.getByText(
      'Personalized coaching, unlimited strips, a smart meter, tips and action plans at no extra cost.',
    );
    screen.getByText('Teladoc Health Diabetes Prevention Program');
    screen.getByText(
      'Get a personal action plan, health coaching and a smart scale at no extra cost.',
    );
    screen.getByText('Teladoc Second Opinion Advice & Support');
    screen.getByText(
      'Use Teladoc Health to get a second opinion on any diagnosis, treatment or surgery at no extra cost.',
    );
    screen.getByText('Silver&Fit Fitness Program');
    expect(component).toMatchSnapshot();
  });
});
