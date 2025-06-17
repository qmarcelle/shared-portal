import { auth } from '@/auth';
import * as computeVisibilityRules from '@/visibilityEngine/computeVisibilityRules';
import { VisibilityRules } from '@/visibilityEngine/rules';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  
  const session = await auth();

  if (!session) {
    return new NextResponse('Unauthorized', { status: 401 });
  }

  type VRuleFunction = (rules: VisibilityRules | undefined) => boolean;

  const vRules = session.user.vRules;
  const vRulesEval: Record<string, boolean> = {};
  const vRuleFunctions = Object.entries(computeVisibilityRules).filter(([key, func]) => typeof func == 'function' && func.length == 1);
  
  for (const [name, func] of vRuleFunctions) {
    try {
      const fn = func as VRuleFunction;
      vRulesEval[name] = fn(vRules);
    } catch {} //This will evaluate all the exported functions that fit the vRules type and skip/ignore any that don't
  }
  
  const response = {
    rules: vRules,
    computed: vRulesEval
  };

  return NextResponse.json(response);

}
