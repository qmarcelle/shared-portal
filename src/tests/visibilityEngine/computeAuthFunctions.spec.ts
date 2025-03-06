import { LoggedInUserInfo } from '@/models/member/api/loggedInUserInfo';
import { computeAuthFunctions } from '@/visibilityEngine/computeAuthFunctions';
import { VisibilityRules } from '@/visibilityEngine/rules';

describe('computeAuthFunctions', () => {
  it('should correctly compute visibility rules based on auth functions', () => {
    const loggedUserInfo: LoggedInUserInfo = {
      authFunctions: [
        { functionName: 'CLAIMSHOLD', available: true },
        { functionName: 'KB_NO_BENEFITS', available: false },
        { functionName: 'MYPCPELIGIBLE', available: true },
        { functionName: 'IDPROTECTELIGIBLE', available: false },
        { functionName: 'OTCEnable', available: true },
        { functionName: 'ENABLE_PHAR_TAB', available: false },
        { functionName: 'BLUEPRKS', available: true },
        { functionName: 'TELADOC_DIABETESMGMT', available: false },
      ],
      isActive: false,
      subscriberLoggedIn: false,
      lob: '',
      groupData: {
        groupID: '',
        groupCK: '',
        groupName: '',
        parentGroupID: '',
        subGroupID: '',
        subGroupCK: 0,
        subGroupName: '',
        clientID: '',
        policyType: '',
        groupEIN: '',
      },
      networkPrefix: '',
      subscriberID: '',
      subscriberCK: '',
      subscriberFirstName: '',
      subscriberLastName: '',
      subscriberTitle: '',
      subscriberDateOfBirth: '',
      subscriberOriginalEffectiveDate: '',
      members: [],
      coverageTypes: [],
      addresses: [],
      healthCareAccounts: [],
      esigroupNum: '',
      cmcondition: [],
    };

    const rules: VisibilityRules = {
      delinquent: false,
      katieBeckNoBenefitsElig: false,
      myPCPElig: false,
      identityProtectionServices: false,
      otcEnable: false,
      bluePerksElig: false,
      showPharmacyTab: false,
      diabetesManagementEligible: false,
    };

    computeAuthFunctions(loggedUserInfo, rules);

    expect(rules.delinquent).toBe(true);
    expect(rules.katieBeckNoBenefitsElig).toBe(false);
    expect(rules.myPCPElig).toBe(true);
    expect(rules.identityProtectionServices).toBe(false);
    expect(rules.otcEnable).toBe(true);
    expect(rules.showPharmacyTab).toBe(false);
    expect(rules.bluePerksElig).toBe(true);
    expect(rules.diabetesManagementEligible).toBe(false);
  });

  it('should handle missing auth functions gracefully', () => {
    const loggedUserInfo: LoggedInUserInfo = {
      authFunctions: [],
      isActive: false,
      subscriberLoggedIn: false,
      lob: '',
      groupData: {
        groupID: '',
        groupCK: '',
        groupName: '',
        parentGroupID: '',
        subGroupID: '',
        subGroupCK: 0,
        subGroupName: '',
        clientID: '',
        policyType: '',
        groupEIN: '',
      },
      networkPrefix: '',
      subscriberID: '',
      subscriberCK: '',
      subscriberFirstName: '',
      subscriberLastName: '',
      subscriberTitle: '',
      subscriberDateOfBirth: '',
      subscriberOriginalEffectiveDate: '',
      members: [],
      coverageTypes: [],
      addresses: [],
      healthCareAccounts: [],
      esigroupNum: '',
      cmcondition: [],
    };

    const rules: VisibilityRules = {
      delinquent: false,
      katieBeckNoBenefitsElig: false,
      myPCPElig: false,
      identityProtectionServices: false,
      otcEnable: false,
      bluePerksElig: false,
      showPharmacyTab: false,
      diabetesManagementEligible: false,
    };

    computeAuthFunctions(loggedUserInfo, rules);

    expect(rules.delinquent).toBe(false);
    expect(rules.katieBeckNoBenefitsElig).toBe(false);
    expect(rules.myPCPElig).toBe(false);
    expect(rules.identityProtectionServices).toBe(false);
    expect(rules.otcEnable).toBe(false);
    expect(rules.bluePerksElig).toBe(false);
    expect(rules.showPharmacyTab).toBe(false);
    expect(rules.diabetesManagementEligible).toBe(false);
  });
});
