import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { http, HttpResponse } from 'msw';
import React from 'react';
import { server } from '../../../mocks/server';
import { renderWithChatProvider, setupChatTests } from './ChatTestSetup';
import { ChatWidget } from './__mocks__/ChatWidget';
import { ClientType, PlanInfo } from './__mocks__/chatModels';

// Mock the chat store
jest.mock('../../../app/chat/stores/chatStore', () => {
  return {
    ...jest.requireActual('./__mocks__/chatStore'),
  };
});

// Setup MSW for tests
setupChatTests();

/**
 * User Story 31146: Chat Data Payload Refresh
 *
 * The chat data payload must update when a member changes plans via the plan switcher
 */
describe('US31146: Chat Data Payload Refresh', () => {
  // Mock PlanSwitcher component
  const PlanSwitcher = ({
    onPlanChange,
  }: {
    onPlanChange: (plan: PlanInfo) => void;
  }) => (
    <select
      data-testid="plan-switcher"
      onChange={(e) => {
        const selectedPlan =
          mockAvailablePlans.find((plan) => plan.planId === e.target.value) ||
          mockAvailablePlans[0];
        onPlanChange(selectedPlan as unknown as PlanInfo);
      }}
    >
      {mockAvailablePlans.map((plan) => (
        <option key={plan.planId} value={plan.planId}>
          {plan.planName}
        </option>
      ))}
    </select>
  );

  // Mock plans
  const mockAvailablePlans = [
    {
      planId: 'PLAN789',
      planName: 'Premium Health Plan',
      lineOfBusiness: ClientType.Default,
      isEligibleForChat: true,
      businessHours: 'S_S_24',
    },
    {
      planId: 'PLAN123',
      planName: 'Dental Plan',
      lineOfBusiness: ClientType.Individual,
      isEligibleForChat: true,
      businessHours: 'M_F_8_6',
    },
  ];

  // Default props
  const defaultProps = {
    currentPlan: mockAvailablePlans[0] as PlanInfo,
    availablePlans: mockAvailablePlans as PlanInfo[],
    isPlanSwitcherOpen: false,
    openPlanSwitcher: jest.fn(),
    closePlanSwitcher: jest.fn(),
  };

  // Define a more specific type for the payload
  interface ChatPayload {
    SERV_TYPE?: string;
    firstname?: string;
    lastname?: string;
    PLAN_ID?: string;
    GROUP_ID?: string;
    MEMBER_ID?: string;
    LOB?: string;
    INQ_TYPE?: string;
    RoutingChatbotInteractionId?: string;
    coverage_eligibility?: boolean | string;
    Origin?: string;
    Source?: string;
    [key: string]: unknown;
  }

  // Chat payload capture
  let capturedPayload: ChatPayload | null = null;

  beforeEach(() => {
    // Clear all mocks
    jest.clearAllMocks();
    // Reset payload capture
    capturedPayload = null;

    // Add handler to capture the chat initialization payload
    server.use(
      http.post(
        '/MemberServiceWeb/api/member/v1/members/chat/session/initialize',
        async ({ request }) => {
          const requestData = await request.json();
          // Use type assertion to set the payload
          capturedPayload = requestData as ChatPayload;

          return HttpResponse.json({
            sessionId: `chat-${Date.now()}`,
            payload: capturedPayload,
            startTime: new Date().toISOString(),
            status: 'initialized',
          });
        },
      ),
    );
  });

  it('should update chat payload when plan is switched', async () => {
    // Set up component with ability to change plans
    const TestComponent = () => {
      const [currentPlan, setCurrentPlan] = React.useState(
        defaultProps.currentPlan,
      );

      return (
        <>
          <PlanSwitcher onPlanChange={setCurrentPlan} />
          <ChatWidget {...defaultProps} currentPlan={currentPlan} />
        </>
      );
    };

    renderWithChatProvider(<TestComponent />);

    // Open chat
    const chatButton = screen.getByRole('button', { name: /chat with us/i });
    await userEvent.click(chatButton);

    // Complete the chat form
    const serviceTypeSelect = screen.getByLabelText(/service.*help/i);
    await userEvent.selectOptions(serviceTypeSelect, 'GENERAL');

    const inquiryTypeSelect = screen.getByLabelText(/specific inquiry/i);
    await userEvent.selectOptions(inquiryTypeSelect, 'BENEFITS');

    // Start chat with initial plan
    const startChatButton = screen.getByRole('button', { name: /start chat/i });
    await userEvent.click(startChatButton);

    // Wait for initialization
    await waitFor(() => {
      // Check if the payload contains the correct plan ID
      expect(capturedPayload?.PLAN_ID).toBe('PLAN789');
    });

    // Close the chat
    const closeButton = screen.getByRole('button', { name: /close/i });
    await userEvent.click(closeButton);

    // Switch plan
    const planSwitcher = screen.getByTestId('plan-switcher');
    await userEvent.selectOptions(planSwitcher, 'PLAN123');

    // Reopen chat
    await userEvent.click(chatButton);

    // Complete form again
    await userEvent.selectOptions(serviceTypeSelect, 'GENERAL');
    await userEvent.selectOptions(inquiryTypeSelect, 'BENEFITS');

    // Start chat with new plan
    await userEvent.click(startChatButton);

    // Verify that the chat payload was updated with new plan info
    await waitFor(() => {
      expect(capturedPayload?.PLAN_ID).toBe('PLAN123');
    });
  });

  it('should include all required payload fields', async () => {
    renderWithChatProvider(<ChatWidget {...defaultProps} />);

    // Open chat
    const chatButton = screen.getByRole('button', { name: /chat with us/i });
    await userEvent.click(chatButton);

    // Complete the chat form
    const serviceTypeSelect = screen.getByLabelText(/service.*help/i);
    await userEvent.selectOptions(serviceTypeSelect, 'GENERAL');

    const inquiryTypeSelect = screen.getByLabelText(/specific inquiry/i);
    await userEvent.selectOptions(inquiryTypeSelect, 'BENEFITS');

    // Start chat
    const startChatButton = screen.getByRole('button', { name: /start chat/i });
    await userEvent.click(startChatButton);

    // Verify all required payload fields
    await waitFor(() => {
      expect(capturedPayload).toMatchObject({
        SERV_TYPE: expect.any(String),
        firstname: expect.any(String),
        lastname: expect.any(String),
        PLAN_ID: expect.any(String),
        GROUP_ID: expect.any(String),
        MEMBER_ID: expect.any(String),
        LOB: expect.any(String),
        INQ_TYPE: expect.any(String),
        // Other required fields from the user story
        RoutingChatbotInteractionId: expect.any(String),
        coverage_eligibility: expect.anything(),
        Origin: expect.any(String),
        Source: expect.any(String),
      });
    });
  });
});
