import CareTNProgramLanding from '@/app/myHealthPrograms/components/CareTNProgramLanding';
import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';

const renderUI = () => {
  return render(
    <>
      <CareTNProgramLanding accessCodeData={''} />
    </>,
  );
};

describe('CareTN Program Landing Page', () => {
  it('should render Header Card section correctly', () => {
    const component = renderUI();
    expect(
      screen.getByRole('heading', { name: 'CareTN One-on-One Health Support' }),
    ).toBeVisible();
    screen.getByText(
      'Did you know you can talk to your very own care team? The CareTN program lets you message a nurse or other health professional for support and answers — at no cost to you.',
    );
    screen.getByText(
      'Download the CareTN app, and we’ll contact you after you register.',
    );
    expect(component.baseElement).toMatchSnapshot();
  });

  it('should render Program Benefits section correctly', () => {
    const component = renderUI();
    screen.getByText('Program Benefits');
    screen.getByText('Make Wellness a Habit');
    screen.getByText('One-on-One Support');
    screen.getByText('Get Personalized Content');
    screen.getByText(
      'Create reminders about health-related activities so you never miss a beat. Use a daily checklist to make healthy choices part of your routine.',
    );
    screen.getByText(
      'Get personalized help, health plan information, answers to your questions or just a little encouragement.',
    );
    screen.getByText('Watch videos our nurses recommend just for you.');

    expect(component.baseElement).toMatchSnapshot();
  });

  it('should render Process Steps UI correctly', () => {
    const component = renderUI();
    screen.getByText(
      // eslint-disable-next-line quotes
      "We're Here to Help",
    );
    screen.getByText(
      // eslint-disable-next-line quotes
      "Message your care team anytime it's convenient for you. Got a question at 3 a.m.? Let us know — don't let it slip your mind. If you contact us after hours, we'll get back to you the next business day.",
    );
    screen.getByText('Get Started with CareTN in 3 Easy Steps');
    screen.getByText('Download the App');
    screen.getByText('Scan the QR Code with your smartphone’s camera.');
    screen.getByText('Enter Access Code');
    screen.getByText(
      'Open the app on your device, tap “Sign-up” and enter your access code.',
    );
    screen.getByText('Register In The App');
    screen.getByText('Follow the directions to register in the CareTN app.');
    screen.getByText(
      'Wellframe is an independent company that provides services for BlueCross BlueShield of Tennessee.',
    );
    screen.getByText('Participation is optional.');
    expect(component.baseElement).toMatchSnapshot();
  });
});
