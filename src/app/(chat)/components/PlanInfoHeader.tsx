'use client';
import { useChatStore } from '@/app/(chat)/stores/chatStore';
import { Title } from '@/components/foundation/Title';

/**
 * Show current plan when multiple plans exist
 */
export default function PlanInfoHeader() {
  const { formInputs } = useChatStore();
  if (formInputs.length <= 1) return null;
  const plan = formInputs.find((f) => f.id === 'PLAN_ID');

  return (
    <Title
      className="plan-info-header"
      text={`You are chatting about plan ${plan?.value || ''}`}
    />
  );
}
