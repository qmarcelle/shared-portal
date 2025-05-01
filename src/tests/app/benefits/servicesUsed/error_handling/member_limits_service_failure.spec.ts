import ServicesUsedPage from '@/app/(common)/myplan/benefits/servicesUsed/page';
import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';

jest.mock('src/auth', () => ({
  auth: jest.fn(() =>
    Promise.resolve({
      user: {
        currUsr: {
          plan: { memCk: '123456789', grpId: '87898', sbsbCk: '654567656' },
        },
      },
    }),
  ),
}));

const renderUI = async () => {
  const page = await ServicesUsedPage();
  return render(page);
};

describe('Services Used Error Handling', () => {
  it('should show error message on service failure', async () => {
    // No Api calls to resolve leading error scenario
    const component = await renderUI();
    expect(
      screen.getByText(
        'There was a problem loading your information. Please try refreshing the page or returning to this page later.',
      ),
    ).toBeVisible();
    expect(component.container).toMatchSnapshot();
  });
});
