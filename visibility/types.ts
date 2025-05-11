// // File: src/lib/visibility/types.ts

// export const MEMBER_ATTRIBUTES_LIST = [
//   'active',
//   'termed',
//   'futureEffective',
//   // ...other attributes remain the same
// ] as const;

// export type VisibilityRule = (typeof MEMBER_ATTRIBUTES_LIST)[number];

// export interface VisibilityRules {
//   [key: string]: boolean;
// }

// export type RuleEvaluator = (rules: VisibilityRules | undefined) => boolean;

// export interface VisibilityEngineOptions {
//   encodeRules?: boolean;
//   includeDebugInfo?: boolean;
// }