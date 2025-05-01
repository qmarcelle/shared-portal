import { Metadata } from 'next';
import { WelcomeBanner } from '@/components/composite/WelcomeBanner';

export const metadata: Metadata = {
  title: 'My Plan',
  description: 'View and manage your plan details',
};

export default function SharedMyPlanPage() {
  return (
    <div>
      <WelcomeBanner
        titleText="Welcome to Your Plan"
        body={<p>View and manage your plan details</p>}
      />
      {/* Add more shared components here */}
    </div>
  );
}