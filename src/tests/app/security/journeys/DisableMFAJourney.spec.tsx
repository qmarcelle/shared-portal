import { DisableMFAJourney } from '@/app/(main)/security/components/journeys/DisableMFAJourney';
import { MfaDeviceType } from '@/app/(main)/security/models/mfa_device_type';
import { AppModal, useAppModalStore } from '@/components/foundation/AppModal';
import '@testing-library/jest-dom';
import {
    RenderResult,
    fireEvent,
    render,
    screen,
    waitFor,
} from '@testing-library/react';
import { mockedAxios } from '../../../__mocks__/axios';

const renderUI = () => {
  return render(<AppModal />);
};

describe('Disable MFA Journey', () => {
  let component: RenderResult;
  beforeAll(() => {
    const showAppModal = useAppModalStore.getState().showAppModal;
    component = renderUI();
    showAppModal({
      content: (
        <DisableMFAJourney
          deviceType={MfaDeviceType.email}
          emailOrPhone="xyz@abc.com"
        />
      ),
    });
  });

  it('should render the screens correctly', async () => {
    // Init Screen is rendered correctly
    await waitFor(() => {
      expect(
        screen.getByRole('heading', { name: 'Turn Off Method' }),
      ).toBeVisible();
    });
    expect(component.baseElement).toMatchSnapshot();

    mockedAxios.post.mockResolvedValueOnce({
      data: {
        data: {
          message: 'Device deleted successfully.',
        },
      },
    });
    fireEvent.click(screen.getByRole('button', { name: /Turn Off Method/i }));
    // Success screen rendered correctly
    await waitFor(() => {
      expect(
        screen.getByRole('heading', {
          name: 'Authentication Method Turned Off',
        }),
      ).toBeVisible();
    });
    expect(component.baseElement).toMatchSnapshot();
  });
});
