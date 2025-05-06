import { ErrorCard } from '@/components/composite/ErrorCard';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: '404 – Not Found',
};

export default function NotFound() {
  return (
    <div className="flex h-screen items-center justify-center">
      <ErrorCard errorText="The requested FAQ topic was not found." />
    </div>
  );
}
