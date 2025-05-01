import { Footer } from '@/components/composite/Footer';
import { Header } from '@/components/composite/Header';
import { shouldHideHeaderFooter } from '@/utils/routes';
import { Metadata } from 'next';
import { GroupProvider } from '../providers/GroupProvider';

export const metadata: Metadata = {
  title: 'Member Portal',
  description: 'Access your health benefits and plan information',
};

interface GroupLayoutProps {
  children: React.ReactNode;
  params: {
    group: string;
  };
}

export default function GroupLayout({ children, params }: GroupLayoutProps) {
  const group = params.group || 'member';
  const pathname = typeof window !== 'undefined' ? window.location.pathname : '';
  const hideHeaderFooter = shouldHideHeaderFooter(pathname);

  return (
    <GroupProvider group={group}>
      {!hideHeaderFooter && <Header />}
      <main>{children}</main>
      {!hideHeaderFooter && <Footer />}
    </GroupProvider>
  );
}