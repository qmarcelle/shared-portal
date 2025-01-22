import BenefitsAndCoveragePage from '@/app/benefits/page';
import '@testing-library/jest-dom';
import { render } from '@testing-library/react';

const renderUI = async () => {
  const page = await BenefitsAndCoveragePage();
  return render(page);
};

jest.mock('src/auth', () => ({
  auth: jest.fn(),
}));

const vRules = {
  user: {
    currUsr: {
      plan: { memCk: '123456789', grpId: '87898', sbsbCk: '654567656' },
    },
    vRules: {
      dental: true,
      dentalCostsEligible: true,
      enableCostTools: true,
      vision: true,
    },
  },
};

describe('Benefits Page', () => {
  //these need to be rewritten
});
