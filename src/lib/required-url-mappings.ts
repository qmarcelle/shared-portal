export const requiredUrlMappings: Record<string, string> = {
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
  '/member/myplan/benefits/officevisits': '/benefits/details/officevisits',
  '/member/myplan/benefits/preventivecare': '/benefits/details/preventivecare',
  '/member/myplan/benefits/allergy': '/benefits/details/allergy',
  '/member/myplan/benefits/emergency': '/benefits/details/emergency',
  '/member/myplan/benefits/inpatientservices':
    '/benefits/details/inpatientservices',
  '/member/myplan/benefits/outpatientservices':
    '/benefits/details/outpatientservices',
  '/member/myplan/benefits/medicalequipment':
    '/benefits/details/medicalequipment',
  '/member/myplan/benefits/behavioralhealth':
    '/benefits/details/behavioralhealth',
  '/member/myplan/benefits/prescriptiondrugs':
    '/benefits/details/prescriptiondrugs',
  '/member/myplan/benefits/otherservices': '/benefits/details/otherservices',
  '/member/myplan/benefits/medicalservices': '/benefits',
  '/member/myplan/benefits/pharmacy': '/benefits',
  '/member/myplan/benefits/dentalanasthesia': '/benefits',
  '/member/myplan/benefits/dentalbasic': '/benefits',
  '/member/myplan/benefits/dentalpreventive': '/benefits',
  '/member/myplan/benefits/dentalendodontics': '/benefits',
  '/member/myplan/benefits/dentalmajor': '/benefits',
  '/member/myplan/benefits/dentalocculusalguard': '/benefits',
  '/member/myplan/benefits/dentalorgalsurgery': '/benefits',
  '/member/myplan/benefits/dentalorthodontic': '/benefits',
  '/member/myplan/benefits/dentalperidontics': '/benefits',
  '/member/myplan/benefits/dentalITMJ': '/benefits',
  '/member/myplan/benefits/identityprotection':
    '/benefits/identityProtectionServices',
  '/member/myplan/benefits/employerprovidedbenefits':
    '/benefits/employerProvidedBenefits',

  // MyHealth Paths
  '/member/myhealth': '/myHealth',
  '/member/myhealth/healthprograms': 'myHealth/healthProgramsResources',
  //'/member/myhealth/primarycare': '/updateMyPrimaryCareProvider',

  '/member/myhealth/healthprograms/caremanagement':
    '/myHealth/healthProgramsResources/myHealthPrograms/careTN',

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
