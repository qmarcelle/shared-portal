import MyHealthPage from '@/app/myHealth/page';
import { loggedInUserInfoMockResp } from '@/mock/loggedInUserInfoMockResp';
import { mockedAxios } from '@/tests/__mocks__/axios';
import { mockedFetch } from '@/tests/setup';
import { fetchRespWrapper } from '@/tests/test_utils';
import { UserRole } from '@/userManagement/models/sessionUser';
import { VisibilityRules } from '@/visibilityEngine/rules';
import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';

const renderUI = async () => {
  const page = await MyHealthPage();
  return render(page);
};

const vRules = {
  myPCPElig: true,
  ohdEligible: true,
  commercial: true,
  medicare: true,
  phaMemberEligible: true,
  fullyInsuredHealthyMaternity: true,
  medical: true,
};

function setisActiveAndNotFSAOnly(vRules: VisibilityRules) {
  vRules.futureEffective = false;
  vRules.fsaOnly = false;
  vRules.terminated = false;
  vRules.katieBeckNoBenefitsElig = false;
}
jest.mock('../../../auth', () => ({
  auth: jest.fn(() =>
    Promise.resolve({
      user: {
        currUsr: {
          firstName: 'Chris',
          role: UserRole.MEMBER,
          plan: {
            memCk: '123456789',
          },
        },
        vRules: vRules,
      },
    }),
  ),
}));

describe('My Health Page', () => {
  beforeEach(() => {
    mockedFetch.mockResolvedValueOnce(
      fetchRespWrapper(loggedInUserInfoMockResp),
    );
  });
  it('should render My Health Page correctly', async () => {
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
    const component = await renderUI();
    expect(mockedAxios.get).toHaveBeenCalledWith('/pcPhysician/123456789');

    expect(screen.getByText('Louthan, James D.')).toBeVisible();
    expect(screen.getByText('2033 Meadowview Ln Ste 200')).toBeVisible();
    expect(screen.getByText('My Primary Care Provider')).toBeVisible();
    expect(
      screen.getByText('View or Update Primary Care Provider'),
    ).toBeVisible();
    screen.getByText('WellTuned Blog');
    screen.getByText(
      'Visit our WellTuned blog to stay up-to-date on health and wellness news, health care developments and tips for managing your health.',
    );
    expect(screen.getByText('Health Library')).toBeVisible();
    expect(screen.getByText('Visit The Health Library')).toBeVisible();
    expect(screen.getByText('Schedule a Biometric Screening')).toBeVisible();
    expect(screen.getByText('Member Wellness Center')).toBeVisible();
    expect(
      screen.getByText(
        'Take a free personal health assessment, track your diet and exercise, sync your fitness apps to earn wellness points and more—all in one secure place.',
      ),
    ).toBeVisible();
    expect(screen.getByText('Visit Member Wellness Center')).toBeVisible();
    expect(
      screen.queryByText('QuestSelect™ Low-Cost Lab Testing'),
    ).not.toBeInTheDocument();
    expect(component.baseElement).toMatchSnapshot();
  });
  it('should show Health Programs & Resources page when it is Commercial or Medicare lob', async () => {
    const component = await renderUI();
    screen.getByRole('heading', {
      name: 'Health Programs & Resources',
    });
    screen.getByText(
      'Your plan includes programs, guides and discounts to help make taking charge of your health easier and more affordable.',
    );
    screen.getByText('View All Health Programs & Resources');

    expect(component).toMatchSnapshot();
  });
  it('should not show Health Programs & Resources page when it is Commercial or Medicare lob', async () => {
    vRules.commercial = false;
    vRules.medicare = false;
    const component = await renderUI();
    expect(
      screen.queryByRole('heading', {
        name: 'Health Programs & Resources',
      }),
    ).not.toBeInTheDocument();

    expect(
      screen.queryByText(
        'Your plan includes programs, guides and discounts to help make taking charge of your health easier and more affordable.',
      ),
    ).not.toBeInTheDocument();
    expect(
      screen.queryByText('View All Health Programs & Resources'),
    ).not.toBeInTheDocument();

    expect(component).toMatchSnapshot();
  });
  it('should show Member Wellness Center component if memberWellness is true', async () => {
    vRules.phaMemberEligible = true;
    setisActiveAndNotFSAOnly(vRules);
    const component = await renderUI();
    expect(
      screen.queryByRole('heading', {
        name: 'Member Wellness Center',
      }),
    ).toBeInTheDocument();

    expect(
      screen.queryByText(
        'Take a free personal health assessment, track your diet and exercise, sync your fitness apps to earn wellness points and more—all in one secure place.',
      ),
    ).toBeInTheDocument();
    expect(component).toMatchSnapshot();
  });
  it('should not show Member Wellness Center component if memberWellness is true', async () => {
    vRules.phaMemberEligible = false;
    setisActiveAndNotFSAOnly(vRules);
    const component = await renderUI();
    expect(
      screen.queryByRole('heading', {
        name: 'Member Wellness Center',
      }),
    ).not.toBeInTheDocument();

    expect(
      screen.queryByText(
        'Take a free personal health assessment, track your diet and exercise, sync your fitness apps to earn wellness points and more—all in one secure place.',
      ),
    ).not.toBeInTheDocument();
    expect(component).toMatchSnapshot();
  });
  it('should show Healthy maternity component if pzn is true', async () => {
    vRules.fullyInsuredHealthyMaternity = true;
    vRules.medical = true;
    vRules.medicare = true;

    const component = await renderUI();
    expect(screen.getByText('Healthy Maternity')).toBeInTheDocument();

    expect(
      screen.getByText(
        'This program offers personalized pre- and post-natal care, confidential maternity health advice and around-the-clock support to keep you and your baby healthy.',
      ),
    ).toBeInTheDocument();
    expect(component).toMatchSnapshot();
  });
  it('should not show Healthy maternity component if if pzn is false', async () => {
    vRules.fullyInsuredHealthyMaternity = false;
    vRules.medical = false;
    const component = await renderUI();
    expect(screen.queryByText('Healthy Maternity')).not.toBeInTheDocument();

    expect(
      screen.queryByText(
        'This program offers personalized pre- and post-natal care, confidential maternity health advice and around-the-clock support to keep you and your baby healthy.',
      ),
    ).not.toBeInTheDocument();
    expect(component).toMatchSnapshot();
  });
});
