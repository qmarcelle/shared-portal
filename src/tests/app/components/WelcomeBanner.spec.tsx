import { WelcomeBanner } from '../../../components/composite/WelcomeBanner';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';

const element = () => {
  return (
    <div>
      <p className="body-1">Subscriber Id : AC56543456</p>
      <p className="body-1">Group No. : 876765</p>
    </div>
  );
};

const renderUI = () => {
  render(
    <WelcomeBanner
      titleText="Welcome, "
      className="px-4"
      name="James Kilney"
      body={element()}
    />,
  );
};

describe('Welcome Banner', () => {
  it('should render the UI correctly', () => {
    const component = renderUI();

    expect(screen.getByText('Welcome, James Kilney')).toBeVisible();
    expect(screen.getByText('Subscriber Id : AC56543456')).toBeVisible();
    expect(screen.getByText('Group No. : 876765')).toBeVisible();
    expect(component).toMatchSnapshot();
  });
});
