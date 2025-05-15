import { AccessToOthersPlanComponent } from '@/app/accessOthersInformation/components/AccessToOthersPlanComponent';
import { Column } from '@/components/foundation/Column';
import { Header } from '@/components/foundation/Header';
import { TextBox } from '@/components/foundation/TextBox';
import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';

const renderUI = () => {
  render(
    <AccessToOthersPlanComponent
      header={
        <Column>
          <Header type="title-2" text="Others' Plans" />
        </Column>
      }
      subHeader={
        <Column>
          <TextBox text="Below is the access granted to you to other member's plan information." />
        </Column>
      }
      infoIcon={false}
      accessOtherPlanDetails={[
        {
          memberName: 'Ellie Williams',
          dob: '01/01/1993',
          otherPlanData: [
            {
              planName: 'BlueCross BlueShield of Tennessee',
              subscriber: 'Ellie Williams',
              id: 'ABC1234567890',
              policies: 'Medical, Vision, Dental',
            },
          ],
        },
      ]}
    />,
  );
};

describe('AccessToOthersPlanComponent', () => {
  it('should render the UI correctly', async () => {
    const component = renderUI();
    expect(screen.getByText(/Others' Plans/i)).toBeInTheDocument();
    expect(
      screen.getByText(
        /Below is the access granted to you to other member's plan information./i,
      ),
    ).toBeInTheDocument();
    expect(screen.getByText('Ellie Williams')).toBeInTheDocument();
    expect(screen.getByText('DOB: 01/01/1993')).toBeInTheDocument();
    expect(
      screen.getByText('Bluecross Blueshield Of Tennessee'),
    ).toBeInTheDocument();
    expect(screen.getByText('Subscriber: Ellie Williams')).toBeInTheDocument();
    expect(screen.getByText('ID: ABC1234567890')).toBeInTheDocument();
    expect(
      screen.getByText('Policies: Medical, Vision, Dental'),
    ).toBeInTheDocument();

    expect(component).toMatchSnapshot();
  });
});
