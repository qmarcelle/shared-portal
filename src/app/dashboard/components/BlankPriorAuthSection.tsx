import { Card } from '@/components/foundation/Card';
import { Spacer } from '@/components/foundation/Spacer';
import Image from 'next/image';
import EmptyStateDocument from '../../../../public/assets/empty_state_document.svg';

export const BlankPriorAuthSection = () => {
  function calculateDays() {
    const defaultSearchRange =
      process.env.NEXT_PUBLIC_DEFAULT_PRIOR_AUTH_SEARCH_RANGE;

    switch (defaultSearchRange) {
      case 'A':
        return 'last 30 days.';
      case 'B':
        return 'last 90 days.';
      case 'C':
        return 'current calendar year.';
      case 'D':
        return 'last two years.';
      default:
        return '';
    }
  }

  return (
    <Card className="neutral container">
      <div className="flex m-4">
        <Image src={EmptyStateDocument} className="icon-document" alt="" />
        <Spacer axis="horizontal" size={20} />
        <label className="body-1">
          No prior authorizations in the {calculateDays()}{' '}
        </label>
      </div>
    </Card>
  );
};
