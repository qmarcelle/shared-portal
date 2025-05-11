// // File: src/lib/visibility/engine.ts
// import { LoggedInUserInfo, Member } from '@/models/member/api/loggedInUserInfo';
// import { AUTH_FUNCTION_MAP, CHAT_ELIGIBILITY, LOB, POLICY_TYPES } from './constants';
// import { encodeVisibilityRules } from './encoding';
// import { VisibilityEngineOptions, VisibilityRules } from './types';

// export class VisibilityEngine {
//   private rules: VisibilityRules = {};
//   private userInfo: LoggedInUserInfo;
//   private options: VisibilityEngineOptions;

//   constructor(userInfo: LoggedInUserInfo, options: VisibilityEngineOptions = {}) {
//     this.userInfo = userInfo;
//     this.options = {
//       encodeRules: true,
//       includeDebugInfo: false,
//       ...options,
//     };
//   }

//   public computeRules(): VisibilityRules | string {
//     this.computeBasicInfo();
//     this.computeAuthFunctions();
//     this.computeMemberInfo();
//     this.computeAdditionalRules();
//     this.computeChatEligibility();

//     return this.options.encodeRules 
//       ? encodeVisibilityRules(this.rules) 
//       : this.rules;
//   }

//   private computeBasicInfo(): void {
//     const { userInfo, rules } = this;
    
//     rules.active = userInfo.isActive;
//     rules.subscriber = userInfo.subscriberLoggedIn;
//     rules.externalSpendingAcct = userInfo.healthCareAccounts?.length > 0;
//     rules.commercial = LOB.COMMERCIAL.includes(userInfo.lob);
//     rules.individual = LOB.INDIVIDUAL.includes(userInfo.lob);
//     rules.blueCare = LOB.MEDICAID.includes(userInfo.lob);
//     rules.medicare = LOB.MEDICARE.includes(userInfo.lob);
//     rules.dsnpGrpInd = userInfo.groupData.clientID === 'ES';
//     rules.isSilverFitClient = userInfo.groupData.clientID === 'MX';
    
//     rules.selfFunded = POLICY_TYPES.SELF_FUNDED.includes(userInfo.groupData.policyType);
//     rules.fullyInsured = POLICY_TYPES.FULLY_INSURED.includes(userInfo.groupData.policyType);
//     rules.levelFunded = POLICY_TYPES.LEVEL_FUNDED.includes(userInfo.groupData.policyType);
//   }

//   private computeAuthFunctions(): void {
//     const { userInfo, rules } = this;
    
//     const authFunctionsMap = new Map<string, boolean>(
//       userInfo.authFunctions.map((x) => [x.functionName, x.available])
//     );

//     for (const [ruleName, authFunctionName] of Object.entries(AUTH_FUNCTION_MAP)) {
//       rules[ruleName] = authFunctionsMap.get(authFunctionName) || false;
//     }
//   }

//   private computeMemberInfo(): void {
//     const { userInfo, rules } = this;
    
//     const primaryMember = userInfo.members.find(member => member.memRelation === 'M');
    
//     if (primaryMember) {
//       rules.futureEffective = primaryMember.futureEffective;
//       rules.terminated = !primaryMember.isActive;
//       this.computeCoverageTypes(primaryMember);
//       this.computeMemberAge(primaryMember);
//     }
//   }
  
//   private computeCoverageTypes(member: Member): void {
//     const { rules } = this;
//     let fsaFlag = false;
//     let wellnessFlag = false;
//     let exchgMedical = false;
//     let exchgDental = false;
//     let exchgVision = false;
    
//     member.coverageTypes.forEach((coverage) => {
//       if (coverage.productType) {
//         switch (coverage.productType) {
//           case 'M':
//             rules.medical = true;
//             if (coverage.exchange) exchgMedical = true;
//             break;
//           case 'D':
//             rules.dental = true;
//             if (coverage.exchange) exchgDental = true;
//             break;
//           case 'V':
//             rules.vision = true;
//             if (coverage.exchange) exchgVision = true;
//             break;
//           case 'F':
//             fsaFlag = true;
//             break;
//           case 'S':
//             wellnessFlag = true;
//             break;
//         }
//       }
//     });

//     if (rules?.individual && (exchgMedical || exchgDental || exchgVision)) {
//       rules.indivEHBUser = true;
//     } else if (!rules?.individual && (exchgMedical || exchgDental || exchgVision)) {
//       rules.groupEHBUser = true;
//     }

//     if (!rules.medical && !rules.dental && !rules.vision) {
//       if (wellnessFlag) {
//         rules.wellnessOnly = true;
//       } else if (fsaFlag) {
//         rules.fsaOnly = true;
//       }
//     }
//   }
  
//   private computeMemberAge(member: Member): void {
//     const { rules } = this;
    
//     const birthDate = new Date(member.birthDate);
//     const today = new Date();
    
//     let age = today.getFullYear() - birthDate.getFullYear();
//     const monthDiff = today.getMonth() - birthDate.getMonth();
//     const dayDiff = today.getDate() - birthDate.getDate();

//     if (monthDiff < 0 || (monthDiff === 0 && dayDiff < 0)) {
//       age--;
//     }
    
//     rules.matureMinor = age >= 13 && age <= 17;
//   }
  
//   private computeAdditionalRules(): void {
//     const { rules } = this;
    
//     // Set default values for common rules
//     rules.premiumHealth = true;
//     rules.pharmacy = true;
//     rules.teladoc = true;
//   }
  
//   private computeChatEligibility(): void {
//     const { userInfo, rules } = this;
    
//     // Compute chat eligibility
//     rules.chatEligible = 
//       CHAT_ELIGIBILITY.STANDARD.includes(userInfo.lob) &&
//       !rules.futureEffective &&
//       !rules.terminated &&
//       !rules.katieBeckNoBenefitsElig;

//     // Compute cloud chat eligibility
//     rules.cloudChatEligible =
//       CHAT_ELIGIBILITY.CLOUD.includes(userInfo.lob) && 
//       rules.chatEligible;
//   }
// }