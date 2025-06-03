import { VisibilityRules } from '@/visibilityEngine/rules';
import { HealthAccountInfo } from '../model/myHealthCareResponseDTO';

export const mapAccountInfo = (vRules: VisibilityRules): HealthAccountInfo => {
  const accountTypes = [
    vRules.hasHSA ? 'HSA' : null,
    vRules.hasHRA ? 'HRA' : null,
    vRules.hasFSA ? 'FSA' : null,
  ].filter(Boolean) as string[];
  const bankSource = vRules.healthEquity
    ? 'HealthEquity'
    : vRules.hsaBank
      ? 'HSABank'
      : vRules.pinnacleBank
        ? 'PinnacleBank'
        : vRules.internalBCBSTSA
          ? 'BCBSTInternal'
          : 'Unknown';
  return {
    bankName: bankSource,
    accountTypes: accountTypes, // ['HSA', 'HRA', 'FSA']
  };
};
