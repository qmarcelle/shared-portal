import { ProfileInformationCard } from '@/app/profileSettings/components/ProfileInformationCard';
import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';

const renderUI = () => {
  return render(
    <ProfileInformationCard
      name="Chris Hall"
      DOB="01/01/1978"
      phoneNumber="(123) 456-7890"
      email="chall123@gmail.com"
    />,
  );
};

describe('ProfileInformationCard', () => {
  it('should render UI correctly', () => {
    const component = renderUI();

    screen.getByText('Profile Information');
    screen.getByText('Chris Hall');
    screen.getByText('DOB: 01/01/1978');
    screen.getByText('Phone Number');
    screen.getByText('(123) 456-7890');
    screen.getAllByText('Update');
    screen.getByText('Email Address');
    screen.getByText('chall123@gmail.com');
    screen.getByText('Other Profile Settings');
    screen.getByText(
      'Add or update details about yourself, including ethnicity, race and language preferences.',
    );

    expect(component.baseElement).toMatchSnapshot();
  });
});
