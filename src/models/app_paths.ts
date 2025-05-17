type AppPath = {
  path: string;
  label: string;
};

export const appPaths: Map<string, AppPath> = new Map([
  [
    'dashboard',
    {
      label: 'Dashboard',
      path: '/dashboard',
    },
  ],
  [
    'security',
    {
      label: 'Security Settings',
      path: '/security',
    },
  ],
  [
    'profile',
    {
      label: 'Profile Settings',
      path: '/member/profile',
    },
  ],
  [
    'inbox',
    {
      label: 'Inbox',
      path: '/inbox',
    },
  ],
  [
    'benefits',
    {
      label: 'Benefits & Coverage',
      path: '/benefits',
    },
  ],
  [
    'balances',
    {
      label: 'Balances',
      path: '/balances',
    },
  ],
  [
    'spendingsummary',
    {
      label: 'Annual Statement',
      path: '/spendingsummary',
    },
  ],
  [
    'myplan',
    {
      label: 'My Plan',
      path: '/member/myplan',
    },
  ],
  [
    'otherinsurance',
    {
      label: 'Other Insurance',
      path: '/otherinsurance',
    },
  ],
  [
    'katiebeckett',
    {
      label: 'Katie Beckett Form',
      path: '/katiebeckett',
    },
  ],
  [
    'claims',
    {
      label: 'Claims',
      path: '/claims',
    },
  ],
  [
    'spendingaccounts',
    {
      label: 'Spending Accounts',
      path: '/spendingAccounts',
    },
  ],
  [
    'priorauthorizations',
    {
      label: 'Authorizations',
      path: '/priorAuthorization',
    },
  ],
  [
    'plandocuments',
    {
      label: 'Drug List / Formulary',
      path: '/planDocuments',
    },
  ],
  [
    'servicesused',
    {
      label: 'Services Used',
      path: '/servicesUsed',
    },
  ],
  [
    'findcare',
    {
      label: 'Find Care & Costs',
      path: '/findcare',
    },
  ],
  [
    'dentalcosts',
    {
      label: 'Dental cost estimator',
      path: '/priceDentalCare',
    },
  ],
  [
    'primarycare',
    {
      label: 'Primary Care Options',
      path: '/primaryCareOptions',
    },
  ],
  [
    'mentalhealthoptions',
    {
      label: 'Mental Health Options',
      path: '/mentalHealthOptions',
    },
  ],
  [
    'myhealth',
    {
      label: 'My Health',
      path: '/member/myhealth',
    },
  ],
  [
    'healthprograms',
    {
      label: 'Health Programs & Resources',
      path: '/healthprograms',
    },
  ],
  [
    'inbox',
    {
      label: 'Document Center',
      path: '/inbox',
    },
  ],
  [
    'submit',
    {
      label: 'Submit Claim',
      path: '/submitAClaim',
    },
  ],
  [
    'support',
    {
      label: 'Support',
      path: '/member/support',
    },
  ],
  [
    'faq',
    {
      label: 'Frequently Asked Questions',
      path: '/FAQ',
    },
  ],
  [
    'benefitsfaq',
    {
      label: 'Benefits & Coverage FAQ',
      path: '/benefitsfaq',
    },
  ],
  [
    'idcard',
    {
      label: 'ID Cards FAQ',
      path: '/idcard',
    },
  ],
  [
    'accountsharing',
    {
      label: 'Sharing & Permissions',
      path: '/accountsharing',
    },
  ],
  [
    'myinfo',
    {
      label: 'Share My Information',
      path: '/myinfo',
    },
  ],
  [
    'access',
    {
      label: "Access Others' Information",
      path: '/access',
    },
  ],
  [
    'personalrep',
    {
      label: 'Personal Representative Access',
      path: '/personalrep',
    },
  ],
  [
    'thirdparty',
    {
      label: 'Third Party Sharing',
      path: '/thirdparty',
    },
  ],
  [
    'othersettings',
    {
      label: 'Other Settings',
      path: '/othersettings',
    },
  ],
  [
    'email',
    {
      label: 'Send An Email',
      path: '/email',
    },
  ],
  [
    '1095b',
    {
      label: '1095B Request',
      path: '/email',
    },
  ],
  [
    'ssn',
    {
      label: 'Social Security Number',
      path: '/ssn',
    },
  ],
  [
    'plancontact',
    {
      label: 'Plan Contact Information',
      path: '/plancontact',
    },
  ],
  [
    'managepolicy',
    {
      label: 'Manage My Policy',
      path: '/managepolicy',
    },
  ],
  [
    'identityprotection',
    {
      label: 'Identity Protection Services',
      path: '/managepolicy',
    },
  ],
  [
    'employerprovidedbenefits',
    {
      label: 'Employer Provided Benefits',
      path: '/employerprovidedbenefits',
    },
  ],
  [
    'documents',
    {
      label: 'Documents',
      path: '/documents',
    },
  ],
  [
    'communication',
    {
      label: 'Communication Settings',
      path: '/communication',
    },
  ],
  [
    'officevisits',
    {
      label: 'Office Visits',
      path: '/officevisits',
    },
  ],
  [
    'preventivecare',
    {
      label: 'Preventive Care',
      path: '/preventivecare',
    },
  ],
  [
    'allergy',
    {
      label: 'Allergy',
      path: '/allergy',
    },
  ],
  [
    'emergency',
    {
      label: 'Emergency',
      path: '/emergency',
    },
  ],
  [
    'inpatientservices',
    {
      label: 'Inpatient Services',
      path: '/inpatientservices',
    },
  ],
  [
    'outpatientservices',
    {
      label: 'Outpatient Services',
      path: '/outpatientservices',
    },
  ],
  [
    'medicalequipment',
    {
      label: 'Medical Equipment',
      path: '/medicalequipment',
    },
  ],
  [
    'behavioralhealth',
    {
      label: 'Behavioral Health',
      path: '/behavioralhealth',
    },
  ],
  [
    'prescriptiondrugs',
    {
      label: 'Prescription Drugs',
      path: '/prescriptiondrugs',
    },
  ],
  [
    'otherservices',
    {
      label: 'Other Services',
      path: '/otherservices',
    },
  ],
  [
    'caremanagement',
    {
      label: 'CareTN One-One Health Support',
      path: '/caremanagement',
    },
  ],
  [
    'virtualcare',
    {
      label: 'Virtual Care Options',
      path: '/virtualcare',
    },
  ],
  [
    'healthymaternity',
    {
      label: 'Healthy Maternity',
      path: '/healthymaternity',
    },
  ],
  [
    'redetermination',
    {
      label: 'Drug Redetermination Form',
      path: '/redetermination',
    },
  ],
  [
    'determination',
    {
      label: 'Drug Determination Form',
      path: '/determination',
    },
  ],
]);
