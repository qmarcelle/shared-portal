import { getPolicyInfo } from '@/actions/getPolicyInfo';
import { getVisibilityRules } from '@/actions/getVisibilityRules';
import { getUserProfiles } from '@/actions/profileData';
import { UserProfile } from '@/models/user_profile';
import { UserRole } from '@/userManagement/models/sessionUser';
import { logger } from '@/utils/logger';
import { transformPolicyToPlans } from '@/utils/policy_computer';
import SiteHeader from '../foundation/SiteHeader';

export const SiteHeaderServerWrapper = async () => {
  try {
    const visibityRules = await getVisibilityRules();
    if (visibityRules) {
      const profiles = await getUserProfiles();
      
      // Log for debugging
      logger.info('Profiles retrieved:', { profilesCount: profiles?.length });
      
      // Ensure we have profiles before proceeding
      if (!profiles || profiles.length === 0) {
        logger.warn('No user profiles found');
        // Create a fallback profile to satisfy type requirements
        const fallbackProfile: UserProfile = {
          id: '',
          personFhirId: '',
          firstName: 'Guest',
          lastName: 'User',
          type: UserRole.MEMBER,
          selected: true,
          plans: [],
          dob: '',
        };
        return <SiteHeader 
          visibilityRules={visibityRules} 
          profiles={[]} 
          plans={[]} 
          selectedProfile={fallbackProfile}
          selectedPlan={undefined}
        />;
      }
      
      // Find selected profile with null check
      const selectedProfile = profiles.find((item) => item.selected === true);
      logger.info('Selected profile:', { hasSelectedProfile: !!selectedProfile });
      
      if (!selectedProfile) {
        // If no selected profile, use the first one as fallback
        const fallbackProfile = profiles[0];
        logger.warn('No selected profile found, using first profile as fallback');
        return <SiteHeader 
          visibilityRules={visibityRules} 
          profiles={profiles} 
          plans={[]} 
          selectedProfile={fallbackProfile}
          selectedPlan={undefined}
        />;
      }
      
      // Safely access plans with null checks
      const selectedPlanId = selectedProfile?.plans?.find(
        (item) => item.selected === true
      )?.memCK;
      
      // Safe check before proceeding
      const policyInfo =
        selectedProfile && selectedProfile.plans && selectedProfile.plans.length > 0
          ? await getPolicyInfo(selectedProfile.plans.map((item) => item.memCK))
          : null;
          
      const plans = policyInfo ? transformPolicyToPlans(policyInfo) : [];
      const selectedPlan = selectedPlanId
        ? plans?.find((item) => item.memeCk === selectedPlanId)
        : undefined;
        
      return (
        <SiteHeader
          visibilityRules={visibityRules}
          profiles={profiles}
          plans={plans}
          selectedPlan={selectedPlan}
          selectedProfile={selectedProfile}
        />
      );
    } else {
      // Create a fallback profile for empty visibility rules case
      const fallbackProfile: UserProfile = {
        id: '',
        personFhirId: '',
        firstName: 'Guest',
        lastName: 'User',
        type: UserRole.MEMBER,
        selected: true,
        plans: [],
        dob: '',
      };
      return <SiteHeader 
        visibilityRules={{}} 
        profiles={[]} 
        plans={[]} 
        selectedProfile={fallbackProfile}
        selectedPlan={undefined}
      />;
    }
  } catch (error) {
    logger.error('Error in SiteHeaderServerWrapper:', error);
    // Return minimal header with fallback data when there's an error
    const fallbackProfile: UserProfile = {
      id: '',
      personFhirId: '',
      firstName: 'Guest',
      lastName: 'User',
      type: UserRole.MEMBER,
      selected: true,
      plans: [],
      dob: '',
    };
    return <SiteHeader 
      visibilityRules={{}} 
      profiles={[]} 
      plans={[]} 
      selectedProfile={fallbackProfile}
      selectedPlan={undefined}
    />;
  }
};
