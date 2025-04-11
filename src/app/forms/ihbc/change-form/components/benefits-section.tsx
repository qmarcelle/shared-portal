// components/insurance-form/benefits-section.tsx
'use client';

import { useEffect, useState } from 'react';
import { useFormContext } from 'react-hook-form';
import { Plan } from '../../lib/schemas';
import { useFormStore } from '../stores/stores';

export function BenefitsSection() {
  const {
    register,
    watch,
    setValue,
    formState: { errors },
  } = useFormContext();
  const { benefits, updateBenefits } = useFormStore();
  const { meta } = useFormStore();
  const [medicalPlans, setMedicalPlans] = useState<Plan[]>([]);
  const [dentaPlans, setDentalPlans] = useState<Plan[]>([]);
  const [visionPlans, setVisionPlans] = useState<Plan[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPlans, setCurrentPlans] = useState<{
    medical?: Plan;
    dental?: Plan;
    vision?: Plan;
  }>({});

  // Fetch plans - in a real app, this would be an API call
  useEffect(() => {
    // Simulate API call to fetch available plans
    setTimeout(() => {
      setMedicalPlans([
        {
          id: 'bronze-b01s',
          name: 'BlueCross Bronze B01S',
          premium: 998.5,
          metalLevel: 'Bronze',
          network: 'S',
          deductible: 3500,
          outOfPocketMax: 6000,
          officeVisitCopay: 'Ded / Coins',
          specialistCopay: 'Ded / Coins',
          rxCoverage: 'Ded / Coins',
        },
        {
          id: 'silver-s01p',
          name: 'BlueCross Silver S01P',
          premium: 1456.75,
          metalLevel: 'Silver',
          network: 'P',
          deductible: 2000,
          outOfPocketMax: 4500,
          officeVisitCopay: '$25',
          specialistCopay: '$50',
          rxCoverage: 'Tier 1: $10, Tier 2: $35',
        },
        {
          id: 'gold-g01p',
          name: 'BlueCross Gold G01P',
          premium: 1876.22,
          metalLevel: 'Gold',
          network: 'P',
          deductible: 1200,
          outOfPocketMax: 3000,
          officeVisitCopay: '$15',
          specialistCopay: '$30',
          rxCoverage: 'Tier 1: $5, Tier 2: $25',
        },
      ]);

      setDentalPlans([
        {
          id: 'personal-dental',
          name: 'Personal Dental',
          premium: 53.0,
          metalLevel: 'N/A' as any,
          network: 'Dental',
          deductible: 50,
          outOfPocketMax: 1000,
          officeVisitCopay: 'N/A',
          specialistCopay: 'N/A',
          rxCoverage: 'N/A',
        },
      ]);

      setVisionPlans([
        {
          id: 'visionblue-exam-only',
          name: 'VisionBlue Exam Only',
          premium: 11.62,
          metalLevel: 'N/A' as any,
          network: 'Vision',
          deductible: 0,
          outOfPocketMax: 0,
          officeVisitCopay: 'N/A',
          specialistCopay: 'N/A',
          rxCoverage: 'N/A',
        },
        {
          id: 'visionblue-exam-materials',
          name: 'VisionBlue Exam Plus Materials',
          premium: 23.24,
          metalLevel: 'N/A' as any,
          network: 'Vision',
          deductible: 0,
          outOfPocketMax: 0,
          officeVisitCopay: 'N/A',
          specialistCopay: 'N/A',
          rxCoverage: 'N/A',
        },
      ]);

      // Set current plans from subscriber data
      setCurrentPlans({
        medical: {
          id: 'bronze-b01p',
          name: 'BlueCross Bronze B01P',
          premium: 1236.13,
          metalLevel: 'Bronze',
          network: 'P',
          deductible: 2500,
          outOfPocketMax: 5000,
          officeVisitCopay: 'Ded / Coins',
          specialistCopay: 'Ded / Coins',
          rxCoverage: 'Ded / Coins',
        },
        dental: {
          id: 'personal-dental',
          name: 'Personal Dental',
          premium: 26.5,
          metalLevel: 'N/A' as any,
          network: 'Dental',
          deductible: 50,
          outOfPocketMax: 1000,
          officeVisitCopay: 'N/A',
          specialistCopay: 'N/A',
          rxCoverage: 'N/A',
        },
        vision: {
          id: 'visionblue-exam-only',
          name: 'VisionBlue Exam Only',
          premium: 5.81,
          metalLevel: 'N/A' as any,
          network: 'Vision',
          deductible: 0,
          outOfPocketMax: 0,
          officeVisitCopay: 'N/A',
          specialistCopay: 'N/A',
          rxCoverage: 'N/A',
        },
      });

      setLoading(false);
    }, 1000);
  }, []);

  // Update form values from store
  useEffect(() => {
    if (benefits) {
      setValue('benefits.changeMedicalPlan', benefits.changeMedicalPlan);
      setValue('benefits.medicalPlanId', benefits.medicalPlanId);
      setValue('benefits.changeDentalPlan', benefits.changeDentalPlan);
      setValue('benefits.dentalPlanId', benefits.dentalPlanId);
      setValue('benefits.changeVisionPlan', benefits.changeVisionPlan);
      setValue('benefits.visionPlanId', benefits.visionPlanId);
    }
  }, [benefits, setValue]);

  if (loading) {
    return <div className="text-center py-8">Loading plan options...</div>;
  }

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Select Your Plan</h2>

      {/* Medical Plans Section */}
      <div className="mb-8">
        <h3 className="text-lg font-medium mb-2">Current Medical Benefits</h3>
        <p className="mb-4">
          To keep your current benefits, select Keep Current Benefit from the
          table below.
        </p>

        {/* Current Medical Plan */}
        {currentPlans.medical && (
          <div className="overflow-x-auto mb-4">
            <table className="min-w-full border border-gray-300">
              <thead className="bg-blue-50">
                <tr>
                  <th className="px-4 py-2 border text-left">
                    Keep Current Benefit
                  </th>
                  <th className="px-4 py-2 border text-left">
                    Plan Name (View Plan Details)
                  </th>
                  <th className="px-4 py-2 border text-left">Rate Per Month</th>
                  <th className="px-4 py-2 border text-left">Metal Level</th>
                  <th className="px-4 py-2 border text-left">Network</th>
                  <th className="px-4 py-2 border text-left">Deductible</th>
                  <th className="px-4 py-2 border text-left">
                    Out of Pocket Max
                  </th>
                  <th className="px-4 py-2 border text-left">
                    Office Visit Copay
                  </th>
                  <th className="px-4 py-2 border text-left">
                    Specialist Copay
                  </th>
                  <th className="px-4 py-2 border text-left">RX</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="px-4 py-2 border">
                    <input
                      type="radio"
                      name="keepCurrentMedical"
                      className="h-4 w-4"
                      onChange={() => {
                        setValue('benefits.changeMedicalPlan', false);
                        setValue('benefits.medicalPlanId', undefined);
                        updateBenefits({
                          changeMedicalPlan: false,
                          medicalPlanId: undefined,
                        });
                      }}
                    />
                  </td>
                  <td className="px-4 py-2 border">
                    <a href="#" className="text-blue-600 underline">
                      {currentPlans.medical.name}
                    </a>
                  </td>
                  <td className="px-4 py-2 border font-bold text-orange-700">
                    ${currentPlans.medical.premium.toFixed(2)}
                  </td>
                  <td className="px-4 py-2 border">
                    {currentPlans.medical.metalLevel}
                  </td>
                  <td className="px-4 py-2 border font-bold">
                    {currentPlans.medical.network}
                  </td>
                  <td className="px-4 py-2 border">
                    ${currentPlans.medical.deductible.toLocaleString()}{' '}
                    Individual / $
                    {(currentPlans.medical.deductible * 2).toLocaleString()}{' '}
                    Family
                  </td>
                  <td className="px-4 py-2 border">
                    ${currentPlans.medical.outOfPocketMax.toLocaleString()}{' '}
                    Individual / $
                    {(currentPlans.medical.outOfPocketMax * 2).toLocaleString()}{' '}
                    Family
                  </td>
                  <td className="px-4 py-2 border">
                    {currentPlans.medical.officeVisitCopay}
                  </td>
                  <td className="px-4 py-2 border">
                    {currentPlans.medical.specialistCopay}
                  </td>
                  <td className="px-4 py-2 border">
                    {currentPlans.medical.rxCoverage}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        )}

        {/* Available Medical Plans */}
        <h3 className="text-lg font-medium mb-2">Select Your Plan</h3>

        <div className="overflow-x-auto">
          <table className="min-w-full border border-gray-300">
            <thead className="bg-blue-50">
              <tr>
                <th className="px-4 py-2 border text-left">Choose Plan</th>
                <th className="px-4 py-2 border text-left">
                  Plan Name (View Plan Details)
                </th>
                <th className="px-4 py-2 border text-left">Rate Per Month</th>
                <th className="px-4 py-2 border text-left">Metal Level</th>
                <th className="px-4 py-2 border text-left">Network</th>
                <th className="px-4 py-2 border text-left">Deductible</th>
                <th className="px-4 py-2 border text-left">
                  Out of Pocket Max
                </th>
                <th className="px-4 py-2 border text-left">
                  Office Visit Copay
                </th>
                <th className="px-4 py-2 border text-left">Specialist Copay</th>
                <th className="px-4 py-2 border text-left">RX</th>
              </tr>
            </thead>
            <tbody>
              {medicalPlans.map((plan) => (
                <tr key={plan.id}>
                  <td className="px-4 py-2 border">
                    <input
                      type="radio"
                      name="medicalPlan"
                      value={plan.id}
                      className="h-4 w-4"
                      onChange={() => {
                        setValue('benefits.changeMedicalPlan', true);
                        setValue('benefits.medicalPlanId', plan.id);
                        updateBenefits({
                          changeMedicalPlan: true,
                          medicalPlanId: plan.id,
                        });
                      }}
                    />
                  </td>
                  <td className="px-4 py-2 border">
                    <a href="#" className="text-blue-600 underline">
                      {plan.name}
                    </a>
                  </td>
                  <td className="px-4 py-2 border font-bold text-orange-700">
                    ${plan.premium.toFixed(2)}
                  </td>
                  <td className="px-4 py-2 border">{plan.metalLevel}</td>
                  <td className="px-4 py-2 border font-bold">{plan.network}</td>
                  <td className="px-4 py-2 border">
                    ${plan.deductible.toLocaleString()} Individual / $
                    {(plan.deductible * 2).toLocaleString()} Family
                  </td>
                  <td className="px-4 py-2 border">
                    ${plan.outOfPocketMax.toLocaleString()} Individual / $
                    {(plan.outOfPocketMax * 2).toLocaleString()} Family
                  </td>
                  <td className="px-4 py-2 border">{plan.officeVisitCopay}</td>
                  <td className="px-4 py-2 border">{plan.specialistCopay}</td>
                  <td className="px-4 py-2 border">{plan.rxCoverage}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Similar sections for Dental and Vision Plans */}
    </div>
  );
}
