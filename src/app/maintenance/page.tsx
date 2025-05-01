import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Maintenance',
  description: 'Site is under maintenance',
};

export default function MaintenancePage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full p-6">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Site Under Maintenance
          </h1>
          <p className="text-gray-600 mb-8">
            We're currently performing scheduled maintenance to improve our
            services. Please check back soon.
          </p>
          <div className="text-sm text-gray-500">
            Estimated completion time: {new Date().toLocaleTimeString()}
          </div>
        </div>
      </div>
    </div>
  );
}
