import { MyHealthOffsiteLinkCard } from '@/app/myHealth/components/MyHealthOffsiteLinkCard';
import healthSupportIcon from '@/public/assets/health_support.svg';
import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';

const renderUI = () => {
  return render(
    <MyHealthOffsiteLinkCard
      icon={healthSupportIcon}
      title="Get One-on-One Health Support"
      description="We offer a health program that’s designed just for you. Whether you need support for healthy living or help with a long- or short-term illness or injury, you can rely on us."
      url={process.env.NEXT_PUBLIC_ONE_ON_ONE_HEALTH_SUPPORT_URL ?? ''}
    />,
  );
};

describe('GetOneOnOneHealthSupport.spec', () => {
  it('should render the UI correctly', async () => {
    const component = renderUI();
    expect(screen.getByText('Get One-on-One Health Support')).toBeVisible();
    expect(
      screen.getByText(
        'We offer a health program that’s designed just for you. Whether you need support for healthy living or help with a long- or short-term illness or injury, you can rely on us.',
      ),
    ).toBeVisible();

    expect(component).toMatchSnapshot();
  });
});
