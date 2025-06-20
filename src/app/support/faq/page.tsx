'use client';
import { InfoCard } from '@/components/composite/InfoCard';
import { Column } from '@/components/foundation/Column';
import { Header } from '@/components/foundation/Header';
import {
  benefits,
  claimsBenefitsCoverage,
  enrollment,
  idCardPrimaryIconSvg,
  keyIcon,
  prescription,
  priorAuthorizations,
} from '@/components/foundation/Icons';
import { Spacer } from '@/components/foundation/Spacer';
import { TextBox } from '@/components/foundation/TextBox';

const FrequentlyAskedQuestions = () => {
  const faqInformationDetails = [
    {
      label: 'Benefits & Coverage',
      description: 'Learn more about service limits, deductibles and more.',
      iconName: benefits,
      link: '/member/support/FAQ/benefits',
    },
    {
      label: 'Claims',
      description: 'Learn more about claims or how to file a dispute.',
      iconName: claimsBenefitsCoverage,
      link: '/member/support/FAQ/claims',
    },
    {
      label: 'ID Cards',
      description:
        // eslint-disable-next-line quotes
        "Do you have questions about your ID cards? We're here to help.",
      iconName: idCardPrimaryIconSvg,
      link: '/member/support/FAQ/idcard',
    },
    {
      label: 'My Plan Information',
      description: 'How to update your address, dependents, and more.',
      iconName: enrollment,
      link: '/member/support/FAQ/myplan',
    },
    {
      label: 'Pharmacy',
      description:
        'How to find pharmacies, find prescription drug coverage and more.',
      iconName: prescription,
      link: '/member/support/FAQ/pharmacy',
    },
    {
      label: 'Prior Authorization',
      description:
        'Learn more about prior authorizations, statuses and how to make appeals.',
      iconName: priorAuthorizations,
      link: '/member/support/FAQ/priorauthorizations',
    },
    {
      label: 'Security',
      description:
        'How to share your health insurance information, represent a dependent individual and more.',
      iconName: keyIcon,
      link: '/member/support/FAQ/accountsharing',
    },
  ];

  return (
    <main className="flex flex-col justify-center items-center page">
      <Column className="flex flex-col app-content">
        <Spacer size={32} />
        <section className="pl-5">
          <Header className="title-1" text="Frequently Asked Questions" />
          <Spacer size={16} />
          <TextBox text="We’ve answered some of the most common questions about health insurance." />
          <Spacer size={32} />
        </section>
        {faqInformationDetails.map((item) => {
          return (
            <InfoCard
              key={item.label}
              label={item.label}
              icon={item.iconName}
              body={item.description}
              link={item.link}
            />
          );
        })}
      </Column>
    </main>
  );
};

export default FrequentlyAskedQuestions;
