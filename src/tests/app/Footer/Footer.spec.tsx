import Footer from '@/components/foundation/Footer';
import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
const renderUI = () => {
  return render(<Footer />);
};

jest.mock('next/navigation', () => ({
  useRouter() {
    return {
      prefetch: () => null,
      replace: () => null,
    };
  },
}));

describe('Footer Component', () => {
  // Test: Ensure Popular Links section renders correctly
  const component = renderUI();
  it('should render the UI correctly', async () => {
    expect(screen.getByText('Popular Links')).toBeInTheDocument();
    expect(screen.getByText('Get an ID Card')).toBeInTheDocument();
    expect(screen.getByText('Find Care & Costs')).toBeInTheDocument();
    expect(screen.getByText('View Claims')).toBeInTheDocument();
    expect(screen.getByText('Profile Settings')).toBeInTheDocument();
    expect(screen.getByText('Support')).toBeInTheDocument();
    expect(screen.getByText('Get Help & Contact Us')).toBeInTheDocument();
    expect(screen.getByText('Share Website Feedback')).toBeInTheDocument();
    expect(screen.getByText('Share Your Screen')).toBeInTheDocument();
    expect(screen.getByText('Important Information')).toBeInTheDocument();
    expect(screen.getByText('Nondiscrimination')).toBeInTheDocument();
    expect(screen.getByText('Member Rights')).toBeInTheDocument();
    expect(screen.getByText('Fight Fraud')).toBeInTheDocument();

    expect(screen.getByText('Download the App')).toBeInTheDocument();
    expect(
      screen.getByText(
        /Download the BCBSTN app in the Apple Store or Google Play/i,
      ),
    ).toBeInTheDocument();

    const socialMediaIcons = screen.getAllByRole('img');
    expect(socialMediaIcons.length).toBeGreaterThanOrEqual(6); // Check if at least 6 icons are rendered
    expect(screen.getByAltText('Facebook Icon')).toBeInTheDocument();

    expect(screen.getByText('Sitemap')).toBeInTheDocument();
    expect(screen.getByText('Privacy & Security')).toBeInTheDocument();
    expect(screen.getByText('Legal')).toBeInTheDocument();
    expect(screen.getByText('Deutsch')).toBeInTheDocument();

    const user = userEvent.setup();
    const getIdCard = screen.getByText('Get an ID Card');
    expect(getIdCard).toHaveAttribute('href', '/memberIDCard');
    await user.click(getIdCard);

    const getFindCare = screen.getByText('Find Care & Costs');
    expect(getFindCare).toHaveAttribute('href', '/findcare');
    await user.click(getFindCare);

    const getClaims = screen.getByText('View Claims');
    expect(getClaims).toHaveAttribute('href', '/claims');
    await user.click(getClaims);

    const getSupport = screen.getByText('Get Help & Contact Us');
    expect(getSupport).toHaveAttribute('href', '/support');
    await user.click(getSupport);

    const getProfileSettings = screen.getByText('Profile Settings');
    expect(getProfileSettings).toHaveAttribute('href', '/profileSettings');
    await user.click(getProfileSettings);

    expect(component.baseElement).toMatchSnapshot();
  });
});
