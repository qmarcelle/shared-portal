import PrimaryCareOptionsPage from '@/app/findcare/primaryCareOptions/page';
import { mockedAxios } from '@/tests/__mocks__/axios';
import { createAxiosErrorForTest } from '@/tests/test_utils';
import '@testing-library/jest-dom';
import { render, screen, waitFor } from '@testing-library/react';

const setupUI = async () => {
  const page = await PrimaryCareOptionsPage();
  render(page);
};

const vRules = {
  user: {
    currUsr: { plan: { memCk: '123456789' } },
    vRules: {
      blueCare: true,
      myPCPElig: true,
      futureEffective: false,
      fsaOnly: false,
      wellnessOnly: false,
      terminated: false,
      katieBeckNoBenefitsElig: false,
    },
  },
};

jest.mock('src/auth', () => ({
  auth: jest.fn(),
}));

describe('Primary Care Options', () => {
  beforeEach(() => {});
  it('Should test success flow of pcPhysician', async () => {
    const mockAuth = jest.requireMock('src/auth').auth;
    mockAuth.mockResolvedValueOnce(vRules);
    mockedAxios.get.mockResolvedValueOnce({
      data: {
        physicianId: '3118777',
        physicianName: 'Louthan, James D.',
        address1: '2033 Meadowview Ln Ste 200',
        address2: '',
        address3: '',
        city: 'Kingsport',
        state: 'TN',
        zip: '376607432',
        phone: '4238572260',
        ext: '',
        addressType: '1',
        taxId: '621388079',
      },
    });

    await setupUI();
    await waitFor(() => {
      expect(mockedAxios.get).toHaveBeenCalledWith(
        '/memberservice/PCPhysicianService/pcPhysician/123456789',
      );
      screen.getByText('Louthan, James D.');
      screen.getByText('Primary Care Provider');
      screen.getByText('2033 Meadowview Ln Ste 200');
      screen.getByText('Kingsport TN 37660-7432');
      screen.getByText('(423) 857-2260');
      screen.getByText('View or Update Primary Care Provider');
      screen.getByText('My Primary Care Provider');
    });
  });
  it('Should test 200 HttpStatus flow of pcPhysician when we get null', async () => {
    const mockAuth = jest.requireMock('src/auth').auth;
    mockAuth.mockResolvedValueOnce(vRules);
    mockedAxios.get.mockResolvedValueOnce(null);

    await setupUI();
    await waitFor(() => {
      expect(mockedAxios.get).toHaveBeenCalledWith(
        '/memberservice/PCPhysicianService/pcPhysician/123456789',
      );
      screen.getByText(
        'Oops, it looks like something went wrong. Try again later.',
      );
    });
  });
  it('Should test 200 HttpStatus flow of pcPhysician with empty data', async () => {
    const mockAuth = jest.requireMock('src/auth').auth;
    mockAuth.mockResolvedValueOnce(vRules);
    mockedAxios.get.mockResolvedValueOnce({ data: {} });

    await setupUI();
    await waitFor(() => {
      expect(mockedAxios.get).toHaveBeenCalledWith(
        '/memberservice/PCPhysicianService/pcPhysician/123456789',
      );
      screen.getByText(
        'Oops, it looks like something went wrong. Try again later.',
      );
    });
  });
  it('Should test failure flow of pcPhysician', async () => {
    const mockAuth = jest.requireMock('src/auth').auth;
    mockAuth.mockResolvedValueOnce(vRules);
    mockedAxios.get.mockRejectedValueOnce(
      createAxiosErrorForTest({
        errorObject: {},
        status: 400,
      }),
    );

    await setupUI();
    await waitFor(() => {
      expect(mockedAxios.get).toHaveBeenCalledWith(
        '/memberservice/PCPhysicianService/pcPhysician/123456789',
      );
      screen.getByText(
        'Oops, it looks like something went wrong. Try again later.',
      );
    });
  });
  it('Should test success flow of pcPhysician', async () => {
    const mockAuth = jest.requireMock('src/auth').auth;
    vRules.user.vRules.blueCare = false;
    vRules.user.vRules.myPCPElig = false;
    mockAuth.mockResolvedValueOnce(vRules);
    mockedAxios.get.mockResolvedValueOnce({
      data: {
        physicianId: '3118777',
        physicianName: 'Louthan, James D.',
        address1: '2033 Meadowview Ln Ste 200',
        address2: '',
        address3: '',
        city: 'Kingsport',
        state: 'TN',
        zip: '376607432',
        phone: '4238572260',
        ext: '',
        addressType: '1',
        taxId: '621388079',
      },
    });

    await setupUI();
    await waitFor(() => {
      expect(mockedAxios.get).toHaveBeenCalledWith(
        '/memberservice/PCPhysicianService/pcPhysician/123456789',
      );
      expect(screen.queryByText('Louthan, James D.')).not.toBeInTheDocument();
    });
  });
});
