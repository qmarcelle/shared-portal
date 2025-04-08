import { Banner } from '../models/banner';

type SearchBanners = {
  [key: string]: Banner;
};

export const searchBanners: SearchBanners = {
  ClaimsFAQ_Banner: {
    title: 'Get Answers to Your Claims Questions',
    description:
      'Visit our FAQ page for more information about your claim forms.',
    link: '/member/support/FAQ/claims',
    linkText: 'Learn More',
  },
  FindADoctor_Banner: {
    title: 'Find a Provider or Estimate Costs',
    description:
      'You can search for doctors and providers in your network as well as estimate costs.',
    link: '',
    linkText: 'Find a Doctor Now',
    sso: true,
  },
  OtherInsurance_Banner: {
    title: 'Verify Other Insurance',
    description:
      'Verify if you or anyone else on your plan have other insurance so we can keep processing your claims.',
    link: '/member/myplan/otherinsurance',
    linkText: 'Confirm Other Insurance Now',
  },
  '1095B_Banner': {
    title: '1095B Form',
    description:
      'Looking for your 1095B form? If your plan qualifies to receive this form, you can submit a request for it.',
    link: '/member/support/1095bS',
    linkText: 'Visit the 1095B Page',
  },
  TeladocHealth_Banner: {
    title: 'Talk with a Care Provider',
    description:
      'Talk with a care provider, schedule an appointment or get health information 24/7 for non-emergency conditions.',
    link: '/member/findcare/virtualcare/teladochealth',
    linkText: 'Get Started with Teladoc Health',
  },
  ShopOTC_banner: {
    title: 'Shop Over-the-Counter',
    description:
      'Looking for our Over-the-Counter (OTC) catalog? Go here to learn more and shop online.',
    link: 'https://www.shopbcbstotc.com/',
    linkText: '',
    external: true,
  },
  'Formulary Banner': {
    title: 'Formulary Banner',
    description:
      "You can visit the Plan Documents page to download your plan's Medication List (formulary).",
    link: '/member/pharmacy/documents',
    linkText: 'Click Here',
  },
  // 'Find Care': {
  //   title: 'Find Care',
  //   description:
  //     'Looking for care or need to estimate care costs? You can search for care options and costs.',
  //   link: '',
  //   linkText: 'Start Here',
  //   sso: true,
  // },
  HealthyMaternity_Banner: {
    title: 'Healthy Maternity',
    description:
      'The Healthy Maternity program offers personalized pregnancy and maternity support.',
    link: '/member/myhealth/healthprograms/healthymaternity',
    linkText: 'Learn more',
  },
  EOB: {
    title: 'Explanation of Benefits',
    description:
      'To view your Explanation of Benefits (claims), you can visit the Claims page.',
    link: '/member/myplan/claims/detail',
    linkText: 'View Your Claims',
  },
  MemberDiscount_Banner: {
    title: 'Member Discounts',
    description:
      'Want access to healthy living discounts? Find savings on nutrition programs, fitness accessories, and more.',
    link: '',
    linkText: 'View All Member Discounts',
    sso: true,
  },
  FAQPage_Banner: {
    title: 'Understanding Insurance',
    description:
      'Need help understanding your plan and insurance? Visit the FAQ page to find answers to common questions about health insurance.',
    link: '/member/support/FAQ',
    linkText: 'Visit the FAQ Page',
  },
};
