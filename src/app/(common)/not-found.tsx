import { Column } from '@/components/foundation/Column';
import { Header } from '@/components/foundation/Header';
import { Spacer } from '@/components/foundation/Spacer';
import { AppLink } from '@/components/foundation/AppLink';

export default function CommonNotFound() {
  return (
    <Column className="w-full h-screen items-center justify-center">
      <Header type="title-1" text="Page Not Found" />
      <Spacer size={16} />
      <p className="text-lg text-gray-600">
        The page you're looking for doesn't exist.
      </p>
      <Spacer size={32} />
      <AppLink href="/" label="Return Home" />
    </Column>
  );
}