import { switchableEntities } from './switchableEntitiesConfig';
import { encodeVisibilityRules } from '@/app/visibility/encoding';

export async function switchPlan({
  userId,
  planId,
}: {
  userId: string;
  planId: string;
}) {
  // Find the config for 'plan'
  const entity = switchableEntities.find(e => e.type === 'plan');
  if (!entity) throw new Error('Plan switching not configured');

  // Fetch the new context (includes PBE data)
  const context = await entity.fetchContext(planId, userId);

  // Validate the switch
  if (!entity.canSwitch(context)) throw new Error('Switch not allowed');

  // Derive and encode visibility rules
  const visibilityRules = entity.deriveVisibility(context);
  const encodedRules = encodeVisibilityRules(visibilityRules);

  // Return new user context for JWT/session update
  return {
    ...context,
    visibility: encodedRules,
  };
}
