import { PharmacyFAQInformation } from '@/app/pharmacy/components/PharmacyFAQInformation';
import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';

const renderUI = () => {
  return render(
    <PharmacyFAQInformation
      answerline1="To see a list of all the prescription drugs your plan
              covers, go to the Check Drug Cost & Coverage page on your caremark.com account."
      answerline2="You can also view or download a pdf formulary."
    />,
  );
};

describe('PharmacyFAQInformation', () => {
  it('should render the UI correctly', async () => {
    const component = renderUI();
    expect(
      screen.queryByText(
        'To see a list of all the prescription drugs your plan covers, go to the Check Drug Cost & Coverage page on your caremark.com account.',
      ),
    ).toBeInTheDocument();
    expect(
      screen.getByText('You can also view or download a pdf formulary.'),
    ).toBeInTheDocument();

    expect(component).toMatchSnapshot();
  });
});
