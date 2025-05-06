import { EmailSuccessFailure } from '@/app/(protected)/(common)/member/support/sendAnEmail/components/EmailSuccessFailure';
import { Column } from '@/components/foundation/Column';
import { Spacer } from '@/components/foundation/Spacer';
import { TextBox } from '@/components/foundation/TextBox';
import { render, screen } from '@testing-library/react';

const renderUI = () => {
  return render(
    <EmailSuccessFailure
      key={2}
      label="Got it!"
      isSuccess={true}
      body={
        <Column className="items-center">
          <TextBox
            className="text-center"
            text="We’re reading your message and will get back to you at:"
          />
          <Spacer size={8} />
          <TextBox className="text-center font-bold" text="test@bcbst.com" />

          <Spacer size={32} />
          <TextBox
            className="text-center"
            text="If it’s a weekend or holiday, please give us a little extra time to reply."
          />
        </Column>
      }
    />,
  );
};

describe('Send an Email Success', () => {
  it('should render the UI correctly', async () => {
    const component = renderUI();

    screen.getByText('Got it!');
    screen.getByText(
      /We’re reading your message and will get back to you at:/i,
    );
    screen.getByText(
      /If it’s a weekend or holiday, please give us a little extra time to reply./i,
    );
    screen.getByText('test@bcbst.com');

    expect(component).toMatchSnapshot();
  });
});
