import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { SpendingSummaryPage } from '../components/SpendingSummaryPage';
import { SpendingType } from '../models/SpendingType';

export const metadata: Metadata = {
  title: 'Spending Summary | Member Portal',
  description: 'View your healthcare spending summary',
};

interface Props {
  params: {
    type: string;
  };
}

function isValidSpendingType(type: string): type is SpendingType {
  return Object.values(SpendingType).includes(type as SpendingType);
}

export default function SpendingSummaryTypePage({ params }: Props) {
  const type = params.type;

  // Convert to proper case to match enum
  const normalizedType =
    type.charAt(0).toUpperCase() + type.slice(1).toLowerCase();

  if (!isValidSpendingType(normalizedType)) {
    notFound();
  }

  return <SpendingSummaryPage spendingType={normalizedType} />;
}
