import { externalIcon } from '@/components/foundation/Icons';
import { VisibilityRules } from '@/visibilityEngine/rules';
import Image from 'next/image';
import { ManageBenefitsItems } from '../components/MedicalPharmacyDentalCard';

export const generateOtherBenefitsForUser = (
  vRules: VisibilityRules,
  enableEmployerBenefits: boolean,
): ManageBenefitsItems[] => {
  const otherBenefitItems: ManageBenefitsItems[] = [];
  if (vRules === undefined) {
    return otherBenefitItems;
  }
  if (vRules.identityProtectionServices) {
    otherBenefitItems.push({
      title: 'Identity Protection Services',
      body: 'Keeping your medical information secure is more important than ever. That’s why we offer identity theft protection with our eligible plans—free of charge.',
      externalLink: false,
      url: '/benefits/identityProtectionServices',
    });
  }
  otherBenefitItems.push({
    title: 'Health Programs & Resources',
    body: 'Your plan includes programs, guides and discounts to help make taking charge of your health easier and more affordable.',
    externalLink: false,
    url: 'url',
  });
  if (vRules.active && vRules.otcEnable) {
    otherBenefitItems.push({
      title: 'Shop Over-the-Counter Items',
      body: 'You get a quarterly allowance for over-the-counter (OTC) items. You can spend it on things like cold medicine, vitamins and more. And once you set up an account, you can even shop for those items online. Set up or log in to your online account to get OTC items shipped right to your door.',
      externalLink: false,
      icon: <Image src={externalIcon} alt="link" />,
    });
  }
  if (vRules.commercial && vRules.bluePerksElig) {
    otherBenefitItems.push({
      title: 'Member Discounts',
      body: 'Your plan includes programs, guides and discounts to help make taking charge of your health easier and more affordable.',
      externalLink: false,
      url: 'url',
      icon: <Image src={externalIcon} alt="link" />,
    });
  }

  if (enableEmployerBenefits) {
    otherBenefitItems.push({
      title: 'Employer Provided Benefits',
      body: 'Your employer offers even more programs and benefits you can explore here.',
      externalLink: false,
      url: '/benefits/employerProvidedBenefits',
    });
  }
  return otherBenefitItems;
};
