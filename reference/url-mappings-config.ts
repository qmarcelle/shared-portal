// src/lib/required-url-mappings.ts

/**
 * Maps business-required URLs to our internal directory paths
 * This is a comprehensive mapping of all URLs from the old portal structure
 * to the new Next.js App Router directory structure
 */
export const requiredUrlMappings: Record<string, string> = {
  // Home/Dashboard
  '/member/home': '/dashboard',
  
  // My Plan section
  '/member/myplan': '/myPlan',
  '/member/idcard': '/memberIDCard',
  '/member/myplan/benefits': '/benefits',
  '/member/myplan/benefits/documents': '/benefits/planDocuments',
  '/member/myplan/benefits/plandocuments': '/benefits/planDocuments',
  '/member/myplan/otherinsurance': '/reportOtherHealthInsurance',
  '/member/myplan/benefits/identityprotection': '/benefits/identityProtectionServices',
  '/member/myplan/enroll': '/login', // This may need special handling
  '/member/myplan/benefits/balances': '/benefits/balances',
  '/member/myplan/claims': '/claims',
  '/member/myplan/claims/detail': '/claims',
  '/member/myplan/spendingsummary': '/spendingSummary',
  '/member/myplan/priorauthorizations': '/priorAuthorization',
  '/member/myplan/spendingaccounts': '/spendingAccounts',
  '/member/myplan/managepolicy': '/myPlan/manageMyPolicy',
  '/member/myplan/plancontact': '/myPlan/planContactInformation',
  '/member/myplan/servicesused': '/benefits/servicesUsed',
  '/member/myplan/ssn': '/myPlan/updateSocialSecurityNumber',
  '/member/myplan/katiebeckett': '/myPlan/katieBeckettBankingInfo',
  
  // Benefits section (detail pages)
  '/member/myplan/benefits/officevisits': '/benefits/details?type=officevisits',
  '/member/myplan/benefits/preventivecare': '/benefits/details?type=preventivecare',
  '/member/myplan/benefits/allergy': '/benefits/details?type=allergy',
  '/member/myplan/benefits/emergency': '/benefits/details?type=emergency',
  '/member/myplan/benefits/impatientservices': '/benefits/details?type=impatientservices',
  '/member/myplan/benefits/outpatientservices': '/benefits/details?type=outpatientservices',
  '/member/myplan/benefits/medicalequipment': '/benefits/details?type=medicalequipment',
  '/member/myplan/benefits/behavioralhealth': '/benefits/details?type=behavioralhealth',
  '/member/myplan/benefits/medicalservices': '/benefits/details?type=medicalservices',
  '/member/myplan/benefits/pharmacy': '/benefits/details?type=pharmacy',
  '/member/myplan/benefits/employerbenefits': '/benefits/employerProvidedBenefits',
  
  // Dental Benefits section
  '/member/myplan/benefits/dentalanasthesia': '/benefits/details?type=dentalanasthesia',
  '/member/myplan/benefits/dentalbasic': '/benefits/details?type=dentalbasic',
  '/member/myplan/benefits/dentalpreventive': '/benefits/details?type=dentalpreventive',
  '/member/myplan/benefits/dentalendodontics': '/benefits/details?type=dentalendodontics',
  '/member/myplan/benefits/dentalmajor': '/benefits/details?type=dentalmajor',
  '/member/myplan/benefits/dentalocclusalguard': '/benefits/details?type=dentalocclusalguard',
  '/member/myplan/benefits/dentaloralsurgery': '/benefits/details?type=dentaloralsurgery',
  '/member/myplan/benefits/dentalorthodontic': '/benefits/details?type=dentalorthodontic',
  '/member/myplan/benefits/dentalperiodontics': '/benefits/details?type=dentalperiodontics',
  '/member/myplan/benefits/dentalTMJ': '/benefits/details?type=dentalTMJ',
  
  // My Health section
  '/member/myhealth': '/myHealth',
  '/member/myhealth/healthprograms': '/myHealth/healthProgramsResources',
  '/member/myhealth/healthprograms/caretn': '/myHealth/healthProgramsResources/myHealthPrograms',
  '/member/myhealth/healthprograms/diabetesprevention': '/myHealth/healthProgramsResources/myHealthPrograms',
  '/member/myhealth/healthprograms/diabetesmanagment': '/myHealth/healthProgramsResources/myHealthPrograms',
  '/member/myhealth/healthprograms/healthymaternity': '/healthyMaternity',
  '/member/myhealth/rewardsFAQ': '/myHealth/rewardsProgramsFAQs',
  
  // Find Care section
  '/member/findcare': '/findcare',
  '/member/findcare/virtualcare': '/findcare',
  '/member/findcare/mentalhealth': '/mentalHealthOptions',
  '/member/findcare/primarycare': '/findcare/primaryCareOptions',
  '/member/findcare/dentalcosts': '/priceDentalCare',
  '/member/findcare/virtualcare/talktonurse': '/virtualCareOptions',
  
  // Pharmacy section
  '/member/pharmacy': '/pharmacy',
  '/member/pharmacy/documents': '/pharmacy',
  
  // Support section
  '/member/support': '/support',
  '/member/support/email': '/support/sendAnEmail',
  '/member/support/FAQ': '/support/faq',
  '/member/support/FAQ/benefits': '/support/faqTopics',
  '/member/support/FAQ/claims': '/support/faqTopics',
  '/member/support/FAQ/idcard': '/support/faqTopics',
  '/member/support/FAQ/myplan': '/support/faqTopics',
  '/member/support/FAQ/pharmacy': '/support/faqTopics',
  '/member/support/FAQ/priorauthorizations': '/support/faqTopics',
  '/member/support/FAQ/accountsharing': '/support/faqTopics',
  '/support/1095b': '/1095BFormRequest',
  
  // Profile/Account section
  '/member/profile': '/profileSettings',
  '/member/profile/communication': '/communicationSettings',
  '/member/profile/accountsharing/myinfo': '/shareMyInformation',
  '/member/profile/accountsharing/access': '/accessOthersInformation',
  '/member/profile/accountsharing/personalrep': '/personalRepresentativeAccess',
  '/member/profile/accountsharing/thirdparty': '/thirdPartySharing',
  '/member/inbox': '/inbox',
  '/member/security': '/security',
  
  // Error/Maintenance
  '/member/maintenance': '/dashboard',
  '/member/error': '/dashboard',
  
  // Claims
  '/member/myplan/claims/submit': '/claims/submitAClaim'
};

/**
 * Contains pattern-based URL mapping rules for complex cases
 * Returns the internal path or null if no match
 */
export function getPatternMatch(path: string): string | null {
  // Claims detail pages
  const claimDetailMatch = path.match(/^\/member\/myplan\/claims\/detail(?:\/(.+))?$/);
  if (claimDetailMatch) {
    const id = claimDetailMatch[1] || '';
    return `/claims/${id}`;
  }
  
  // Prior authorization details
  const priorAuthMatch = path.match(/^\/member\/myplan\/priorauthorizations\/details(?:\/(.+))?$/);
  if (priorAuthMatch) {
    const id = priorAuthMatch[1] || '';
    return `/authDetail/${id}`;
  }
  
  // General benefits pages (catch-all for benefits not explicitly mapped)
  const benefitsMatch = path.match(/^\/member\/myplan\/benefits\/(.+)$/);
  if (benefitsMatch && !requiredUrlMappings[path]) {
    const benefitType = benefitsMatch[1];
    return `/benefits/details?type=${benefitType}`;
  }
  
  // Health programs (catch-all for health programs not explicitly mapped)
  const healthProgramsMatch = path.match(/^\/member\/myhealth\/healthprograms\/(.+)$/);
  if (healthProgramsMatch && !requiredUrlMappings[path]) {
    const programType = healthProgramsMatch[1];
    return `/myHealth/healthProgramsResources/myHealthPrograms?program=${programType}`;
  }
  
  return null;
}
