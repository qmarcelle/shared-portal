import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Plan Select – Active',
  description: 'Select an active plan',
};

export default function ActivePlanSelectPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Active Plan Selection</h1>
      <div className="bg-white rounded-lg shadow p-6">
        <p className="text-gray-600">
          Please select your active plan from the options below.
        </p>
      </div>
    </div>
  );
}
