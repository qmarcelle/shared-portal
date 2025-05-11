// // File: src/lib/visibility/hooks.ts
// import { useSession } from 'next-auth/react';
// import { useMemo } from 'react';
// import { decodeVisibilityRules } from './encoding';
// import { VisibilityRules } from './types';

// export function useVisibilityRules(): VisibilityRules | undefined {
//   const { data: session } = useSession();
  
//   return useMemo(() => {
//     if (!session?.user.vRules) return undefined;
//     return decodeVisibilityRules(session.user.vRules);
//   }, [session?.user.vRules]);
// }

// export function useFeatureFlag(predicate: (rules: VisibilityRules | undefined) => boolean): boolean {
//   const rules = useVisibilityRules();
  
//   return useMemo(() => {
//     return predicate(rules);
//   }, [rules, predicate]);
// }
