import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Member Portal',
  description: 'Access your health benefits and plan information',
};

export default function CommonLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}