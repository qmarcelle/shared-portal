export default function ChatLayout({ children }: { children: React.ReactNode }) {
  console.log('[@chat/layout] Slot layout rendered. children:', children);
  return <>{children}</>;
}
