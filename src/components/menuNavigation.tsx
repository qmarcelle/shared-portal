import {
  CVS_DEEPLINK_MAP,
  CVS_DRUG_SEARCH_INIT,
  CVS_PHARMACY_SEARCH_FAST,
  CVS_REFILL_RX,
  PROV_DIR_DEEPLINK_MAP,
  PROV_DIR_MEDICAL,
  PROV_DIR_VISION,
} from '@/app/sso/ssoConstants';
import {
  isAHAdvisorpage,
  isBiometricScreening,
  isBlueCareEligible,
  isBlueCareNotEligible,
  isChipRewardsEligible,
  isEnrollEligible,
  isHealthProgamAndResourceEligible,
  isHingeHealthEligible,
  isKatieBeckettEligible,
  isLifePointGrp,
  isManageMyPolicyEligible,
  isMentalHealthMenuOption,
  isNewMentalHealthSupportAbleToEligible,
  isNewMentalHealthSupportMyStrengthCompleteEligible,
  isNotWellnessQa,
  isNurseChatEligible,
  isPayMyPremiumEligible,
  isPriceDentalCareMenuOptions,
  isPriceVisionCareMenuOptions,
  isPrimaryCareMenuOption,
  isPrimaryCarePhysicianEligible,
  isSpendingAccountsMenuOptions,
  isTeladocEligible,
  isTeladocPrimary360Eligible,
  isWellnessOnlyBenefitsQV,
  isWellnessQa,
  payMyPremiumMedicareEligible,
} from '@/visibilityEngine/computeVisibilityRules';
import { VisibilityRules } from '@/visibilityEngine/rules';
import { SiteHeaderSubNavProps } from './composite/SiteHeaderSubNavSection';
export const getMenuNavigation = (
  rules: VisibilityRules,
): SiteHeaderSubNavProps[] => [
  {
    id: 1,
    title: 'Find Care & Costs',
    titleLink: 'Find All Care & Costs',
    description: 'This is Find Care & Costs',
    category: '',
    showOnMenu: isNotWellnessQa(rules) || isLifePointGrp(rules),
    url: '/member/findcare',
    qt: {
      // eslint-disable-next-line quotes
      firstParagraph: "Looking for what's covered under your plan?",
      secondParagraph: (
        <p className="pb-1 text-base app-base-font-color ">
          Check out your{''}
          <span className="font-bold"> Benefits & Coverages.</span>
        </p>
      ),
      link: '/member/myplan/benefits',
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
        url: '/sso/launch?PartnerSpId=' + process.env.NEXT_PUBLIC_IDP_EMBOLD,
        external: true,
        openInNewWindow: false,
      },
      {
        id: 93,
        title: 'Find a Provider',
        description: 'This is Find a Provider',
        category: 'Find Care',
        showOnMenu: () => {
          return true;
        },
        url: `/sso/launch?PartnerSpId=${process.env.NEXT_PUBLIC_IDP_PROVIDER_DIRECTORY}&redirectLink=PCPSearchRedirect`,
        external: true,
      },
      {
        id: 92,
        title: 'Primary Care Options',
        description: 'This is Primary Care Options',
        category: 'Find Care',
        showOnMenu: isPrimaryCareMenuOption,
        url: '/member/findcare/virtualcare/primarycare',
        external: false,
      },
      {
        id: 91,
        title: 'Mental Health Options',
        description: 'This is Mental Health Option',
        category: 'Find Care',
        showOnMenu: isMentalHealthMenuOption,
        url: '/mentalHealthOptions',
        external: false,
      },
      {
        id: 90,
        title: 'Virtual Care Options',
        description: 'This is Virtual Care Options',
        category: 'Find Care',
        showOnMenu: () => {
          if (
            isNewMentalHealthSupportMyStrengthCompleteEligible(rules) ||
            isNewMentalHealthSupportAbleToEligible(rules) ||
            isHingeHealthEligible(rules) ||
            isTeladocPrimary360Eligible(rules) ||
            isTeladocEligible(rules) ||
            isNurseChatEligible(rules)
          ) {
            return true;
          } else {
            return false;
          }
        },
        url: '/member/findcare/virtualcare',
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
        url: `/sso/launch?PartnerSpId=${process.env.NEXT_PUBLIC_IDP_PROVIDER_DIRECTORY}&TargetResource=${process.env.NEXT_PUBLIC_PROVIDER_DIRECTORY_VITALS_SSO_TARGET!.replace('{DEEPLINK}', PROV_DIR_DEEPLINK_MAP.get(PROV_DIR_MEDICAL)!)}`,
        external: true,
      },
      {
        id: 88,
        title: 'Price Dental Care',
        description: 'This is Price Dental Care',
        category: 'Estimate Costs',
        showOnMenu: isPriceDentalCareMenuOptions || isLifePointGrp(rules),
        url: '/member/findcare/dentalcosts',
        external: false,
      },
      {
        id: 87,
        title: 'Price Vision Care',
        description: 'This is Price Vision Care',
        category: 'Estimate Costs',
        showOnMenu: isPriceVisionCareMenuOptions,
        url: `/sso/launch?PartnerSpId=${process.env.NEXT_PUBLIC_IDP_PROVIDER_DIRECTORY}&TargetResource=${process.env.NEXT_PUBLIC_PROVIDER_DIRECTORY_VITALS_SSO_TARGET!.replace('{DEEPLINK}', PROV_DIR_DEEPLINK_MAP.get(PROV_DIR_VISION)!)}`,
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
    titleLink: 'View All Plan Details',
    description: 'This is My Plan',
    category: '',
    showOnMenu: true,
    url: '/member/myplan',
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
        showOnMenu: isNotWellnessQa || isLifePointGrp(rules),
        url: '/member/myplan/benefits',
        external: false,
      },
      {
        id: 98,
        title: 'Plan Documents',
        description: 'This is Plan Documents',
        category: 'Plan Details',
        showOnMenu: (rules) =>
          isBlueCareNotEligible(rules) && isNotWellnessQa(rules),
        url: '/member/myplan/benefits/plandocuments',
        external: false,
      },
      {
        id: 97,
        title: 'Services Used',
        description: 'This is Services Used',
        category: 'Plan Details',
        showOnMenu: (rules) =>
          isBlueCareNotEligible(rules) && isNotWellnessQa(rules),
        url: '/member/myplan/servicesused',
        external: false,
      },
      {
        id: 102,
        title: 'Member Handbook',
        description: 'This is Member Handbook',
        category: 'Plan Details',
        showOnMenu: (rules) =>
          isBlueCareEligible(rules) ||
          isWellnessQa(rules) ||
          isWellnessOnlyBenefitsQV(rules),
        url: process.env.NEXT_PUBLIC_BLUECARE_FIND_FORM_URL ?? '',
        external: true,
        openInNewWindow: true,
      },
      {
        id: 96,
        title: 'View Claims',
        description: 'This is View Claims',
        category: 'Claims',
        showOnMenu: () => {
          return true;
        },
        url: '/member/myplan/claims',
        external: false,
      },
      {
        id: 95,
        title: 'Prior Authorizations',
        description: 'This is Prior Authorizations',
        category: 'Claims',
        showOnMenu: isNotWellnessQa,
        url: '/member/myplan/priorauthorizations',
        external: false,
      },
      {
        id: 94,
        title: 'Submit a Claim',
        description: 'This is Submit a Claim',
        category: 'Claims',
        showOnMenu: isNotWellnessQa,
        url: '/member/myplan/claims/submit',
        external: false,
      },
      {
        id: 78,
        title: 'Balances',
        description: 'This is Balances',
        category: 'Spending',
        showOnMenu: (rules) =>
          isBlueCareNotEligible(rules) && isNotWellnessQa(rules),
        url: '/member/myplan/benefits/balances',
        external: false,
      },
      {
        id: 77,
        title: 'Spending Accounts (HSA, FSA)',
        description: 'This is Spending Accounts (HSA, FSA)',
        category: 'Spending',
        showOnMenu: (rules) =>
          isNotWellnessQa(rules) && isSpendingAccountsMenuOptions(rules),
        url: '/member/myplan/spendingaccounts',
        external: false,
      },
      {
        id: 76,
        title: 'Spending Summary',
        description: 'This is Spending Summary',
        category: 'Spending',
        showOnMenu: (rules) =>
          isBlueCareNotEligible(rules) && isNotWellnessQa(rules),
        url: '/member/myplan/spendingsummary',
        external: false,
      },
      {
        id: 75,
        title: 'View or Pay Premium',
        description: 'This is View or Pay Premium',
        category: 'Manage My Plan',
        showOnMenu: (rules) =>
          isBlueCareNotEligible(rules) &&
          isNotWellnessQa(rules) &&
          payMyPremiumMedicareEligible(rules) &&
          isPayMyPremiumEligible(rules),
        url: '/balances',
        external: true,
      },
      {
        id: 74,
        title: 'Enroll in a Health Plan',
        description: 'This is Enroll in a Health Plan',
        category: 'Manage My Plan',
        showOnMenu: (rules) =>
          isEnrollEligible(rules) &&
          isBlueCareNotEligible(rules) &&
          isNotWellnessQa(rules),
        url: 'https://www.bcbst.com/secure/restricted/apps/eNrollWizardWeb/entrypoint.do',
        external: true,
      },
      {
        id: 101,
        title: 'Manage My Policy',
        description: 'This is Manage My Policy',
        category: 'Manage My Plan',
        showOnMenu: (rules) =>
          isBlueCareNotEligible(rules) &&
          isNotWellnessQa(rules) &&
          isManageMyPolicyEligible(rules),
        url: '',
        external: false,
      },
      {
        id: 73,
        title: 'Report Other Health Insurance',
        description: 'This is Report Other Health Insurance',
        category: 'Manage My Plan',
        showOnMenu: (rules) =>
          isBlueCareNotEligible(rules) && isNotWellnessQa(rules),
        url: '/member/myplan/otherinsurance',
        external: false,
      },
      {
        id: 73,
        title: 'Update Katie Beckett Banking Info',
        description: 'This is Updating Katie Beckett Banking Info',
        category: 'Manage My Plan',
        showOnMenu: isKatieBeckettEligible,
        url: '/member/myplan/katiebeckett',
        external: false,
      },
    ],
    activeSubNavId: null,
    closeSubMenu: () => {},
  },
  {
    id: 3,
    title: 'My Health',
    titleLink: 'View My Health Dashboard',
    description: 'This is My Health',
    category: '',
    showOnMenu: true,
    url: '/member/myhealth',
    qt: isNotWellnessQa(rules)
      ? {
          firstParagraph:
            'Looking for a virtual care provider for mental health or physical therapy?',
          secondParagraph: (
            <p className="pb-1 text-base app-base-font-color ">
              View <span className="font-bold">Virtual Care Options.</span>
            </p>
          ),
          link: '/member/findcare/virtualcare',
        }
      : undefined,
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
        showOnMenu: (rules) =>
          isNotWellnessQa(rules) && isChipRewardsEligible(rules),
        url: `/sso/launch?PartnerSpId=${process.env.NEXT_PUBLIC_IDP_CHIP_REWARDS}`,
        external: true,
      },
      {
        id: 84,
        title: 'Member Wellness Center',
        description: 'This is Member Wellness Center',
        category: 'Wellness',
        showOnMenu: () => {
          return true;
        },
        url: `/sso/launch?PartnerSpId=${process.env.NEXT_PUBLIC_IDP_ON_LIFE}`,
        external: true,
      },
      {
        id: 103,
        title: 'Biometric Screening',
        description: 'This is Biometric Screening',
        category: 'Wellness',
        showOnMenu: (rules) =>
          isNotWellnessQa(rules) && isBiometricScreening(rules),
        url: `/sso/launch?PartnerSpId=${process.env.NEXT_PUBLIC_IDP_PREMISE_HEALTH}`,
        external: true,
      },
      {
        id: 83,
        title: 'My Primary Care Provider',
        description: 'This is My Primary Care Provider',
        category: 'Wellness',
        showOnMenu: (rules) =>
          isNotWellnessQa(rules) && isPrimaryCarePhysicianEligible(rules),
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
        url: `/sso/launch?PartnerSpId=${process.env.NEXT_PUBLIC_IDP_BLUE_365}&TargetResource=${process.env.NEXT_PUBLIC_BLUE_365_CATEGORY_SSO_TARGET}`,
        external: true,
      },
      {
        id: 81,
        title: 'Health Programs & Resources',
        description: 'This is Health Programs & Resources',
        category: 'Advice & Support',
        showOnMenu: isHealthProgamAndResourceEligible,
        url: '/member/myhealth/healthprograms',
        external: false,
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
        showOnMenu: isBlueCareNotEligible,
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
    titleLink: 'View All Pharmacy',
    description: 'This is Pharmacy',
    category: '',
    showOnMenu: isNotWellnessQa(rules),
    url: '/member/pharmacy',
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
      { title: 'Pharmacy Spending', link: '/member/myplan/spendingsummary' },
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
        url: `/sso/launch?PartnerSpId=${process.env.NEXT_PUBLIC_IDP_CVS_CAREMARK}&TargetResource=${process.env.NEXT_PUBLIC_CVS_SSO_TARGET?.replace('{DEEPLINK}', CVS_DEEPLINK_MAP.get(CVS_REFILL_RX)!)}`,
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
        url: `/sso/launch?PartnerSpId=${process.env.NEXT_PUBLIC_IDP_CVS_CAREMARK}&TargetResource=${process.env.NEXT_PUBLIC_CVS_SSO_TARGET?.replace('{DEEPLINK}', CVS_DEEPLINK_MAP.get(CVS_DRUG_SEARCH_INIT)!)}`,
        external: true,
        openInNewWindow: false,
      },
      {
        id: 70,
        title: 'Mail Order',
        description: 'This is Mail Order',
        category: 'Manage My Prescriptions',
        showOnMenu: () => {
          return true;
        },
        url: `/sso/launch?PartnerSpId=${process.env.NEXT_PUBLIC_IDP_CVS_CAREMARK}&TargetResource=${process.env.NEXT_PUBLIC_CVS_SSO_TARGET?.replace('{DEEPLINK}', CVS_DEEPLINK_MAP.get(CVS_REFILL_RX)!)}`,
        external: true,
        openInNewWindow: false,
      },
      {
        id: 100,
        title: 'Find a Pharmacy',
        description: 'This is Find a Pharmacy',
        category: 'Manage My Prescriptions',
        showOnMenu: () => {
          return true;
        },
        url: `/sso/launch?PartnerSpId=${process.env.NEXT_PUBLIC_IDP_CVS_CAREMARK}&TargetResource=${process.env.NEXT_PUBLIC_CVS_SSO_TARGET?.replace('{DEEPLINK}', CVS_DEEPLINK_MAP.get(CVS_PHARMACY_SEARCH_FAST)!)}`,
        external: true,
        openInNewWindow: false,
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
    titleLink: 'View All Support',
    description: 'This is Support',
    category: '',
    showOnMenu: true,
    url: isAHAdvisorpage(rules)
      ? '/member/amplifyhealthsupport'
      : '/member/support',
    qt: {
      // eslint-disable-next-line quotes
      firstParagraph: "We're here to help.",
      secondParagraph: (
        <p className="pb-1 text-base app-base-font-color ">
          <span className="font-bold">Start a chat</span> or call us at
          [1-800-000-0000].
        </p>
      ),
      link: isAHAdvisorpage(rules)
        ? '/member/amplifyhealthsupport'
        : '/member/support',
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
        url: '/member/support/FAQ',
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
