'use client';

export default function ChatError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  // Return null to avoid showing error UI in the chat slot
  // ChatLoader component will handle its own error states
  return null;
}