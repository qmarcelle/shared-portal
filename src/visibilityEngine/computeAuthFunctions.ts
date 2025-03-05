import { LoggedInUserInfo } from '@/models/member/api/loggedInUserInfo';

import { AUTH_FUNCTION_MAP } from './authFunctions';
import { VisibilityRules } from './rules';

export function computeAuthFunctions(
  loggedUserInfo: LoggedInUserInfo,
  rules: VisibilityRules,
): void {
  console.log(
    `Auth Functions: ${JSON.stringify(loggedUserInfo.authFunctions)}`,
  );
  const authFunctionsMap = new Map<string, boolean>(
    loggedUserInfo.authFunctions.map((x) => [x.functionName, x.available]),
  );

  for (const [ruleName, authFunctionName] of Object.entries(
    AUTH_FUNCTION_MAP,
  )) {
    rules[ruleName] = authFunctionsMap.get(authFunctionName) || false;
  }
}
