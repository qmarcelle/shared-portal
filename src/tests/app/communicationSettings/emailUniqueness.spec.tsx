import { UpdateCommunicationEmail } from '@/app/(protected)/(common)/member/communicationSettings/journeys/UpdateCommunicationEmail';
import { AppModal } from '@/components/foundation/AppModal';
import '@testing-library/jest-dom';
import {
  cleanup,
  fireEvent,
  render,
  RenderResult,
  screen,
  waitFor,
} from '@testing-library/react';
import {
  isValidEmailAddress,
  isValidEmailDomain,
  validateLength,
} from '../../../../src/utils/inputValidator';

jest.mock(
  '../../../../src/app/communicationSettings/actions/emailUniquenessAction',
);

jest.mock('../../../../src/utils/inputValidator', () => ({
  isValidEmailAddress: jest.fn(),
  isValidEmailDomain: jest.fn(),
  validateLength: jest.fn(),
}));

const renderUI = () => {
  return render(<AppModal />);
};

const mockDismissModal = jest.fn();
const mockChangePage = jest.fn();

const defaultProps = {
  email: 'test@example.com',
  changePage: mockChangePage,
  pageIndex: 0,
  dismissModal: mockDismissModal,
};

describe('UpdateCommunicationEmail', () => {
  let component: RenderResult;
  beforeEach(() => {
    jest.clearAllMocks();
    component = renderUI();
  });

  afterEach(() => {
    cleanup();
  });

  test('renders initial page with email input', () => {
    render(<UpdateCommunicationEmail {...defaultProps} />);
    expect(screen.getByLabelText(/Email Address/i)).toBeInTheDocument();
    expect(component.baseElement).toMatchSnapshot();
  });

  test('validates email address and shows confirmation input', async () => {
    (isValidEmailAddress as jest.Mock).mockReturnValue(true);
    (isValidEmailDomain as jest.Mock).mockReturnValue(true);
    (validateLength as jest.Mock).mockReturnValue(true);

    render(<UpdateCommunicationEmail {...defaultProps} />);
    const emailInput = screen.getByLabelText(/Email Address/i);
    fireEvent.change(emailInput, { target: { value: 'new@example.com' } });

    await waitFor(() => {
      expect(screen.getByLabelText(/Confirm Email/i)).toBeInTheDocument();
    });
    expect(component.baseElement).toMatchSnapshot();
  });

  test('shows error for invalid email address', async () => {
    (isValidEmailAddress as jest.Mock).mockReturnValue(false);

    render(<UpdateCommunicationEmail {...defaultProps} />);
    const emailInput = screen.getByLabelText(/Email Address/i);
    fireEvent.change(emailInput, { target: { value: 'invalid-email' } });

    await waitFor(() => {
      expect(
        screen.getByText(/Please enter a valid address./i),
      ).toBeInTheDocument();
    });
    expect(component.baseElement).toMatchSnapshot();
  });

  test('shows error if email addresses do not match', async () => {
    (isValidEmailAddress as jest.Mock).mockReturnValue(true);
    (isValidEmailDomain as jest.Mock).mockReturnValue(true);
    (validateLength as jest.Mock).mockReturnValue(true);

    render(<UpdateCommunicationEmail {...defaultProps} />);
    const emailInput = screen.getByLabelText(/Email Address/i);
    fireEvent.change(emailInput, { target: { value: 'new@example.com' } });

    await waitFor(() => {
      const confirmEmailInput = screen.getByLabelText(/Confirm Email/i);
      fireEvent.change(confirmEmailInput, {
        target: { value: 'different@example.com' },
      });
      expect(
        screen.getByText(/The email addresses must match./i),
      ).toBeInTheDocument();
    });
    expect(component.baseElement).toMatchSnapshot();
  });

  test('displays success message on final page', () => {
    render(<UpdateCommunicationEmail {...defaultProps} pageIndex={2} />);
    expect(screen.getByText(/Email Address Updated/i)).toBeInTheDocument();
    expect(screen.getByText(/Your email address is:/i)).toBeInTheDocument();
    expect(screen.getByText(defaultProps.email)).toBeInTheDocument();
    expect(component.baseElement).toMatchSnapshot();
  });
});
