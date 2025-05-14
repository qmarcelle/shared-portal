import { getPersonBusinessEntity } from '@/utils/api/client/get_pbe';
import { encodeVisibilityRules } from '@/app/visibility/encoding';
import { VisibilityContext, VisibilityRules } from '@/app/visibility/types';

export type SwitchableEntityType = 'plan';

export interface SwitchableEntityConfig {
  type: SwitchableEntityType;
  idField: string;
  fetchContext: (planId: string, userId: string) => Promise<VisibilityContext>;
  canSwitch: (context: VisibilityContext) => boolean;
  deriveVisibility: (context: VisibilityContext) => VisibilityRules;
}

export const switchableEntities: SwitchableEntityConfig[] = [
  {
    type: 'plan',
    idField: 'planId',
    fetchContext: async (planId, userId) => {
      // Fetch PBE data for the user (and plan, if needed)
      const pbeData = await getPersonBusinessEntity(userId, true, true, false);
      // Optionally filter or map pbeData to the specific plan context
      // Return a VisibilityContext object (could be just pbeData or a subset)
      return { ...pbeData, planId };
    },
    canSwitch: (context) => {
      // Example: only allow switch if the plan is active
      // You may need to check context.getPBEDetails or similar
      return true; // Implement your logic here
    },
    deriveVisibility: (context) => {
      // Use @visibility/engine to derive rules from the context
      // Example: return engine.deriveRules(context);
      return [];
    },
  },
];
