import {
  CVS_DEEPLINK_MAP,
  CVS_PHARMACY_SEARCH_FAST,
  EYEMED_DEEPLINK_MAP,
  EYEMED_PROVIDER_DIRECTORY,
  PROV_DIR_DEEPLINK_MAP,
  PROV_DIR_DENTAL,
  PROV_DIR_MENTAL_HEALTH,
} from '@/app/sso/ssoConstants';
import {
  isBlueCareEligible,
  isPharmacyBenefitsEligible,
  isTeladocEligible,
  isVisionEligible,
} from '@/visibilityEngine/computeVisibilityRules';
import { VisibilityRules } from '@/visibilityEngine/rules';
import { AppRouterInstance } from 'next/dist/shared/lib/app-router-context.shared-runtime';
import { PillData } from '../components/PillBox';

export const getFindCarePillOptions = (
  visibilityRules: VisibilityRules,
  router: AppRouterInstance,
): PillData[] => {
  const findPillOptions = [];
  if (visibilityRules.medical) {
    findPillOptions.push({
      label: 'Primary Care Provider',
      callback: () => {
        router.push(
          `/sso/launch?PartnerSpId=${process.env.NEXT_PUBLIC_IDP_PROVIDER_DIRECTORY}&alternateText=Find a PCP&isPCPSearchRedirect=true&TargetResource=${process.env.NEXT_PUBLIC_PROVIDER_DIRECTORY_PCP_SSO_TARGET}`,
        );
      },
    });
  }
  if (visibilityRules.dental) {
    findPillOptions.push({
      label: 'Dentist',
      callback: () => {
        router.push(
          `/sso/launch?PartnerSpId=${process.env.NEXT_PUBLIC_IDP_PROVIDER_DIRECTORY}&TargetResource=${process.env.NEXT_PUBLIC_PROVIDER_DIRECTORY_VITALS_SSO_TARGET!.replace('{DEEPLINK}', PROV_DIR_DEEPLINK_MAP.get(PROV_DIR_DENTAL)!)}`,
        );
      },
    });
  }
  if (
    visibilityRules.mentalHealthSupport ||
    isBlueCareEligible(visibilityRules)
  ) {
    findPillOptions.push({
      label: 'Mental Health Provider',
      callback: () => {
        router.push(
          `/sso/launch?PartnerSpId=${process.env.NEXT_PUBLIC_IDP_PROVIDER_DIRECTORY}&TargetResource=${process.env.NEXT_PUBLIC_PROVIDER_DIRECTORY_VITALS_SSO_TARGET!.replace('{DEEPLINK}', PROV_DIR_DEEPLINK_MAP.get(PROV_DIR_MENTAL_HEALTH)!)}`,
        );
      },
    });
    if (isVisionEligible(visibilityRules)) {
      findPillOptions.push({
        label: 'Eye Doctor',
        callback: () => {
          router.push(
            `/sso/launch?PartnerSpId=${process.env.NEXT_PUBLIC_IDP_EYEMED}&TargetResource=${process.env.NEXT_PUBLIC_EYEMED_SSO_TARGET!.replace('{DEEPLINK}', EYEMED_DEEPLINK_MAP.get(EYEMED_PROVIDER_DIRECTORY)!)}`,
          );
        },
      });
      if (isPharmacyBenefitsEligible(visibilityRules)) {
        findPillOptions.push({
          label: 'Pharmacy',
          callback: () => {
            router.push(
              `/sso/launch?PartnerSpId=${process.env.NEXT_PUBLIC_IDP_CVS_CAREMARK}&TargetResource=${process.env.NEXT_PUBLIC_CVS_SSO_TARGET?.replace('{DEEPLINK}', CVS_DEEPLINK_MAP.get(CVS_PHARMACY_SEARCH_FAST)!)}`,
            );
          },
        });
      }
      if (isTeladocEligible(visibilityRules)) {
        findPillOptions.push({
          label: 'Virtual Care',
          callback: () => {
            router.push('/member/findcare/virtualcare');
          },
        });
      }
    }
  }
  return findPillOptions;
};
