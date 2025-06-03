import { benefits, enrollment } from '@/components/foundation/Icons';
import { InfoCard } from '../../../components/composite/InfoCard';
import { Column } from '../../../components/foundation/Column';

export const PlanInfo = () => {
  const planInfoDetails = [
    {
      label: 'My Plan Details',
      description: 'View your plan details.',
      iconName: enrollment,
      link: '/member/myplan',
    },
    {
      label: 'Benefits & Coverage',
      // eslint-disable-next-line quotes
      description: "View what's covered under your plan.",
      iconName: benefits,
      link: '/member/myplan/benefits',
    },
  ];

  return (
    <Column>
      {planInfoDetails.map((item) => {
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
  );
};
