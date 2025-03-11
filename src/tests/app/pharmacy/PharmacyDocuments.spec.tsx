import PharmacyPage from '@/app/pharmacy/page';
import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import { mockedAxios } from '../_mocks_/axios';

const renderUI = async () => {
  const page = await PharmacyPage();
  return render(page);
};

const vRules = {
  user: {
    vRules: { medicare: true, dsnpGrpInd: false, showPharmacyTab: true },
  },
};

jest.mock('src/auth', () => ({
  auth: jest.fn(),
}));

describe('PharmacyDocuments', () => {
  it('should render UI correctly - for Medicare Groups', async () => {
    const mockAuth = jest.requireMock('src/auth').auth;
    mockAuth.mockResolvedValueOnce(vRules);
    mockedAxios.get.mockResolvedValueOnce({
      data: {},
    });
    const component = await renderUI();

    expect(screen.getByText('View Covered Drug List (Formulary)'));
    expect(
      screen.getByText('Download a list of all the drugs your plan covers.'),
    );

    expect(screen.getByText('Prescription Drug Claim Form'));
    expect(
      screen.getByText(
        // eslint-disable-next-line quotes
        "We call it the G0-510 form. You'll use it only for prescription drug claims when the claim is not filled through your pharmacist.",
      ),
    );

    expect(screen.getByText('Prescription Mail Service Order Form'));
    expect(
      screen.getByText(
        'Mail order is easy and convenient. You can have your prescriptions delivered right to your home.',
      ),
    );

    expect(
      screen.getByText(
        'Request for Medicare Prescription Drug Coverage Determination',
      ),
    );
    expect(
      screen.getByText(
        'You can request an exception for prescription drug coverage.',
      ),
    );

    expect(
      screen.getByText(
        'Request for Redetermination of Medicare Prescription Drug Denial',
      ),
    );
    expect(
      screen.getByText(
        'If you received a Notice of Denial of Medicare Prescription Drug Coverage, you can ask us for a redetermination (appeal).',
      ),
    );

    expect(component.baseElement).toMatchSnapshot();
  });

  it('should render UI correctly - for Non Medicare Groups', async () => {
    vRules.user.vRules.medicare = false;
    const mockAuth = jest.requireMock('src/auth').auth;
    mockAuth.mockResolvedValueOnce(vRules);
    mockedAxios.get.mockResolvedValueOnce({
      data: {},
    });
    const component = await renderUI();

    expect(screen.getByText('View Covered Drug List (Formulary)'));
    expect(
      screen.getByText('Download a list of all the drugs your plan covers.'),
    );

    expect(screen.getByText('Prescription Drug Claim Form'));
    expect(
      screen.getByText(
        // eslint-disable-next-line quotes
        "We call it the G0-510 form. You'll use it only for prescription drug claims when the claim is not filled through your pharmacist.",
      ),
    );

    expect(screen.getByText('Prescription Mail Service Order Form'));
    expect(
      screen.getByText(
        'Mail order is easy and convenient. You can have your prescriptions delivered right to your home.',
      ),
    );

    expect(
      screen.queryByText(
        'Request for Medicare Prescription Drug Coverage Determination',
      ),
    ).not.toBeInTheDocument();
    expect(
      screen.queryByText(
        'You can request an exception for prescription drug coverage.',
      ),
    ).not.toBeInTheDocument();

    expect(
      screen.queryByText(
        'Request for Redetermination of Medicare Prescription Drug Denial',
      ),
    ).not.toBeInTheDocument();
    expect(
      screen.queryByText(
        'If you received a Notice of Denial of Medicare Prescription Drug Coverage, you can ask us for a redetermination (appeal).',
      ),
    ).not.toBeInTheDocument();

    expect(component.baseElement).toMatchSnapshot();
  });
});
