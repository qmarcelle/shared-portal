export const chatData = [
  {
    memberId: '91722401', // Cloud-enabled chat
    chatInfo: {
      chatGroup: 'Test_Chat',
      workingHours: 'S_S_24',
      chatIDChatBotName: 'speechstorm-chatbot',
      chatBotEligibility: true,
      routingChatBotEligibility: true,
      chatAvailable: true,
      cloudChatEligible: true,
    },
  },
  {
    memberId: '993543351', // Non-cloud chat
    chatInfo: {
      chatGroup: 'MBA_Individual_On_Marketplace_Chat',
      workingHours: 'M_F_8_6',
      chatIDChatBotName: 'speechstorm-chatbot',
      chatBotEligibility: true,
      routingChatBotEligibility: true,
      chatAvailable: false, // Simulating outside of business hours
      cloudChatEligible: false,
    },
  },
  {
    memberId: 'default', // Default fallback
    chatInfo: {
      chatGroup: 'Test_Chat',
      workingHours: 'M_F_8_6',
      chatIDChatBotName: 'speechstorm-chatbot',
      chatBotEligibility: true,
      routingChatBotEligibility: true,
      chatAvailable: true,
      cloudChatEligible: false,
    },
  },
];
