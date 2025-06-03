import { isBlueCareEligible } from '@/visibilityEngine/computeVisibilityRules';
import { VisibilityRules } from '@/visibilityEngine/rules';
import { SiteHeaderSubNavProps } from './composite/SiteHeaderSubNavSection';

export const getMenuNavigationTermedPlan = (
  rules: VisibilityRules,
): SiteHeaderSubNavProps[] => [
  {
    id: 2,
    title: 'My Plan',
    titleLink: 'View All Plan Details',
    description: 'This is My Plan',
    category: '',
    showOnMenu: true,
    url: '/member/myplan',
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
        url: '/member/myplan/priorauthorizations',
        external: false,
      },
      // {
      //   id: 76,
      //   title: 'Spending Summary',
      //   description: 'This is Spending Summary',
      //   category: 'Spending',
      //   showOnMenu: isBlueCareNotEligible,
      //   url: '/member/myplan/spendingsummary',
      //   external: false,
      // },
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
    url: '/member/support',
    qt: {
      // eslint-disable-next-line quotes
      firstParagraph: "We're here to help.",
      secondParagraph: (
        <p className="pb-1 text-base app-base-font-color ">
          <span className="font-bold">Start a chat</span> or call us at
          [1-800-000-0000].
        </p>
      ),
      link: '/member/support',
    },
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
