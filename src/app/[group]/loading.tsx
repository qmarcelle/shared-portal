import { Column } from '@/components/foundation/Column';
import { Spacer } from '@/components/foundation/Spacer';

export default function GroupLoading() {
  return (
    <Column className="w-full h-screen items-center justify-center">
      <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-primary"></div>
      <Spacer size={16} />
      <p className="text-lg text-gray-600">Loading...</p>
    </Column>
  );
}