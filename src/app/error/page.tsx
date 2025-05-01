import { Metadata } from 'next';
import Link from 'next/link';

/**
 * Error page
 * Displays when an unexpected error occurs
 */
export const metadata: Metadata = {
  title: 'Error',
  description: 'An unexpected error occurred',
};

export default function Page() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full p-6">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Oops! Something went wrong
          </h1>
          <p className="text-gray-600 mb-8">
            We apologize for the inconvenience. Please try again later or
            contact support if the problem persists.
          </p>
          <Link
            href="/"
            className="inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
          >
            Return to Home
          </Link>
        </div>
      </div>
    </div>
  );
}
