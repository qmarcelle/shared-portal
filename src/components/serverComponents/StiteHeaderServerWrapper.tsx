import { getVisibilityRules } from '@/actions/getVisibilityRules';
import SiteHeader from '../foundation/SiteHeader';

export const SiteHeaderServerWrapper = async () => {
  const visibityRules = await getVisibilityRules();
  if (visibityRules) {
    return <SiteHeader visibilityRules={visibityRules} />;
  } else {
    return <></>;
  }
};
