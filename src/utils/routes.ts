import { RouteConfig } from '@/models/auth/route_auth_config';
import {
  activeAndHealthPlanMember,
  isActiveAndNotFSAOnly,
  isAHAdvisorpage,
  isAnnualStatementEligible,
  isBalancesPageVisible,
  isBenefitBookletEnabled,
  isBloodPressureManagementEligible,
  isChipRewardsEligible,
  isClaimsPageVisible,
  isDiabetesManagementEligible,
  isDiabetesPreventionEligible,
  isFindCareEligible,
  isHealthProgamAndResourceEligible,
  isHealthyMaternity,
  isHingeHealthEligible,
  isLifePointGrp,
  isManageMyPolicyEligible,
  isMedicareDsnpEligible,
  isMedicareEligible,
  isMedicarePrescriptionPaymentPlanEligible,
  isNewMentalHealthSupportAbleToEligible,
  isNewMentalHealthSupportMyStrengthCompleteEligible,
  isNurseChatEligible,
  isOtherInsuranceEligible,
  isPharmacyBenefitsEligible,
  isPriceDentalCareMenuOptions,
  isPrimaryCarePhysicianEligible,
  isQuantumHealthEligible,
  isQuestSelectEligible,
  isSilverAndFitnessEligible,
  isSpendingAccountsEligible,
  isTaxDocument1095BRequestEligible,
  isTeladocEligible,
  isTeladocPrimary360Eligible,
  isTeladocSecondOpinionAdviceAndSupportEligible,
} from '@/visibilityEngine/computeVisibilityRules';
import 'server-only';

/**
 * Context root for API authentication routes.
 */
export const API_BASE_PATH = '/api';

export const ROUTING_ENGINE_EXEMPT = ['/error', '/404'];

export const ROUTE_CONFIG: RouteConfig = {
  rule: false,
  children: {
    login: {
      title: 'Login',
      auth: true,
    },
    sso: {
      rule: false,
      children: {
        launch: {},
        redirect: {},
        auth: {
          auth: true,
          inboundDestination: '/dashboard',
        },
        impersonate: {
          auth: true,
          inboundDestination: '/dashboard',
        },
      },
    },
    dashboard: {
      title: 'Homepage',
      pathAlias: '/member/home',
    },
    searchResults: {
      title: '',
    },
    memberIDCard: {
      title: 'ID Card',
      breadcrumbParent: '/dashboard',
      rule: (r) => !r.fsaOnly && !r.terminated && !r.delinquent,
    },
    inbox: {
      title: 'Inbox',
      breadcrumbParent: '/dashboard',
    },
    myPlan: {
      title: 'My Plan',
      pathAlias: '/member/myplan',
      children: {
        manageMyPolicy: {
          title: 'Manage My Policy',
          rule: (r) => isManageMyPolicyEligible(r),
        },
        updateSocialSecurityNumber: {
          title: 'Update Social Security Number',
          rule: (r) => isManageMyPolicyEligible(r),
        },
        planContactInformation: {
          title: 'Plan Contact Information',
        },
      },
    },
    myHealth: {
      title: 'My Health',
      rule: (r) => isActiveAndNotFSAOnly(r),
      children: {
        healthProgramsResources: {
          title: 'Health Programs & Resources',
          rule: (r) => isHealthProgamAndResourceEligible(r),
          children: {
            myHealthPrograms: {
              children: {
                //The programs details is one page, but we can specify data for each program type separately here since it uses a path param
                ableTo: {
                  title: 'AbleTo',
                  rule: (r) => isNewMentalHealthSupportAbleToEligible(r),
                  breadcrumbParent: '/virtualCareOptions',
                },
                healthyMaternity: {}, //TODO is /healthyMaternity a duplicate?
                hingeHealth: {
                  title: 'Hinge Health Back & Joint Care',
                  rule: (r) => isHingeHealthEligible(r),
                  breadcrumbParent: '/virtualCareOptions',
                },
                questSelect: {
                  title: 'QuestSelect Low-Cost Lab Testing',
                  rule: (r) => isQuestSelectEligible(r),
                },
                silverFit: {
                  title: 'Silver&Fit Fitness Program',
                  rule: (r) => isSilverAndFitnessEligible(r),
                },
                talkToNurse: {
                  title: 'Talk to a Nurse',
                  rule: (r) => isNurseChatEligible(r),
                  breadcrumbParent: '/virtualCareOptions',
                },
                teladocBP: {
                  title: 'Teladoc Health Blood Pressure Management Program',
                  rule: (r) => isBloodPressureManagementEligible(r),
                },
                teladocHealthDiabetesManagement: {
                  title: 'Teladoc Health Diabetes Management Program',
                  rule: (r) => isDiabetesManagementEligible(r),
                },
                teladocHealthDiabetesPrevention: {
                  title: 'Teladoc Health Diabetes Prevention Program',
                  rule: (r) => isDiabetesPreventionEligible(r),
                },
                teladocHealthGeneralUrgentCare: {
                  title: 'Teladoc Health General & Urgent Care',
                  rule: (r) => isTeladocEligible(r),
                  breadcrumbParent: '/virtualCareOptions',
                },
                teladocMentalHealth: {
                  title: 'Teladoc Mental Health',
                  rule: (r) =>
                    isNewMentalHealthSupportMyStrengthCompleteEligible(r),
                  breadcrumbParent: '/virtualCareOptions',
                },
                teladocPrimaryCareProvider: {
                  title: 'Teladoc Health Primary Care Provider',
                  rule: (r) => isTeladocPrimary360Eligible(r),
                  breadcrumbParent: '/virtualCareOptions',
                },
                teladocSecondOption: {
                  title: 'Teladoc Health Second Opinion Advice & Support',
                  rule: (r) =>
                    isTeladocSecondOpinionAdviceAndSupportEligible(r),
                },
              },
            },
          },
        },
        rewardsProgramFAQs: {
          title: 'Rewards Program FAQs',
          rule: (r) => isChipRewardsEligible(r),
        },
      },
    },
    benefits: {
      title: 'Benefits & Coverage',
      rule: (r) => !r.terminated && !r.fsaOnly && !r.katieBeckNoBenefitsElig,
      breadcrumbParent: '/myPlan',
      children: {
        balances: {
          title: 'Balances',
          rule: (r) => isBalancesPageVisible(r),
        },
        servicesUsed: {
          title: 'Services Used',
          rule: (r) => isBalancesPageVisible(r),
        },
        planDocuments: {
          title: 'Plan Documents',
          rule: (r) => isBenefitBookletEnabled(r),
        },
        identityProtectionServices: {
          title: 'Identity Protection Services',
        },
        employerProvidedBenefits: {
          title: 'Employer Provided Benefits',
          rule: (r) => !isQuantumHealthEligible(r),
        },
        medical: {
          rule: (r) => r.medical,
          children: {
            '*': {
              title: (category) => category,
            },
          },
        },
        dental: {
          rule: (r) => r.dental,
          children: {
            '*': {
              title: (category) => category,
            },
          },
        },
        vision: {
          rule: (r) => r.vision,
          children: {
            '*': {
              title: (category) => category,
            },
          },
        },
        pharmacy: {
          rule: (r) => r.medical,
          children: {
            '*': {
              title: (category) => category,
            },
          },
        },
      },
    },
    claims: {
      title: 'Claims',
      breadcrumbParent: '/myPlan',
      rule: (r) => isClaimsPageVisible(r),
      children: {
        submitAClaim: {
          title: 'Submit a Claim',
          rule: (r) => isClaimsPageVisible(r) && r.active,
        },
        '*': {
          title: 'Claims Details',
        },
      },
    },
    forms: {
      title: 'Forms',
      rule: (r) => r.active,
      children: {
        determination: {
          title: 'Medicare Prescription Drug Coverage Determination',
          rule: (r) => isMedicareEligible(r),
          breadcrumbParent: '/pharmacy',
        },
        redetermination: {
          title:
            'Request for Redetermination of Medicare Prescription Drug Denial Form',
          rule: (r) => isMedicareDsnpEligible(r),
          breadcrumbParent: '/pharmacy',
        },
      },
    },
    priorAuthorization: {
      title: 'Prior Authorization',
      rule: (r) => activeAndHealthPlanMember(r),
      children: {
        '*': {
          title: 'Prior Authorization Details',
        },
      },
    },
    authDetail: {
      title: (authId) => `ID#${authId}`,
    },
    spendingSummary: {
      title: 'Spending Summary',
      rule: (r) => isAnnualStatementEligible(r),
      breadcrumbParent: '/myPlan',
    },
    findcare: {
      title: 'Find Care & Costs',
      rule: (r) => isFindCareEligible(r),
      children: {
        primaryCareOptions: {
          title: 'Primary Care Options',
          rule: (r) => isPrimaryCarePhysicianEligible(r),
        },
      },
    },
    priceDentalCare: {
      title: 'Price Dental Care',
      rule: (r) => isPriceDentalCareMenuOptions(r) || isLifePointGrp(r),
    },
    myPrimaryCareProvider: {
      title: 'My Primary Care Provider',
      rule: (r) => isPrimaryCarePhysicianEligible(r),
      breadcrumbParent: '/myHealth',
    },
    reportOtherHealthInsurance: {
      title: 'Report Other Health Insurance',
      rule: (r) => isOtherInsuranceEligible(r),
      breadcrumbParent: '/myPlan',
    },
    pharmacy: {
      title: 'Pharmacy',
      rule: (r) => isPharmacyBenefitsEligible(r),
      children: {
        medicalPrescriptionPaymentPlan: {
          title: 'Medical Prescription Payment Plan',
          rule: (r) => isMedicarePrescriptionPaymentPlanEligible(r),
        },
      },
    },
    spendingAccounts: {
      title: 'Spending Accounts',
      rule: (r) => isSpendingAccountsEligible(r),
      breadcrumbParent: '/myPlan',
      children: {
        transactions: {
          title: 'Transactions',
          rule: (r) => isSpendingAccountsEligible(r),
        },
      },
    },
    support: {
      title: 'Support',
      children: {
        faq: {
          title: 'Frequently Asked Questions',
        },
        faqTopics: {
          children: {
            '*': {
              title: (faqType) => faqType,
            },
          },
        },
        sendAnEmail: {
          title: 'Send an Email',
        },
      },
    },
    amplifyHealthSupport: {
      title: 'Support',
      rule: (r) => isAHAdvisorpage(r),
    },
    profileSettings: {
      title: 'Profile Settings',
    },
    security: {
      title: 'Security Settings',
      breadcrumbParent: '/profileSettings',
    },
    communicationSettings: {
      title: 'Communication Settings',
      breadcrumbParent: '/profileSettings',
    },
    otherProfileSettings: {
      title: 'Other Profile Settings',
      breadcrumbParent: '/profileSettings',
    },
    sharingPermissions: {
      title: 'Sharing & Permissions',
      breadcrumbParent: '/profileSettings',
    },
    shareMyInformation: {
      title: 'Share My Information',
      breadcrumbParent: '/sharingPermissions',
    },
    accessOthersInformation: {
      title: 'Access Others Information', //eslint-disable-line
      breadcrumbParent: '/sharingPermissions',
    },
    personalRepresentativeAccess: {
      title: 'Personal Representative Access',
      breadcrumbParent: '/sharingPermissions',
    },
    thirdPartySharing: {
      title: 'Third Party Sharing',
      breadcrumbParent: '/sharingPermissions',
    },
    virtualCareOptions: {
      title: 'Virtual Care Options',
      rule: (r) => isFindCareEligible(r),
      breadcrumbParent: '/findcare',
    },
    mentalHealthOptions: {
      title: 'Mental Health Options',
      rule: (r) => isFindCareEligible(r),
      breadcrumbParent: '/findcare',
    },
    healthyMaternity: {
      title: 'Healthy Maternity',
      rule: (r) => isHealthyMaternity(r),
      breadcrumbParent: '/myHealth/healthProgramsResources',
    },
    updateMyPrimaryCareProvider: {
      title: 'Update My Primary Care Provider',
      rule: (r) => isPrimaryCarePhysicianEligible(r),
      breadcrumbParent: '/myPrimaryCareProvider',
    },
    '1095BRequestForm': {
      title: '1095-B Request Form',
      rule: (r) => isTaxDocument1095BRequestEligible(r),
    },
  },
};
