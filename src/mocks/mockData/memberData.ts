export const memberData = [
  {
    memberCk: '91722401',
    memberId: '90221882300',
    firstName: 'CHRIS',
    lastName: 'HALL',
    dateOfBirth: '1980-01-01',
    isVisionEligible: true,
    isDentalEligible: true,
    isMedicalEligible: true,
    plans: [
      {
        planId: 'MBSSOV2E',
        productType: 'M',
        groupId: '100000',
        groupName: 'Chris B Hall Enterprises',
        lineOfBusiness: 'Commercial',
        lobGroup: 'Commercial',
        isEligibleForChat: true,
        businessHours: 'S_S_24', // 24/7 availability
      },
      {
        planId: 'VEYVLCE2',
        productType: 'V',
        groupId: '100000',
        groupName: 'Chris B Hall Enterprises',
        lineOfBusiness: 'Commercial',
        lobGroup: 'Commercial',
        isEligibleForChat: true,
        businessHours: 'M_F_8_6', // Monday-Friday, 8AM-6PM
      },
    ],
  },
  {
    memberCk: '993543351',
    memberId: '90543335100',
    firstName: 'JANE',
    lastName: 'DOE',
    dateOfBirth: '1985-05-15',
    isVisionEligible: false,
    isDentalEligible: true,
    isMedicalEligible: true,
    plans: [
      {
        planId: 'MB8YD601',
        productType: 'M',
        groupId: '127600',
        groupName: 'Individual Marketplace',
        lineOfBusiness: 'Marketplace',
        lobGroup: 'Individual',
        isEligibleForChat: true,
        businessHours: 'M_F_8_6', // Monday-Friday, 8AM-6PM
      },
    ],
  },
  {
    memberCk: 'ineligible-member',
    memberId: '90000000001',
    firstName: 'INELIGIBLE',
    lastName: 'MEMBER',
    dateOfBirth: '1990-10-10',
    isVisionEligible: false,
    isDentalEligible: false,
    isMedicalEligible: true,
    plans: [
      {
        planId: 'ineligible-plan',
        productType: 'M',
        groupId: '999999',
        groupName: 'Ineligible Group',
        lineOfBusiness: 'Other',
        lobGroup: 'Other',
        isEligibleForChat: false,
        businessHours: null,
      },
    ],
  },
];
