import { MyHealthOffsiteLinkCard } from '@/app/(protected)/(common)/member/myhealth/components/MyHealthOffsiteLinkCard';
import healthSurveyIcon from '/assets/health_survey.svg';
import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
const mockReplace = jest.fn();
jest.mock('next/navigation', () => ({
  useRouter() {
    return {
      prefetch: () => null,
      replace: mockReplace,
    };
  },
}));

const renderUI = () => {
  return render(
    <MyHealthOffsiteLinkCard
      icon={healthSurveyIcon}
      title="Fill-out The Health History & Needs Survey"
      description="Help us get a clear picture of your health needs. We need this info once a year from all our members. Please take a few minutes to complete this survey."
      url={process.env.NEXT_PUBLIC_FILL_OUT_THE_HEALTH_HISTORY_URL ?? ''}
    />,
  );
};
process.env.NEXT_PUBLIC_FILL_OUT_THE_HEALTH_HISTORY_URL =
  'https://test-bluecare.bcbst.com/get-care/your-health';

describe('Fill Out the Health History', () => {
  it('should render the UI correctly', async () => {
    const component = renderUI();
    expect(
      screen.getByText('Fill-out The Health History & Needs Survey'),
    ).toBeVisible();
    expect(
      screen.getByText(
        'Help us get a clear picture of your health needs. We need this info once a year from all our members. Please take a few minutes to complete this survey.',
      ),
    ).toBeVisible();

    expect(component).toMatchSnapshot();
  });
});
