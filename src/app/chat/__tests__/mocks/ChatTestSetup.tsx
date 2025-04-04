import { render, RenderOptions } from '@testing-library/react';
import { ReactElement } from 'react';

// Custom render for chat components
export function renderWithChatProvider(
  ui: ReactElement,
  options?: Omit<RenderOptions, 'queries'>,
) {
  return render(ui, {
    // Add providers here if needed (e.g. chat store provider)
    ...options,
  });
}

// Add chat-specific test data and mocks
export const chatTestData = {
  // Multi-plan member
  multiPlanMember: '91722401',

  // Single-plan member
  singlePlanMember: '993543351',

  // Ineligible member
  ineligibleMember: 'ineligible-member',

  // Sample chat payload
  sampleChatPayload: {
    SERV_TYPE: 'GENERAL',
    firstname: 'CHRIS',
    RoutingChatbotInteractionId: 'chat-123456',
    PLAN_ID: 'MBSSOV2E',
    lastname: 'HALL',
    GROUP_ID: '100000',
    IDCardBotName: 'speechstorm-chatbot',
    IsVisionEligible: true,
    MEMBER_ID: '90221882300',
    coverage_eligibility: true,
    INQ_TYPE: 'BENEFITS',
    IsDentalEligible: true,
    MEMBER_DOB: '1980-01-01',
    LOB: 'Commercial',
    lob_group: 'Commercial',
    IsMedicalEligibile: true,
    Origin: 'MemberPortal',
    Source: 'Web',
  },
};
