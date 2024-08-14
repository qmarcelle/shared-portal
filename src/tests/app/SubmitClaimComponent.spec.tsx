import { SubmitClaimComponent } from '@/app/claim/components/SubmitClaimComponent';
import '@testing-library/jest-dom';
import {
  RenderResult,
  fireEvent,
  render,
  screen,
  waitFor,
} from '@testing-library/react';
import axios from 'axios';

const renderUI = () => {
  render(<SubmitClaimComponent />);
};

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('Submit Claim', () => {
  global.URL.createObjectURL = jest.fn();
  it('should handle Negative scenario', async () => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    let component: RenderResult;

    mockedAxios.get.mockRejectedValueOnce({});

    renderUI();
    fireEvent.click(screen.getByRole('button', { name: /Download PDF/i }));
    await waitFor(() => {
      expect(global.URL.createObjectURL).not.toHaveBeenCalled();
    });
  });

  it('should render the UI correctly', async () => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    let component: RenderResult;

    mockedAxios.get.mockResolvedValueOnce({
      data: {},
    });

    renderUI();
    fireEvent.click(screen.getByRole('button', { name: /Download PDF/i }));
    await waitFor(() => {
      expect(mockedAxios.get).toHaveBeenCalledWith('testPDF.pdf', {
        responseType: 'blob',
      });
    });
  });
});
