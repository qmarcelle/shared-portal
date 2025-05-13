import { auth } from '@/auth';
import { redirect } from 'next/navigation';
import { ChatClientEntry } from '../components/ChatClientEntry';

export default async function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  // Redirect to login if not authenticated
  if (!session?.user) {
    redirect('/login');
  }

  return (
    <>
      {children}
      {/* Chat component - only rendered if user is authenticated and has a plan */}
      {session?.user?.currUsr?.plan && <ChatClientEntry />}
    </>
  );
}
