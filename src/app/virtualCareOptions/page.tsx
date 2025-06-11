import { auth } from '@/auth';
import { VisibilityRules } from '@/visibilityEngine/rules';
import { getVirtualCareOptions } from './actions/getVirtualCareOptions';
import VirtualCareOptions from './index';

export default async function VirtualCareOptionsPage() {
  const session = await auth();
  // Cast session to include visibilityRules
  const visibilityRules = (
    session as unknown as { visibilityRules: VisibilityRules }
  )?.visibilityRules;

  if (!visibilityRules) {
    return null;
  }

  const virtualCareOptions = await getVirtualCareOptions(visibilityRules);

  return <VirtualCareOptions virtualCareOptions={virtualCareOptions} />;
}
