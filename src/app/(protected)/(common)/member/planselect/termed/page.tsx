import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Plan Select – Termed',
  description: 'View termed plans',
};

export default function TermedPlanSelectPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Termed Plan Selection</h1>
      <div className="bg-white rounded-lg shadow p-6">
        <p className="text-gray-600">
          View your termed plans and their historical information.
        </p>
      </div>
    </div>
  );
}
