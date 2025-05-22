import { isAHAdvisorpage } from "@/visibilityEngine/computeVisibilityRules";
import { VisibilityRules } from "@/visibilityEngine/rules";

export const rewriteRules: Record<string, string> = {
  // home Path
  '/member/home': '/dashboard',
  '/member/support': '/support',
  '/member/inbox': '/inbox',
  '/member/idcard': '/memberIDCard',
  '/member/searchresults': '/searchResults',

  // FAQ Paths
  '/member/support/email': '/support/sendAnEmail',
  '/member/support/1095b': '/1095BFormRequest',
  '/member/support/FAQ': '/support/faq',
  '/member/support/FAQ/benefits': '/support/faqTopics/benefits',
  '/member/support/FAQ/claims': '/support/faqTopics/claims',
  '/member/support/FAQ/idcard': '/support/faqTopics/idcard',
  '/member/support/FAQ/myplan': '/support/faqTopics/myplan',
  '/member/support/FAQ/pharmacy': '/support/faqTopics/pharmacy',
  '/member/support/FAQ/priorauthorizations':
    '/support/faqTopics/priorauthorizations',
  '/member/support/FAQ/accountsharing': '/support/faqTopics/security',
  '/member/amplifyhealthsupport': '/amplifyHealthSupport',

  // MyPlan Paths
  '/member/myplan': '/myPlan',
  '/member/myplan/benefits': '/benefits',
  '/member/myplan/benefits/balances': '/benefits/balances',
  '/member/myplan/otherinsurance': '/reportOtherHealthInsurance',
  '/member/myplan/claims': '/claims',
  '/member/myplan/spendingsummary': '/spendingSummary',
  '/member/myplan/priorauthorizations': '/priorAuthorization',
  '/member/myplan/spendingaccounts': '/spendingAccounts',
  '/member/myplan/ssn': '/myPlan/updateSocialSecurityNumber',
  '/member/myplan/benefits/plandocuments': '/benefits/planDocuments',
  '/member/myplan/katiebeckett': '/myPlan/katieBeckettBankingInfo',
  '/member/myplan/servicesused': '/benefits/servicesUsed',
  '/member/myplan/plancontact': '/myPlan/planContactInformation',
  '/member/myplan/claims/submit': '/claims/submitAClaim',
  '/member/myplan/managepolicy': '/myPlan/manageMyPolicy',

  // MyHealth Paths
  '/member/myhealth': '/myHealth',
  '/member/myhealth/healthprograms': 'myHealth/healthProgramsResources',
  //'/member/myhealth/primarycare': '/updateMyPrimaryCareProvider',

  '/member/myhealth/healthprograms/caremanagement':
    '/myHealth/healthProgramsResources/myHealthPrograms/careTN',

  '/member/myhealth/healthprograms/teladocBP':
    '/myHealth/healthProgramsResources/myHealthPrograms/teladocBP',
  '/member/myhealth/healthprograms/silverFit':
    '/myHealth/healthProgramsResources/myHealthPrograms/silverFit',
  '/member/myhealth/healthprograms/hingeHealth':
    '/myHealth/healthProgramsResources/myHealthPrograms/hingeHealth',
  '/member/myhealth/healthprograms/teladocHealthDiabetesManagement':
    '/myHealth/healthProgramsResources/myHealthPrograms/teladocHealthDiabetesManagement',
  '/member/myhealth/healthprograms/questSelect':
    '/myHealth/healthProgramsResources/myHealthPrograms/questSelect',
  '/member/myhealth/healthprograms/teladocMentalHealth':
    '/myHealth/healthProgramsResources/myHealthPrograms/teladocMentalHealth',
  '/member/myhealth/healthprograms/teladocPrimaryCareProvider':
    '/myHealth/healthProgramsResources/myHealthPrograms/teladocPrimaryCareProvider',
  '/member/myhealth/healthprograms/talkToNurse':
    '/myHealth/healthProgramsResources/myHealthPrograms/talkToNurse',
  '/member/myhealth/healthprograms/teladocHealthGeneralUrgentCare':
    '/myHealth/healthProgramsResources/myHealthPrograms/teladocHealthGeneralUrgentCare',
  '/member/myhealth/healthprograms/teladocHealthDiabetesPrevention':
    '/myHealth/healthProgramsResources/myHealthPrograms/teladocHealthDiabetesPrevention',
  '/member/myhealth/healthprograms/ableTo':
    '/myHealth/healthProgramsResources/myHealthPrograms/ableTo',
  '/member/myhealth/healthprograms/teladocSecondOption':
    '/myHealth/healthProgramsResources/myHealthPrograms/teladocSecondOption',
  '/member/myhealth/healthprograms/healthymaternity':
    '/myHealth/healthProgramsResources/myHealthPrograms/HealthyMaternity',

  // 'member/myhealth/healthprograms/HealthyMaternity':
  //   '/myHealth/healthProgramsResources/myHealthPrograms//healthyMaternity',

  // findcare Paths
  '/member/findcare': '/findcare',
  '/member/findcare/virtualcare/primarycare': '/findcare/primaryCareOptions',
  '/member/findcare/dentalcosts': '/priceDentalCare',
  '/member/findcare/virtualcare/teladochealth': '/member/findcare',
  '/member/findcare/mentalHealthOptions': '/mentalHealthOptions',
  '/member/findcare/virtualcare': '/virtualCareOptions',

  // pharmacy Paths
  '/member/pharmacy': '/pharmacy',
  '/member/pharmacy/documents': '/pharmacy',

  // Profile Settings
  '/member/profile': '/profileSettings',
  '/member/profile/security': '/security',
  '/member/profile/othersettings': '/otherProfileSettings',
  '/member/profile/accountsharing': '/sharingPermissions',
  '/member/profile/accountsharing/myinfo': '/shareMyInformation',
  '/member/profile/accountsharing/access': '/accessOthersInformation',
  '/member/profile/accountsharing/personalrep': '/personalRepresentativeAccess',
  '/member/profile/accountsharing/thirdparty': '/thirdPartySharing',
  '/member/profile/communication': '/communicationSettings',
};

export const conditionalRewriteRules: Record<string, (r: VisibilityRules) => string> = {
  '/member/support': (r) => {
    if (isAHAdvisorpage(r)) {
      return '/amplifyHealthSupport';
    } else {
      return '/support';
    }
  }
};

export const wildcardRewriteRules: Record<string, string> = {
  '/member/myplan/benefits/': '/benefits/',
};
