import { CVS_DEEPLINK_MAP, CVS_DRUG_SEARCH_INIT } from '@/app/sso/ssoConstants';
import {
  isBiometricScreening,
  isBlueCareAndPrimaryCarePhysicianEligible,
  isBlueCareEligible,
  isBlueCareNotEligible,
  isEnrollEligible,
  isHealthProgamAndResourceEligible,
  isHingeHealthEligible,
  isMentalHealthMenuOption,
  isNewMentalHealthSupportAbleToEligible,
  isNewMentalHealthSupportMyStrengthCompleteEligible,
  isNurseChatEligible,
  isPriceDentalCareMenuOptions,
  isPriceVisionCareMenuOptions,
  isPrimaryCareMenuOption,
  isSpendingAccountsMenuOptions,
  isTeladocEligible,
  isTeledocPrimary360Eligible,
} from '@/visibilityEngine/computeVisibilityRules';
import { VisibilityRules } from '@/visibilityEngine/rules';
import { SiteHeaderSubNavProps } from './composite/SiteHeaderSubNavSection';

export const getMenuNavigation = (
  rules: VisibilityRules,
): SiteHeaderSubNavProps[] => [
  {
    id: 1,
    title: 'Find Care & Costs',
    description: 'This is Find Care & Costs',
    category: '',
    showOnMenu: true,
    url: '/findcare',
    qt: {
      // eslint-disable-next-line quotes
      firstParagraph: "Looking for what's covered under your plan?",
      secondParagraph: (
        <p className="pb-1 text-base app-base-font-color ">
          Check out your{''}
          <span className="font-bold"> Benefits & Coverages.</span>
        </p>
      ),
      link: '/benefits',
    },
    template: {
      firstCol: 'Find Care',
      secondCol: 'Estimate Costs',
      thirdCol: 'QT',
      fourthCol: '',
    },
    childPages: [
      {
        id: 94,
        title: 'Find a Medical Provider',
        description: 'This is Find a Provider',
        category: 'Find Care',
        showOnMenu: isBlueCareNotEligible,
        url: '/findprovider',
        external: true,
      },
      {
        id: 93,
        title: 'Find a Provider',
        description: 'This is Find a Provider',
        category: 'Find Care',
        showOnMenu: () => {
          return true;
        },
        url: '/findprovider',
        external: true,
      },
      {
        id: 92,
        title: 'Primary Care Options',
        description: 'This is Primary Care Options',
        category: 'Find Care',
        showOnMenu: isPrimaryCareMenuOption,
        url: 'findcare/primaryCareOptions',
        external: false,
      },
      {
        id: 91,
        title: 'Mental Health Options',
        description: 'This is Mental Health Option',
        category: 'Find Care',
        showOnMenu: isMentalHealthMenuOption,
        url: 'findcare/mentalHealthOptions',
        external: false,
      },
      {
        id: 90,
        title: 'Virtual Care Options',
        description: 'This is Virtual Care Options',
        category: 'Find Care',
        showOnMenu: () => {
          if (
            isNewMentalHealthSupportMyStrengthCompleteEligible(rules) &&
            isNewMentalHealthSupportAbleToEligible(rules) &&
            isHingeHealthEligible(rules) &&
            isTeledocPrimary360Eligible(rules) &&
            isTeladocEligible(rules) &&
            isNurseChatEligible(rules)
          ) {
            return true;
          } else {
            return false;
          }
        },
        url: '/virtualCareOptions',
        external: false,
      },
      {
        id: 89,
        title: 'Price Medical Care',
        description: 'This is Price Medical Care',
        category: 'Estimate Costs',
        showOnMenu: () => {
          return true;
        },
        url: '/pricemedicalcare',
        external: true,
      },
      {
        id: 88,
        title: 'Price Dental Care',
        description: 'This is Price Dental Care',
        category: 'Estimate Costs',
        showOnMenu: isPriceDentalCareMenuOptions,
        url: '/priceDentalCare',
        external: false,
      },
      {
        id: 87,
        title: 'Price Vision Care',
        description: 'This is Price Vision Care',
        category: 'Estimate Costs',
        showOnMenu: isPriceVisionCareMenuOptions,
        url: '/pricevisioncare',
        external: true,
      },
      {
        id: 86,
        title: 'Price a Medication',
        description: 'This is Price a Medication',
        category: 'Estimate Costs',
        showOnMenu: isBlueCareNotEligible,
        url: `/sso/launch?PartnerSpId=${process.env.NEXT_PUBLIC_IDP_CVS_CAREMARK}&TargetResource=${process.env.NEXT_PUBLIC_CVS_SSO_TARGET?.replace('{DEEPLINK}', CVS_DEEPLINK_MAP.get(CVS_DRUG_SEARCH_INIT)!)}`,
        external: true,
        openInNewWindow: false,
      },
    ],
    activeSubNavId: null,
    closeSubMenu: () => {},
  },
  {
    id: 2,
    title: 'My Plan',
    description: 'This is My Plan',
    category: '',
    showOnMenu: true,
    url: '/myPlan',
    template: {
      firstCol: 'Plan Details',
      secondCol: 'Claims',
      thirdCol: 'Spending',
      fourthCol: 'Manage My Plan',
    },
    childPages: [
      {
        id: 99,
        title: 'Benefits & Coverage',
        description: 'This is Benefits & Coverage',
        category: 'Plan Details',
        showOnMenu: () => {
          return true;
        },
        url: '/benefits',
        external: false,
      },
      {
        id: 98,
        title: 'Plan Documents',
        description: 'This is Plan Documents',
        category: 'Plan Details',
        showOnMenu: isBlueCareNotEligible,
        url: '/benefits/planDocuments',
        external: false,
      },
      {
        id: 97,
        title: 'Services Used',
        description: 'This is Services Used',
        category: 'Plan Details',
        showOnMenu: isBlueCareNotEligible,
        url: '/benefits/servicesUsed',
        external: false,
      },
      {
        id: 102,
        title: 'Member Handbook',
        description: 'This is Member Handbook',
        category: 'Plan Details',
        showOnMenu: isBlueCareEligible,
        url: 'https://bluecare.bcbst.com/get-care/documents-forms',
        external: true,
      },
      {
        id: 96,
        title: 'View Claims',
        description: 'This is View Claims',
        category: 'Claims',
        showOnMenu: () => {
          return true;
        },
        url: '/claims',
        external: false,
      },
      {
        id: 95,
        title: 'Prior Authorizations',
        description: 'This is Prior Authorizations',
        category: 'Claims',
        showOnMenu: () => {
          return true;
        },
        url: '/priorAuthorization',
        external: false,
      },
      {
        id: 94,
        title: 'Submit a Claim',
        description: 'This is Submit a Claim',
        category: 'Claims',
        showOnMenu: () => {
          return true;
        },
        url: '/claims/submitAClaim',
        external: false,
      },
      {
        id: 78,
        title: 'Balances',
        description: 'This is Balances',
        category: 'Spending',
        showOnMenu: isBlueCareNotEligible,
        url: '/benefits/balances',
        external: false,
      },
      {
        id: 77,
        title: 'Spending Accounts (HSA, FSA)',
        description: 'This is Spending Accounts (HSA, FSA)',
        category: 'Spending',
        showOnMenu: isSpendingAccountsMenuOptions,
        url: '/spendingAccounts',
        external: false,
      },
      {
        id: 76,
        title: 'Spending Summary',
        description: 'This is Spending Summary',
        category: 'Spending',
        showOnMenu: isBlueCareNotEligible,
        url: '/spendingSummary',
        external: false,
      },
      {
        id: 75,
        title: 'View or Pay Premium',
        description: 'This is View or Pay Premium',
        category: 'Manage My Plan',
        showOnMenu: isBlueCareNotEligible,
        url: '/balances',
        external: true,
      },
      {
        id: 74,
        title: 'Enroll in a Health Plan',
        description: 'This is Enroll in a Health Plan',
        category: 'Manage My Plan',
        showOnMenu: (rules) =>
          isEnrollEligible(rules) && isBlueCareNotEligible(rules),
        url: 'https://www.bcbst.com/secure/restricted/apps/eNrollWizardWeb/entrypoint.do',
        external: true,
      },
      {
        id: 101,
        title: 'Manage My Policy',
        description: 'This is Manage My Policy',
        category: 'Manage My Plan',
        showOnMenu: isBlueCareNotEligible,
        url: '',
        external: false,
      },
      {
        id: 73,
        title: 'Report Other Health Insurance',
        description: 'This is Report Other Health Insurance',
        category: 'Manage My Plan',
        showOnMenu: isBlueCareNotEligible,
        url: '/reportOtherHealthInsurance',
        external: false,
      },
      {
        id: 73,
        title: 'Update Katie Beckett Banking Info',
        description: 'This is Updating Katie Beckett Banking Info',
        category: 'Manage My Plan',
        showOnMenu: () => {
          return true;
        },
        url: 'myPlan/katieBeckettBankingInfo',
        external: false,
      },
    ],
    activeSubNavId: null,
    closeSubMenu: () => {},
  },
  {
    id: 3,
    title: 'My Health',
    description: 'This is My Health',
    category: '',
    showOnMenu: true,
    url: '/myHealth',
    qt: {
      firstParagraph:
        'Looking for a virtual care provider for mental health or physical therapy?',
      secondParagraph: (
        <p className="pb-1 text-base app-base-font-color ">
          View <span className="font-bold">Virtual Care Options.</span>
        </p>
      ),
      link: '/virtualCareOptions',
    },
    template: {
      firstCol: 'Wellness',
      secondCol: 'Advice & Support',
      thirdCol: 'QT',
      fourthCol: '',
    },
    childPages: [
      {
        id: 85,
        title: 'Wellness Rewards',
        description: 'This is Wellness Rewards',
        category: 'Wellness',
        showOnMenu: () => {
          return true;
        },
        url: '/wellnessrewards',
        external: true,
      },
      {
        id: 84,
        title: 'Member Wellness Canter',
        description: 'This is Member Wellness Canter',
        category: 'Wellness',
        showOnMenu: () => {
          return true;
        },
        url: '/memberwellnesscenter',
        external: true,
      },
      {
        id: 103,
        title: 'Biometric Screening',
        description: 'This is Biometric Screening',
        category: 'Wellness',
        showOnMenu: isBiometricScreening,
        url: '/biometricscreening',
        external: true,
      },
      {
        id: 83,
        title: 'My Primary Care Provider',
        description: 'This is My Primary Care Provider',
        category: 'Wellness',
        showOnMenu: isBlueCareAndPrimaryCarePhysicianEligible,
        url: '/myPrimaryCareProvider',
        external: false,
      },
      {
        id: 82,
        title: 'Member Discounts',
        description: 'This is Member Discounts',
        category: 'Wellness',
        showOnMenu: () => {
          return true;
        },
        url: '/memberdiscounts',
        external: true,
      },
      {
        id: 81,
        title: 'Health Programs & Resources',
        description: 'This is Health Programs & Resources',
        category: 'Advice & Support',
        showOnMenu: isHealthProgamAndResourceEligible,
        url: '/myHealth/healthProgramsResources',
        external: false,
      },
      {
        id: 80,
        title: 'Dental Health Library',
        description: 'This is Dental Health Library',
        category: 'Advice & Support',
        showOnMenu: () => {
          return true;
        },
        url: 'https://bcbstwelltuned.com/',
        external: true,
      },
      {
        id: 79,
        title: 'Health Library',
        description: 'This is Health Library',
        category: 'Advice & Support',
        showOnMenu: () => {
          return true;
        },
        url: 'https://www.healthwise.net/bcbst/Content/CustDocument.aspx?XML=STUB.XML&XSL=CD.FRONTPAGE.XSL&sv=881d5daa-1051-f477-21f5-a05f3e6cdf78',
        external: true,
      },
      {
        id: 78,
        title: 'WellTuned Blog',
        description: 'This is WellTuned Blog',
        category: 'Advice & Support',
        showOnMenu: () => {
          return true;
        },
        url: 'https://bcbstwelltuned.com/',
        external: true,
      },
    ],
    activeSubNavId: null,
    closeSubMenu: () => {},
  },
  {
    id: 4,
    title: 'Pharmacy',
    description: 'This is Pharmacy',
    category: '',
    showOnMenu: true,
    url: '/pharmacy',
    qt: {
      firstParagraph: 'CVS Caremark™ helps manage your pharmacy benefits.',
      secondParagraph: (
        <p className="pb-1 text-base app-base-font-color ">
          <span className="font-bold">A caremark.com</span> account will let you
          get prescriptions by mail, price a medication and more.
        </p>
      ),
      link: `/sso/launch?PartnerSpId=${process.env.NEXT_PUBLIC_IDP_CVS_CAREMARK}`,
    },
    shortLinks: [
      { title: 'Pharmacy Claims', link: '/claimSnapshotList' },
      { title: 'Pharmacy Spending', link: '/spendingSummary' },
    ],
    template: {
      firstCol: 'QT',
      secondCol: 'Manage My Prescriptions',
      thirdCol: 'Resources & Support',
      fourthCol: 'LINKS',
    },
    childPages: [
      {
        id: 72,
        title: 'My Prescriptions',
        description: 'This is My Prescriptions',
        category: 'Manage My Prescriptions',
        showOnMenu: () => {
          return true;
        },
        url: 'https://www.caremark.com/refillRx?newLogin=yes',
        external: true,
      },
      {
        id: 71,
        title: 'Price a Medication',
        description: 'This is Price a Medication',
        category: 'Manage My Prescriptions',
        showOnMenu: () => {
          return true;
        },
        url: 'https://www.caremark.com/drugSearchInit.do?newLogin=yes',
        external: true,
      },
      {
        id: 70,
        title: 'Mail Order',
        description: 'This is Mail Order',
        category: 'Manage My Prescriptions',
        showOnMenu: () => {
          return true;
        },
        url: 'https://www.caremark.com/refillRx?newLogin=yes',
        external: true,
      },
      {
        id: 100,
        title: 'Find a Pharmacy',
        description: 'This is Find a Pharmacy',
        category: 'Manage My Prescriptions',
        showOnMenu: () => {
          return true;
        },
        url: 'https://www.caremark.com/pharmacySearchFast?newLogin=yes',
        external: true,
      },
      {
        id: 69,
        title: 'Pharmacy Documents & Forms',
        description: 'This is Pharmacy Documents & Forms',
        category: 'Resources & Support',
        showOnMenu: () => {
          return true;
        },
        url: '/pharmacy',
        external: false,
      },
      {
        id: 81,
        title: 'Pharmacy FAQ',
        description: 'This is Pharmacy FAQ',
        category: 'Resources & Support',
        showOnMenu: () => {
          return true;
        },
        url: '/pharmacy',
        external: false,
      },
    ],
    activeSubNavId: null,
    closeSubMenu: () => {},
  },
  {
    id: 5,
    title: 'Support',
    description: 'This is Support',
    category: '',
    showOnMenu: true,
    url: '/support',
    qt: {
      // eslint-disable-next-line quotes
      firstParagraph: "We're here to help.",
      secondParagraph: (
        <p className="pb-1 text-base app-base-font-color ">
          <span className="font-bold">Start a chat</span> or call us at
          [1-800-000-0000].
        </p>
      ),
      link: '/support',
    },
    template: {
      firstCol: 'QT',
      secondCol: 'Support',
      thirdCol: '',
      fourthCol: '',
    },
    childPages: [
      {
        id: 82,
        title: 'Frequently Asked Questions',
        description: 'Frequently Asked Questions',
        category: 'Support',
        showOnMenu: () => {
          return true;
        },
        url: '/support/faq',
        external: false,
      },
      {
        id: 83,
        title: 'Health Insurance Glossary',
        description: 'Health Insurance Glossary',
        category: 'Support',
        showOnMenu: () => {
          return true;
        },
        url: 'https://www.healthcare.gov/glossary/',
        external: true,
      },
      {
        id: 84,
        title: 'Find a Form',
        description: 'Find a Form',
        category: 'Support',
        showOnMenu: () => {
          return true;
        },
        url: isBlueCareEligible(rules)
          ? process.env.NEXT_PUBLIC_BLUECARE_FIND_FORM_URL!
          : 'https://www.bcbst.com/use-insurance/documents-forms/',
        external: isBlueCareEligible(rules) ?? false,
      },
      {
        id: 85,
        title: 'Share Website Feedback',
        description: 'Share Website Feedback',
        category: 'Support',
        showOnMenu: () => {
          return true;
        },
        url: '/shareWebsiteFeedback',
        external: false,
      },
    ],
    activeSubNavId: null,
    closeSubMenu: () => {},
  },
];
