// import DashboardLoader from '@/app/(protected)/(common)/member/dashboard/components/DashboardLoader';
// import '@testing-library/jest-dom';
// import { screen } from '@testing-library/react';

// const renderUI = async () => {
//   //const page = await DashboardPage();
//   return <DashboardLoader />;
// };

// jest.mock('src/auth', () => ({
//   auth: jest.fn(),
// }));

// describe('DashboardLoader Page', () => {
//   it('should render DashBoard Loader correctly', async () => {
//     const component = renderUI();
//     expect(component.baseElement).toMatchSnapshot();
//     const dashBoardText = screen.queryByText(
//       'Plan: BlueCross BlueShield of Tennessee',
//     );
//     expect(dashBoardText).not.toBeInTheDocument();

//     //expect(component).toMatchSnapshot();
//   });
// });

import DashboardLoader from '@/app/(protected)/(common)/member/dashboard/components/DashboardLoader';
import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';

const renderUI = () => {
  return render(<DashboardLoader />);
};

describe('UnderstandingAccessOnMyPlan', () => {
  it('should render UI correctly', () => {
    const component = renderUI();
    expect(component.baseElement).toMatchSnapshot();
    const dashBoardText = screen.queryByText(
      'Plan: BlueCross BlueShield of Tennessee',
    );
    expect(dashBoardText).not.toBeInTheDocument();
    expect(component.baseElement).toMatchSnapshot();
  });
});
