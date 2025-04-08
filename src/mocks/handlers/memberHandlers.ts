import { delay, http, HttpResponse, PathParams } from 'msw';
import { memberData } from '../mockData/memberData';

// Base path components
const apiPath = '/MemberServiceWeb/api/member/v1/members';

export const memberHandlers = [
  // Get Member Details
  http.get(`${apiPath}/byMemberCk/:memberId`, async ({ params }) => {
    const { memberId } = params as PathParams;

    await delay(150);

    const member =
      memberData.find((m) => m.memberCk === memberId) || memberData[0];

    return HttpResponse.json(member);
  }),

  // Get Member Plans
  http.get(`${apiPath}/byMemberCk/:memberId/plans`, async ({ params }) => {
    const { memberId } = params as PathParams;

    await delay(100);

    const member =
      memberData.find((m) => m.memberCk === memberId) || memberData[0];

    return HttpResponse.json({
      plans: member.plans,
    });
  }),

  // Get Policy Information
  http.get('/MemberServiceWeb/api/v1/policyInfo', async ({ request }) => {
    const url = new URL(request.url);
    const membersParam = url.searchParams.get('members');

    if (!membersParam) {
      return new HttpResponse(null, { status: 400 });
    }

    const memberIds = membersParam.split(',');
    const response = memberIds.map((id) => {
      const member = memberData.find((m) => m.memberCk === id) || memberData[0];

      return {
        memberCk: member.memberCk,
        subscriberName: member.firstName + ' ' + member.lastName,
        groupName: member.plans[0]?.groupName || 'Default Group',
        memberId: member.memberId,
        activePlanTypes: member.plans.map((p) => p.productType),
      };
    });

    await delay(200);

    return HttpResponse.json({
      policyInfo: response,
    });
  }),
];
