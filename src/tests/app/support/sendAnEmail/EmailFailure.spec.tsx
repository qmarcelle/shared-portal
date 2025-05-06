import { EmailSuccessFailure } from '@/app/(protected)/(common)/member/support/sendAnEmail/components/EmailSuccessFailure';
import { Column } from '@/components/foundation/Column';
import { TextBox } from '@/components/foundation/TextBox';
import { render, screen } from '@testing-library/react';

const renderUI = () => {
  return render(
    <EmailSuccessFailure
      key={1}
      label="Try Again Later"
      isSuccess={false}
      body={
        <Column className="items-center">
          <TextBox
            className="text-center"
            text="We're sorry, something went wrong. Please try again later."
          />
        </Column>
      }
    />,
  );
};

describe('Send an Email Success', () => {
  it('should render the UI correctly', async () => {
    const component = renderUI();

    screen.getByText('Try Again Later');
    screen.getByText(
      /We're sorry, something went wrong. Please try again later./i,
    );

    expect(component).toMatchSnapshot();
  });
});
