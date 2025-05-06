import { Metadata } from 'next';
import MedicalPrescriptionPaymentPlan from './index';

export const metadata: Metadata = {
  title: 'Medical Prescription Payment Plan',
};

const MedicalPrescriptionPaymentPlanPage = () => {
  return <MedicalPrescriptionPaymentPlan />;
};

export default MedicalPrescriptionPaymentPlanPage;
