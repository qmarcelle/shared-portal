import { delay, http, HttpResponse, PathParams } from 'msw';
import { chatData } from '../mockData/chatData';
import { memberData } from '../mockData/memberData';

// Base path components
const apiPath = '/MemberServiceWeb/api/member/v1/members';

export const chatHandlers = [
  // Get Chat Information
  http.get(
    `${apiPath}/byMemberCk/:memberId/chat/getChatInfo`,
    async ({ params }) => {
      const { memberId } = params as PathParams;

      // Simulate delay (optional)
      await delay(100);

      // For ineligible members
      if (memberId === 'ineligible-member') {
        return HttpResponse.json({
          chatGroup: null,
          workingHours: null,
          chatIDChatBotName: null,
          chatBotEligibility: false,
          routingChatBotEligibility: false,
          chatAvailable: false,
          cloudChatEligible: false,
        });
      }

      // Find the appropriate chat response for this member ID
      const memberChat =
        chatData.find((chat) => chat.memberId === memberId) ||
        chatData.find((chat) => chat.memberId === 'default');

      // Use optional chaining to safely access chatInfo
      return HttpResponse.json(
        memberChat?.chatInfo || {
          chatGroup: null,
          workingHours: null,
          chatAvailable: false,
          cloudChatEligible: false,
        },
      );
    },
  ),

  // Get Cloud Chat Groups
  http.get(`${apiPath}/chat/cloudChatGroups`, async () => {
    await delay(100);

    return HttpResponse.json({
      cloudChatGroups: [
        {
          id: 'Test_Chat',
          name: 'General Member Support',
          description: 'General member questions and support',
        },
        {
          id: 'MBA_Individual_On_Marketplace_Chat',
          name: 'Marketplace Support',
          description: 'Support for marketplace plans',
        },
        {
          id: 'BlueCare_Chat',
          name: 'BlueCare Support',
          description: 'Support for BlueCare plans',
        },
        {
          id: 'ChatBot_IDCard',
          name: 'ID Card Support',
          description: 'Support for ID Card requests',
        },
      ],
    });
  }),

  // Send Email - US31842 requirement
  http.post('/memberservice/api/v1/contactusemail', async ({ request }) => {
    // Process the request data but don't use the variable to avoid linter error
    await request.json();
    await delay(200);

    return HttpResponse.json({
      success: true,
      messageId: 'MSG-' + Date.now(),
      status: 'Email request received',
    });
  }),

  // Get Phone Attributes - US31842 requirement
  http.get('/OperationHours', async ({ request }) => {
    // Access request URL but don't use the params to avoid linter errors
    new URL(request.url);

    await delay(150);

    return HttpResponse.json({
      operationHours: 'M-F 8AM-6PM (EST)',
      memberServicePhoneNumber: '1-800-565-9140',
      links: [
        {
          link: 'https://gtest.js.gdc.bcbst.com/PortalServices/IDCardService/OperationHours',
          rel: 'Self',
        },
      ],
    });
  }),

  // Get Email - US31842 requirement
  http.get('/memberContactPreference', async ({ request }) => {
    const url = new URL(request.url);
    const memberKey = url.searchParams.get('memberKey');
    // Remove unused params

    await delay(100);

    return HttpResponse.json({
      contactPreferences: [
        {
          type: 'email',
          value: `member${memberKey}@example.com`,
          isVerified: true,
          isPrimary: true,
        },
      ],
      dutyToWarn: [
        {
          type: 'p',
          texts: [
            'By checking this box I agree to enroll in email and mobile text communication service.',
          ],
        },
      ],
    });
  }),

  // Get Member Plans - For plan switching functionality
  http.get(`${apiPath}/byMemberCk/:memberId/plans`, async ({ params }) => {
    const { memberId } = params as PathParams;

    await delay(150);

    const member =
      memberData.find((m) => m.memberCk === memberId) || memberData[0];

    return HttpResponse.json({
      plans: member.plans,
    });
  }),

  // Get Member Details - For chat payload
  http.get(`${apiPath}/byMemberCk/:memberId`, async ({ params }) => {
    const { memberId } = params as PathParams;

    await delay(200);

    const member =
      memberData.find((m) => m.memberCk === memberId) || memberData[0];

    return HttpResponse.json({
      memberCk: member.memberCk,
      memberId: member.memberId,
      firstName: member.firstName,
      lastName: member.lastName,
      dateOfBirth: member.dateOfBirth,
      isVisionEligible: member.isVisionEligible,
      isDentalEligible: member.isDentalEligible,
      isMedicalEligible: member.isMedicalEligible,
    });
  }),

  // Mock for chat session functionality
  http.post(`${apiPath}/chat/session/initialize`, async ({ request }) => {
    const payload = await request.json();

    await delay(250);

    // Don't use planId variable to avoid linter error
    // Just extract and include in response for debugging

    return HttpResponse.json({
      sessionId: `chat-${Date.now()}`,
      payload, // Return the payload to verify it contains the right data
      startTime: new Date().toISOString(),
      status: 'initialized',
    });
  }),
];
