import {
  CVS_DEEPLINK_MAP,
  CVS_DRUG_SEARCH_INIT,
  EYEMED_DEEPLINK_MAP,
  EYEMED_VISION,
  PROV_DIR_DEEPLINK_MAP,
  PROV_DIR_MEDICAL,
} from '@/app/sso/ssoConstants';
import {
  isPharmacyBenefitsEligible,
  isVisionEligible,
} from '@/visibilityEngine/computeVisibilityRules';
import { VisibilityRules } from '@/visibilityEngine/rules';
import { AppRouterInstance } from 'next/dist/shared/lib/app-router-context.shared-runtime';
import { PillData } from '../components/PillBox';

export const getProcedurePillOptions = (
  visibilityRules: VisibilityRules,
  router: AppRouterInstance,
): PillData[] => {
  const procedurePillOptions: PillData[] = [];

  if (visibilityRules.medical) {
    procedurePillOptions.push({
      label: 'Medical',
      callback: () => {
        router.push(
          `/sso/launch?PartnerSpId=${process.env.NEXT_PUBLIC_IDP_PROVIDER_DIRECTORY}&TargetResource=${process.env.NEXT_PUBLIC_PROVIDER_DIRECTORY_VITALS_SSO_TARGET!.replace('{DEEPLINK}', PROV_DIR_DEEPLINK_MAP.get(PROV_DIR_MEDICAL)!)}`,
        );
      },
    });
  }

  if (visibilityRules.dental) {
    procedurePillOptions.push({
      label: 'Dental',
      callback: () => {
        router.push('/member/findcare/dentalcosts');
      },
    });
  }

  console.log(`RxElig: ${isPharmacyBenefitsEligible(visibilityRules)}`);
  if (isPharmacyBenefitsEligible(visibilityRules)) {
    procedurePillOptions.push({
      label: 'Prescription Drugs',
      callback: () => {
        router.push(
          `/sso/launch?PartnerSpId=${process.env.NEXT_PUBLIC_IDP_CVS_CAREMARK}&TargetResource=${process.env.NEXT_PUBLIC_CVS_SSO_TARGET?.replace('{DEEPLINK}', CVS_DEEPLINK_MAP.get(CVS_DRUG_SEARCH_INIT)!)}`,
        );
      },
    });
  }

  if (isVisionEligible(visibilityRules)) {
    procedurePillOptions.push({
      label: 'Vision',
      callback: () => {
        router.push(
          `/sso/launch?PartnerSpId=${process.env.NEXT_PUBLIC_IDP_EYEMED}&TargetResource=${process.env.NEXT_PUBLIC_EYEMED_SSO_TARGET?.replace('{DEEPLINK}', EYEMED_DEEPLINK_MAP.get(EYEMED_VISION)!)}`,
        );
      },
    });
  }

  return procedurePillOptions;
};
