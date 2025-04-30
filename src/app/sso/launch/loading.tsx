import { Column } from '@/components/foundation/Column';
import { Spacer } from '@/components/foundation/Spacer';

export default function SSOLaunchLoading() {
  return (
    <main className="flex flex-col items-center page">
      <Column className="app-content app-base-font-color">
        <div className="animate-pulse">
          <div className="h-8 w-24 bg-gray-200 rounded"></div>
          <Spacer size={32} />
          <div className="h-8 w-64 bg-gray-200 rounded"></div>
          <Spacer size={16} />
          <div className="h-4 w-96 bg-gray-200 rounded"></div>
          <Spacer size={16} />
          <div className="h-10 w-48 bg-gray-200 rounded"></div>
        </div>
      </Column>
    </main>
  );
}
