import UpdateSocialSecurityNumber from '@/app/updateSocialSecurityNumber';
import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';

const renderUI = () => {
  return render(<UpdateSocialSecurityNumber />);
};

describe('UpdateSocialSecurityNumber Page', () => {
  it('should render UpdateSocialSecurityNumber Page correctly', async () => {
    const component = renderUI();

    expect(
      screen.getByRole('heading', { name: 'Update Social Security Number' }),
    ).toBeVisible();
    expect(
      screen.getByText(
        'You can update the Social Security Number (SSN) we have on file here.',
      ),
    ).toBeVisible();
    expect(screen.getByText('About Social Security Number')).toBeVisible();
    expect(
      screen.getByText(
        'For privacy and security, we will not display the current social security number we have on file.',
      ),
    ).toBeVisible();
    expect(
      screen.getByText(
        'Your SSN is used to process important tax related documents. Adding or updating your SSN will ensure that your documents are accurate and timely.',
      ),
    ).toBeVisible();
    expect(screen.getByText('Maddison Hall')).toBeInTheDocument();
    expect(screen.getByText('DOB: 01/01/1979')).toBeInTheDocument();
    expect(screen.getByText('Chris Hall')).toBeInTheDocument();
    expect(screen.getByText('DOB: 01/01/1978')).toBeInTheDocument();
    expect(screen.getByText('Forest Hall')).toBeInTheDocument();
    expect(screen.getByText('DOB: 01/01/2001')).toBeInTheDocument();
    expect(screen.getByText('Corey Hall')).toBeInTheDocument();
    expect(screen.getByText('DOB: 01/01/2002')).toBeInTheDocument();
    expect(screen.getByText('Telly Hall')).toBeInTheDocument();
    expect(screen.getByText('DOB: 01/01/2005')).toBeInTheDocument();
    expect(screen.getByText('Janie Hall')).toBeInTheDocument();
    expect(screen.getByText('DOB: 01/01/2015')).toBeInTheDocument();
    expect(screen.queryAllByText('A SSN was found on file.')).toHaveLength(4);

    expect(component).toMatchSnapshot();
  });
  it('should render No SSN condition correctly', async () => {
    const component = renderUI();

    expect(
      screen.getByRole('heading', { name: 'Update Social Security Number' }),
    ).toBeVisible();
    screen.findByAltText(/link/i);
    expect(screen.queryAllByText('No SSN on file.')).toHaveLength(2);

    expect(component).toMatchSnapshot();
  });
});
