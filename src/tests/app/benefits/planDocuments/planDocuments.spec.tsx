import PlanDocumentsPage from '@/app/(common)/myplan/benefits/planDocuments/page';
import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import axios from 'axios';
import { Agent } from 'https';

const renderUI = async () => {
  const result = await PlanDocumentsPage();
  return render(result);
};

jest.mock('src/auth', () => ({
  auth: jest.fn(),
}));

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

process.env.NEXT_PUBLIC_ANWAS_31_URL =
  'https://anwas31.bcbst.com:13130/secure/restricted/apps/';
process.env.NEXT_PUBLIC_PROXY = 'false';

describe('planDocuments', () => {
  afterEach(() => {
    jest.resetAllMocks();
  });
  it('should render the UI correctly', async () => {
    const mockAuth = jest.requireMock('src/auth').auth;
    mockAuth.mockResolvedValueOnce({
      user: {
        id: 'Testuser0123',
        vRules: {
          wellnessOnly: true,
        },
      },
    });
    mockedAxios.get.mockResolvedValue({
      data: `<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01//EN" "http://www.w3.org/TR/html4/strict.dtd"><html><head>
<head><title>Electronic Evidence Of Coverage</title></head>`,
    });
    const component = await renderUI();
    expect(screen.getByText('Plan Documents')).toBeVisible();
    const text =
      'We’ve put together quick-reference guides that explain your plan details and help you get the most from your benefits.';
    expect(text).toContain(
      'We’ve put together quick-reference guides that explain your plan details and help you get the most from your benefits.',
    );
    //expect(screen.getByText('Request Printed Material')).toBeVisible();
    //expect(screen.getByText('Ask us to mail your plan documents to you.'),).toBeVisible();
    expect(component).toMatchSnapshot();
  });

  it('should render the UI correctly with iframe', async () => {
    const mockAuth = jest.requireMock('src/auth').auth;
    mockAuth.mockResolvedValueOnce({
      user: {
        id: 'Testuser0123',
        vRules: {
          wellnessOnly: false,
          individualSBCEligible: true,
          subscriber: true,
          isCondensedExperience: false,
        },
      },
    });
    mockedAxios.get.mockResolvedValue({
      data: `<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01//EN" "http://www.w3.org/TR/html4/strict.dtd"><html><head>
<head><title>Electronic Evidence Of Coverage</title></head>`,
    });
    const component = await renderUI();
    expect(screen.getByText('Plan Documents')).toBeVisible();
    expect(
      screen.getByText(
        'To request a printed version of any of these materials, please',
      ),
    ).toBeVisible();
    expect(screen.getByText('Request Printed Material')).toBeVisible();
    expect(
      screen.getByText('Ask us to mail your plan documents to you.'),
    ).toBeVisible();
    expect(mockedAxios.get).toHaveBeenCalledWith(
      'https://anwas31.bcbst.com:13130/secure/restricted/apps/ElectronicEOCWeb/membereoclandingpage.do',
      {
        headers: { userID: 'Testuser0123' },
        proxy: false,
        httpsAgent: expect.any(Agent),
      },
    );
    expect(component).toMatchSnapshot();
  });

  it('should render the UI correctly with iframe error', async () => {
    const mockAuth = jest.requireMock('src/auth').auth;
    mockAuth.mockResolvedValueOnce({
      user: {
        id: 'Testuser0123',
        vRules: {
          wellnessOnly: false,
          individualSBCEligible: true,
          subscriber: true,
          isCondensedExperience: false,
        },
      },
    });
    mockedAxios.get.mockResolvedValue({
      data: `<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01//EN" "http://www.w3.org/TR/html4/strict.dtd"><html><head>
<head></head>`,
    });
    const component = await renderUI();
    expect(screen.getByText('Plan Documents')).toBeVisible();
    expect(
      screen.getByText(
        /We're not able to load Benefit Booklet right now. Please try again later./i,
      ),
    ).toBeVisible();
    expect(mockedAxios.get).toHaveBeenCalledWith(
      'https://anwas31.bcbst.com:13130/secure/restricted/apps/ElectronicEOCWeb/membereoclandingpage.do',
      {
        headers: { userID: 'Testuser0123' },
        proxy: false,
        httpsAgent: expect.any(Agent),
      },
    );
    expect(component).toMatchSnapshot();
  });

  it('should render the UI correctly for medicare', async () => {
    const mockAuth = jest.requireMock('src/auth').auth;
    mockAuth.mockResolvedValueOnce({
      user: {
        id: 'Testuser0123',
        vRules: {
          medicare: true,
        },
      },
    });
    mockedAxios.get.mockResolvedValue({
      data: `<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01//EN" "http://www.w3.org/TR/html4/strict.dtd"><html><head>
<head><title>Electronic Evidence Of Coverage</title></head>`,
    });
    const component = await renderUI();
    expect(screen.getByText('Plan Documents')).toBeVisible();
    expect(
      screen.getByText(
        'To request a printed version of any of these materials, please',
      ),
    ).toBeVisible();
    expect(screen.getByText('Provider Directory')).toBeVisible();
    expect(screen.getByText('Pharmacy Directory')).toBeVisible();
    expect(screen.getByText('Medication List (Formulary) 2025')).toBeVisible();
    expect(component).toMatchSnapshot();
  });
});
