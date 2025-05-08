'use client';

import { getPersonBusinessEntity } from '@/utils/api/client/get_pbe';
import { computeUserProfilesFromPbe } from '@/utils/profile_computer';
import { Session } from 'next-auth';
import { useSession } from 'next-auth/react';
import dynamic from 'next/dynamic';
import { useEffect, useRef, useState } from 'react';
import { ChatErrorBoundary } from './components/ChatErrorBoundary';

// Define interfaces for our state types to fix TypeScript errors
interface UserPlan {
  memCk: string;
  sbsbCk?: string;
  grgrCk?: string;
  grpId?: string;
  fhirId?: string;
  ntwkId?: string;
}

interface UserData {
  umpi?: string;
  fhirId?: string;
  role?: string;
  plan?: UserPlan;
}

// Use dynamic import for the chat component with SSR disabled
const DynamicChatLoader = dynamic(() => import('./components/ChatLoader'), {
  ssr: false,
  loading: () => (
    <div className="chat-loading-indicator flex items-center p-4">
      <svg className="animate-spin h-5 w-5 mr-3 text-blue-600" viewBox="0 0 24 24">
        <circle
          className="opacity-25"
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          strokeWidth="4"
        ></circle>
        <path
          className="opacity-75"
          fill="currentColor"
          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
        ></path>
      </svg>
      Loading chat component...
    </div>
  ),
});

export default function ChatPage() {
  const { data: session, status } = useSession();
  const [isClient, setIsClient] = useState(false);
  // Properly type the useState hooks to fix the TypeScript errors
  const [initialSessionData, setInitialSessionData] = useState<Session | null>(null);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const initialized = useRef(false);
  
  useEffect(() => {
    setIsClient(true);
    console.log('[ChatPage] Component mounted, session status:', status, 'has data:', !!session);
    
    // First attempt: Try using session data if available
    if (session?.user?.currUsr && !initialized.current) {
      console.log('[ChatPage] Capturing initial session data');
      setInitialSessionData(session);
      
      // TypeScript now knows this is valid because we've properly typed userData
      setUserData(session.user.currUsr as UserData);
      initialized.current = true;
      setIsLoading(false);
    } 
    // Second attempt: If session doesn't have user data but we have userId, fetch PBE data directly
    else if (session?.user?.id && !initialized.current) {
      console.log('[ChatPage] Session missing currUsr, trying direct PBE fetch');
      
      const fetchUserData = async () => {
        try {
          // Get the PBE data directly - this is what computeSessionUser uses internally
          const pbe = await getPersonBusinessEntity(session.user.id);
          
          // Get user profiles from PBE
          const userProfiles = computeUserProfilesFromPbe(pbe);
          
          // Find the subscriber profile first (preferred for chat)
          // Fix the relationshipType access by checking for the property
          const subscriberProfile = userProfiles.find(
            (profile) => profile.type === 'MEM' && 
            // Use optional chaining and type assertion if needed
            (profile as any)?.relationshipType === 'Subscriber'
          );
          
          // Use subscriber or first profile
          const currentProfile = subscriberProfile || userProfiles[0];
          
          if (currentProfile) {
            console.log('[ChatPage] Found profile via PBE:', currentProfile);
            const selectedPlan = currentProfile.plans.length ? currentProfile.plans[0] : null;
            
            // Construct user data in the format chat widget expects
            const computedUserData: UserData = {
              umpi: currentProfile.id,
              fhirId: currentProfile.personFhirId,
              role: currentProfile.type,
              plan: selectedPlan ? {
                memCk: selectedPlan.memCK,
                sbsbCk: selectedPlan.subscriberId || '',
                grgrCk: '', // Will use default
                grpId: '', // Will use default
                fhirId: selectedPlan.patientFhirId,
                ntwkId: '' // Will use default
              } : undefined
            };
            
            setUserData(computedUserData);
            initialized.current = true;
          }
        } catch (error) {
          console.error('[ChatPage] Error fetching PBE data:', error);
        } finally {
          setIsLoading(false);
        }
      };
      
      fetchUserData();
    }
    // If we still don't have data but session status is defined, set loading to false
    else if (status !== 'loading' && !initialized.current) {
      setIsLoading(false);
    }
    
    // Log detailed session structure for debugging
    if (session?.user) {
      console.log('[ChatPage] Session user structure:', {
        userKeys: Object.keys(session.user),
        hasCurrUsr: !!session.user.currUsr,
        currUsrKeys: session.user.currUsr ? Object.keys(session.user.currUsr) : [],
        planInfo: session.user.currUsr?.plan || {},
        planKeys: session.user.currUsr?.plan ? Object.keys(session.user.currUsr.plan) : [],
        memCk: session.user.currUsr?.plan?.memCk || 'Not available',
        authStatus: status
      });
    }
  }, [session, status]);

  // Wait for client-side hydration
  if (!isClient) {
    return <div className="hidden">Initializing chat...</div>;
  }
  
  // Show loading state while fetching user data
  if (isLoading) {
    return <div className="chat-loading-indicator">Retrieving member data...</div>;
  }
  
  // If we couldn't get user data, render an empty div
  if (!userData?.plan) {
    console.log('[ChatPage] No valid plan data available');
    return <div className="hidden">Chat unavailable - No valid plan data</div>;
  }
  
  // Prioritize using the memCk from the plan object
  const memberId = userData.plan.memCk || "220590751"; // Default from logs
  const planId = userData.plan.grpId || "82333"; // Default from logs
  
  console.log('[ChatPage] Rendering chat with:', { memberId, planId });
  
  return (
    <ChatErrorBoundary>
      <DynamicChatLoader
        memberId={memberId} 
        planId={planId}
      />
    </ChatErrorBoundary>
  );
}
