import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Health Programs',
  description: 'View and manage your health programs and wellness rewards',
};

export default function HealthProgramsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid gap-8">{children}</div>
    </div>
  );
}