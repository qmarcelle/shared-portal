import { redirect } from 'next/navigation';
import {
  BenefitsSection,
  DependentsSection,
  PersonalInfoSection,
  ReviewSection,
  SpecialEnrollmentSection,
  TerminatePolicySection,
} from '../components/form-sections';

// Define valid steps
const VALID_STEPS = [
  'personal-info',
  'dependents',
  'benefits',
  'special-enrollment',
  'terminate-policy',
  'review',
];

export default function StepPage({ params }: { params: { step: string } }) {
  const { step } = params;

  // Validate step parameter
  if (!VALID_STEPS.includes(step)) {
    redirect('/insurance/change-form');
  }

  // Render the appropriate component based on step
  return (
    <>
      {step === 'personal-info' && <PersonalInfoSection />}
      {step === 'dependents' && <DependentsSection />}
      {step === 'benefits' && <BenefitsSection />}
      {step === 'special-enrollment' && <SpecialEnrollmentSection />}
      {step === 'terminate-policy' && <TerminatePolicySection />}
      {step === 'review' && <ReviewSection />}
    </>
  );
}
