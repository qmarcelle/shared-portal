import { http, HttpResponse } from 'msw';
import { ChatType, ClientType } from '../../models/chat';

/**
 * Mock handlers for BCBST Chat API endpoints
 */
export const bcbstChatHandlers = [
  // Get Chat Information
  http.get(
    '/MemberServiceWeb/api/member/v1/members/:lookup/:memberId/chat/getChatInfo',
    ({ params }) => {
      const { lookup, memberId } = params;

      if (memberId === 'ineligible-member') {
        return HttpResponse.json(
          {
            chatGroup: null,
            workingHours: null,
            chatIDChatBotName: null,
            chatBotEligibility: false,
            routingChatBotEligibility: false,
            chatAvailable: false,
            cloudChatEligible: false,
          },
          { status: 200 },
        );
      }

      // Default eligible response
      return HttpResponse.json(
        {
          chatGroup: 'Test_Chat',
          workingHours: 'S_S_24', // 24/7 availability
          chatIDChatBotName: 'speechstorm-chatbot',
          chatBotEligibility: true,
          routingChatBotEligibility: true,
          chatAvailable: true,
          cloudChatEligible: true,
        },
        { status: 200 },
      );
    },
  ),

  // Get Cloud Chat Groups
  http.get(
    '/MemberServiceWeb/api/member/v1/members/chat/cloudChatGroups',
    () => {
      return HttpResponse.json(
        {
          chatGroups: [
            {
              name: 'Test_Chat',
              clientType: ClientType.Default,
              chatType: ChatType.DefaultChat,
            },
            {
              name: 'BlueCare_Chat',
              clientType: ClientType.BlueCare,
              chatType: ChatType.BlueCareChat,
            },
            {
              name: 'SeniorCare_Chat',
              clientType: ClientType.SeniorCare,
              chatType: ChatType.SeniorCareChat,
            },
          ],
        },
        { status: 200 },
      );
    },
  ),

  // Send Email (from requirements)
  http.post('/memberservice/api/v1/contactusemail', async ({ request }) => {
    const data = await request.json();

    return HttpResponse.json(
      {
        success: true,
        reference: `email-ref-${Date.now()}`,
        message: 'Email sent successfully',
      },
      { status: 200 },
    );
  }),

  // Get Phone Attributes (from requirements)
  http.get('/OperationHours', ({ request }) => {
    const url = new URL(request.url);
    const groupId = url.searchParams.get('groupId');
    const subscriberCk = url.searchParams.get('subscriberCk');

    return HttpResponse.json(
      {
        operatingHours: 'M_F_8_6', // Monday-Friday, 8AM-6PM
        phoneNumber: '1-800-565-9140',
        isAvailable: true,
      },
      { status: 200 },
    );
  }),

  // Get Email (from requirements)
  http.get('/memberContactPreference', ({ request }) => {
    const url = new URL(request.url);
    const memberKey = url.searchParams.get('memberKey');

    return HttpResponse.json(
      {
        email: 'member@example.com',
        isVerified: true,
        preferredContactMethod: 'email',
      },
      { status: 200 },
    );
  }),
];
