// // File: src/lib/visibility/index.ts
// export * from './types';
// export * from './engine';
// export * from './predicates';
// export * from './hooks';


// // Example usage with a conditional component
// // File: src/components/FeatureFlag.tsx
// import { ReactNode } from 'react';
// import { VisibilityRules, RuleEvaluator } from '@/lib/visibility/types';
// import { useFeatureFlag } from '@/lib/visibility/hooks';

// interface FeatureFlagProps {
//   predicate: RuleEvaluator;
//   children: ReactNode;
//   fallback?: ReactNode;
// }

// export function FeatureFlag({ predicate, children, fallback = null }: FeatureFlagProps) {
//   const isEnabled = useFeatureFlag(predicate);
  
//   return isEnabled ? <>{children}</> : <>{fallback}</>;
// }