import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { FindInNetworkProviderSection } from '../../../../app/mentalHealthOptions/components/FindInNetworkProviderSection';

const renderUI = () => {
  return render(<FindInNetworkProviderSection />);
};

// @ts-ignore
delete window.location;
// @ts-ignore
window.location = new URL('https://localhost');
const setHref = jest
  .spyOn(window.location, 'href', 'set')
  .mockImplementation(() => {});

process.env.NEXT_PUBLIC_IDP_PROVIDER_DIRECTORY =
  'https://uat.bcbst.sapphirecareselect.com/auth/metadata.xml';
process.env.NEXT_PUBLIC_PROVIDER_DIRECTORY_PCP_SSO_TARGET =
  'https://uat.bcbst.sapphirecareselect.com/search/search_specialties/980000071/1/%7B%22limit%22:10,%22radius%22:%2225%22,%22sort%22:%22has_sntx%20desc,%22distance%20asc%22,%22sort_translation%22:%22app_global_sort_distance%22,%22preserveFilters%22:true,%22is_pcp%22:%22Y%22%7D?network_id=39&locale=en';

describe('FindInNetworkProviderSection', () => {
  const baseUrl = window.location.origin;

  it('should render the UI correctly and redirect on image or text click', async () => {
    const component = renderUI();
    screen.getByText('Find an In-network Provider');
    screen.getByText(
      'Find a high-quality provider for either in-person or virtual telehealth appointments.',
    );
    screen.getByAltText(/FindCare/i);

    // Find the image element
    const imageElement = screen.getByAltText('FindCare');
    expect(imageElement).toBeInTheDocument();

    // Find the text element
    const textElement = screen.getByText('Find an In-network Provider');
    expect(textElement).toBeInTheDocument();

    // Mock the SSO link click
    const mockSSOLink = jest.fn();
    const linkElement = document.querySelector('a');
    if (linkElement) {
      linkElement.onclick = mockSSOLink;

      // Simulate user click on the image
      userEvent.click(imageElement);
      expect(mockSSOLink).toHaveBeenCalled();

      // Reset mock function
      mockSSOLink.mockReset();

      // Simulate user click on the text
      userEvent.click(textElement);
      expect(mockSSOLink).toHaveBeenCalled();

      // Check the URL set on window.location.href
      expect(setHref).toHaveBeenCalledWith(
        `${baseUrl}/sso/launch?PartnerSpId=https://uat.bcbst.sapphirecareselect.com/auth/metadata.xml&alternateText=Find a PCP&isPCPSearchRedirect=true&TargetResource=https://uat.bcbst.sapphirecareselect.com/search/search_specialties/980000071/1/%7B%22limit%22:10,%22radius%22:%2225%22,%22sort%22:%22has_sntx%20desc,%22distance%20asc%22,%22sort_translation%22:%22app_global_sort_distance%22,%22preserveFilters%22:true,%22is_pcp%22:%22Y%22%7D?network_id=39&locale=en`,
      );
    }

    expect(component).toMatchSnapshot();
  });
});
