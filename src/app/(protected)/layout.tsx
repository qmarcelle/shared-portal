import { auth } from '@/auth';
import { Suspense } from 'react';
import { redirect } from 'next/navigation';
import dynamic from 'next/dynamic';
import { ChatErrorBoundary } from '../chat/components/ChatErrorBoundary';

// Simple loading component for chat
const ChatLoading = () => <div className="chat-loading" aria-hidden="true"></div>;

// Dynamically import the ChatEntry component to avoid SSR issues
const ChatEntry = dynamic(() => import('../chat/components/ChatEntry'), {
  ssr: false
});

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
      {session?.user?.currUsr?.plan && (
        <ChatErrorBoundary>
          <Suspense fallback={<ChatLoading />}>
            <ChatEntry />
          </Suspense>
        </ChatErrorBoundary>
      )}
    </>
  );
}