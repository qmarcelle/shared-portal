import {
  isBlueCareEligible,
  isBlueCareNotEligible,
} from '@/visibilityEngine/computeVisibilityRules';
import { VisibilityRules } from '@/visibilityEngine/rules';
import { SiteHeaderSubNavProps } from './composite/SiteHeaderSubNavSection';

export const getMenuNavigationTermedPlan = (
  rules: VisibilityRules,
): SiteHeaderSubNavProps[] => [
  {
    id: 2,
    title: 'My Plan',
    description: 'This is My Plan',
    category: '',
    showOnMenu: true,
    url: '/myPlan',
    template: {
      firstCol: 'Claims',
      secondCol: 'Spending',
      thirdCol: '',
      fourthCol: '',
    },
    childPages: [
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
        id: 76,
        title: 'Spending Summary',
        description: 'This is Spending Summary',
        category: 'Spending',
        showOnMenu: isBlueCareNotEligible,
        url: '/spendingSummary',
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
