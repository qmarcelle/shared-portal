import { type PortalUser } from '@/models/auth/user';

export async function getPersonBusinessEntity(
  userId: string,
): Promise<PortalUser> {
  return {
    userName: 'bcbstuser222',
    umpi: 'asdfghjkl',
    fhirId: 'qwertyuiop',
    name: 'John Doe',
    profiles: [
      {
        role: 'member',
        accessLevel: 'full',
        member: {
          relation: 'subscriber',
          status: 'active',
          memberCk: 91722401,
          subscriberCk: 91722400,
          groupCk: 21908,
          subscriberId: '902218823',
          suffix: 0,
          groupId: '100000',
          parentGroupId: '100001',
          groupName: 'Chris B Hall Enterprises',
          subGroupId: '0001',
          subGroupName: 'Chris B Hall Enterprises',
          clientId: 'EI',
          policyType: 'INT',
          lineOfBusiness: 'REGL',
          originalEffectiveDate: new Date(2001, 0, 1),
          dateOfBirth: new Date(1959, 7, 6),
          firstName: 'CHRIS',
          lastName: 'HALL',
          middleInitial: 'B',
          title: '',
          gender: 'M',
          mailingAddressType: 'H',
          plans: [
            {
              productType: 'M',
              productId: 'MBPX0806',
              name: 'Blue Network P',
              classId: 'PPOA',
              coverageLevel: '*',
              exchange: false,
              individual: false,
              pediatric: false,
              effectiveDate: new Date(2019, 0, 1),
              termDate: null,
              eligibilityIndicator: 'Y',
            },
          ],
          addresses: [
            {
              type: 'H',
              line1: 'TEST BLUE ACCESS',
              city: 'Chattanooga',
              state: 'TN',
              zip: '37412',
              county: 'HAMILTON',
            },
          ],
          authorization: {
            mdLive: false,
            teladoc: false,
          },
        },
      },
    ],
  };
}
