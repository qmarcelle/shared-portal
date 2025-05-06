import { logger } from '@/utils/logger';
import { VisibilityRules } from '@/visibilityEngine/rules';

export async function getFormularyFilter(
  memberDetails: any,
  visibilityRules: VisibilityRules | undefined,
): Promise<string | null> {
  try {
    const memberInfo = memberDetails;

    const MEDICARE_MAPD_BLUEADVANTAGE_GROUP_ABADTX00_PLAN_ID = 'ABADTX00';
    const MEDICARE_MAPD_BLUEADVANTAGE_GROUP = '116884';

    const isBlueAdvantageExtraFormularyEnabled = (memberInfo: any) => {
      if (memberInfo == null) return false;
      return (
        MEDICARE_MAPD_BLUEADVANTAGE_GROUP === memberInfo.groupID &&
        MEDICARE_MAPD_BLUEADVANTAGE_GROUP_ABADTX00_PLAN_ID ===
          memberInfo.mPDPD_ID
      );
    };

    const sortByGroup =
      '87898,115617,129970,129969,130300,120970,115602,128361,119381,118069,122059,124377,115613,118068,121489,132570,116884,129884,129971,145130,142512,142513';
    if (
      sortByGroup != null &&
      sortByGroup.split(',').includes(memberInfo.groupID)
    ) {
      if (memberInfo.groupID === '87898') {
        return 'Preferred';
      } else if (isBlueAdvantageExtraFormularyEnabled(memberInfo)) {
        return (
          memberInfo.groupID +
          '-' +
          MEDICARE_MAPD_BLUEADVANTAGE_GROUP_ABADTX00_PLAN_ID
        );
      } else {
        return memberInfo.groupID;
      }
    } else if (visibilityRules?.rxEssentialEligible) {
      return 'Essential';
    } else if (visibilityRules?.rxEssentialPlusEligible) {
      return 'EssentialPlus';
    } else if (visibilityRules?.rxPreferredEligible) {
      return 'Preferred';
    } else if (visibilityRules?.rxChoiceEligible) {
      return 'Choice';
    } else return 'null';
  } catch (error) {
    logger.error('Drug list formulary', error);
    return '';
  }
}
