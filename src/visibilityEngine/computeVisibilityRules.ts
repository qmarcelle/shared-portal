import { encodeVisibilityRules } from './converters';
import { VisibilityRules } from './rules';

export async function computeVisibilityRules(): Promise<string> {
  //TODO: Update the rules computation logic with the current implementation
  const vRules: VisibilityRules = {};
  vRules['wellnessScheme'] = true;
  vRules['balances'] = true;
  vRules['employerBenefits'] = false;
  vRules['premiumHealth'] = true;
  vRules['pharmacy'] = true;
  vRules['amplifyHealth'] = false;
  vRules['teladoc'] = true;
  vRules['nonMemberDashboard'] = false;
  return encodeVisibilityRules(vRules);
}

async function getRoles() {}

async function getPermissions() {}

async function getFunctionsAvailibility() {}
