import { useGroup } from '@/app/providers/GroupProvider';
import { Metadata } from 'next';
import SharedMyPlanPage from '@/app/(common)/member/myplan/page';

export const metadata: Metadata = {
  title: 'My Plan',
  description: 'View and manage your plan details',
};

export default function GroupMyPlanPage() {
  const { group } = useGroup();

  // For now, we'll just reuse the shared implementation
  // In the future, we can extend or override based on group-specific needs
  return <SharedMyPlanPage />;
}
