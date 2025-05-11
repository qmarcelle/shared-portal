'use client';
// import TCs from '@/app/@chat/config/terms'; // { default: '…', lobA: '…', … }
import { useChatStore } from '@/app/(chat)/stores/chatStore';
import { RichText } from '@/components/foundation/RichText';

/**
 * Render T&C based on LOB
 */
export default function TermsAndConditions() {
  const { userData } = useChatStore();
  // const text = TCs[userData.LOB] || TCs.default;
  return (
    <RichText
      spans={['Terms and Conditions']}
      className="terms-and-conditions"
      type="body-2"
    />
  );
}
