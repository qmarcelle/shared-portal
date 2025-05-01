import { Metadata } from 'next';

export const metadata: Metadata = {
  title: '404 – Not Found',
};

export default function NotFound() {
  return (
    <div className="p-8 text-center">
      <h1 className="text-3xl font-bold text-red-600">Page Not Found</h1>
      <p className="mt-2">The requested resource doesn&apos;t exist.</p>
    </div>
  );
}
