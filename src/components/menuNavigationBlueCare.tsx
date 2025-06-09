import { isAHAdvisorpage } from '@/visibilityEngine/computeVisibilityRules';
import { VisibilityRules } from '@/visibilityEngine/rules';
import { SiteHeaderSubNavProps } from './composite/SiteHeaderSubNavSection';
export const getMenuBlueCareNavigation = (
  rules: VisibilityRules,
): SiteHeaderSubNavProps[] => [
  {
    id: 1,
    title: 'Find Care & Costs',
    titleLink: 'Find All Care & Costs',
    description: 'This is Find Care & Costs',
    category: '',
    showOnMenu: true,
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
      secondCol: '',
      thirdCol: 'QT',
      fourthCol: '',
    },
    childPages: [
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
      thirdCol: 'Manage My Plan',
      fourthCol: '',
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
        url: '/member/myplan/benefits',
        external: false,
      },
      {
        id: 102,
        title: 'Member Handbook',
        description: 'This is Member Handbook',
        category: 'Plan Details',
        showOnMenu: () => {
          return true;
        },
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
        url: '/member/myplan/priorauthorizations',
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

    template: {
      firstCol: 'Wellness',
      secondCol: 'Advice & Support',
      thirdCol: '',
      fourthCol: '',
    },
    childPages: [
      {
        id: 83,
        title: 'My Primary Care Provider',
        description: 'This is My Primary Care Provider',
        category: 'Wellness',
        showOnMenu: () => {
          return true;
        },
        url: '/myPrimaryCareProvider',
        external: false,
      },
      {
        id: 104,
        title: 'Health History & Needs Survey',
        description: 'This is Health History & Needs Survey',
        category: 'Wellness',
        showOnMenu: () => {
          return true;
        },
        url: 'https://bluecare.bcbst.com/get-care/your-health',
        external: true,
      },
      {
        id: 105,
        title: 'One-on-One Help',
        description: 'This is One-on-One Help',
        category: 'Advice & Support',
        showOnMenu: () => {
          return true;
        },
        url: 'https://bluecare.bcbst.com/get-care/one-on-one-help',
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
        url: 'https://bluecare.bcbst.com/healthwise/',
        external: true,
      },
    ],
    activeSubNavId: null,
    closeSubMenu: () => {},
  },
  {
    id: 4,
    title: 'Pharmacy',
    titleLink: 'This is Pharmacy',
    description: '',
    category: 'Pharmacy',
    url: 'https://www.tn.gov/tenncare/members-applicants/pharmacy.html',
    showOnMenu: false,
    template: {
      firstCol: '',
      secondCol: '',
      thirdCol: '',
      fourthCol: '',
    },
    childPages: [],
    activeSubNavId: null,
    closeSubMenu: () => {},
    visibilityRules: rules,
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
    template: {
      firstCol: 'Support',
      secondCol: '',
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
        url: 'https://bluecare.bcbst.com/get-care/faqs',
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
        url: 'https://bluecare.bcbst.com/get-care/documents-forms',
        external: true,
        openInNewWindow: true,
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
