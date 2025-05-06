import { Metadata } from 'next';
import { IComponent } from '@/components/IComponent';
import { TextBox } from '@/components/foundation/TextBox';
import { Header } from '@/components/foundation/Header';
import { Card } from '@/components/foundation/Card';
import { Button } from '@/components/foundation/Button';
import { AppLink } from '@/components/foundation/AppLink';

export const metadata: Metadata = {
  title: 'Benefit Not Found',
  description: 'The requested benefit information could not be found.',
};

/**
 * Not found page for benefits
 * Displays when a user navigates to a benefit that doesn't exist
 */
export default function BenefitNotFound(): JSX.Element {
  return (
    <div className="flex flex-col items-center justify-center w-full max-w-screen-xl mx-auto p-4">
      <Card className="w-full max-w-2xl p-6">
        <Header text="Benefit Not Found" className="text-xl mb-4" />
        <TextBox className="mb-6">
          We couldn't find the benefit information you're looking for. It might have been moved, 
          or the link you followed may be incorrect.
        </TextBox>
        
        <div className="flex flex-col sm:flex-row gap-4 mt-4">
          <AppLink href="/myplan/benefits" asButton>
            <Button>Go to Benefits & Coverage</Button>
          </AppLink>
          
          <AppLink href="/myplan" asButton>
            <Button variant="outline">Return to My Plan</Button>
          </AppLink>
        </div>
      </Card>
    </div>
  );
}