import { ShareOutsideMyPlanComponent } from '@/app/shareMyInformation/components/ShareOutsideMyPlanComponent';
import { Column } from '@/components/foundation/Column';
import { Header } from '@/components/foundation/Header';
import { TextBox } from '@/components/foundation/TextBox';
import { AccessStatus } from '@/models/app/getSharePlanDetails';
import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';

const renderUI = () => {
  return render(
    <ShareOutsideMyPlanComponent
      header={
        <Column>
          <Header type="title-2" text="Outside My Plan" />
        </Column>
      }
      subHeader={
        <Column>
          <TextBox text="Share your information with individuals not on your health plan." />
        </Column>
      }
      ShareOutsideMyPlanDetails={[]}
    />,
  );
};

const renderUIWithData = () => {
  return render(
    <ShareOutsideMyPlanComponent
      header={
        <Column>
          <Header type="title-2" text="Outside My Plan" />
        </Column>
      }
      subHeader={
        <Column>
          <TextBox text="Share your information with individuals not on your health plan." />
        </Column>
      }
      ShareOutsideMyPlanDetails={[
        {
          memberName: 'JILL VALENTINE',
          DOB: '01/19/1985',
          accessStatus: AccessStatus.FullAccess,
        },
      ]}
    />,
  );
};

describe('ShareOutsideMyPlanComponent', () => {
  it('should render the UI correctly for ShareOutsideMyPlanComponent - No Users', async () => {
    const component = renderUI();
    expect(component).toMatchSnapshot();
    expect(screen.getByText('Outside My Plan')).toBeVisible();
    expect(
      screen.getByText(
        'Share your information with individuals not on your health plan.',
      ),
    ).toBeVisible();
    expect(
      screen.getByText(
        'You are not sharing your information with individuals ouside of your health plan.',
      ),
    ).toBeVisible();
    expect(screen.getByText('Add an Authorized User')).toBeVisible();
    expect(component).toMatchSnapshot();
  });

  it('should render the UI correctly for ShareOutsideMyPlanComponent - with AU Users', async () => {
    const component = renderUIWithData();
    expect(component).toMatchSnapshot();
    expect(screen.getByText('Outside My Plan')).toBeVisible();
    expect(
      screen.getByText(
        'Share your information with individuals not on your health plan.',
      ),
    ).toBeVisible();
    expect(screen.getByText('Jill Valentine')).toBeVisible();
    expect(screen.getByText('Full Access')).toBeVisible();
    expect(screen.getByText('Remove Access')).toBeVisible();
    expect(screen.getByText('Add an Authorized User')).toBeVisible();
    expect(component).toMatchSnapshot();
  });
});
