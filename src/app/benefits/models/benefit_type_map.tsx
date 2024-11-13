import Image from 'next/image';
import estimateCost from '../../../../public/assets/estimate_cost.svg';
import estimatePharmacyCost from '../../../../public/assets/estimate_pharmacy_cost.svg';
import externalIcon from '../../../../public/assets/external.svg';
import servicesUsed from '../../../../public/assets/services_used.svg';
import { BenefitTypeDetail } from './benefit_details';
import { BenefitType } from './benefit_type';

export const BenefitTypeMap: Map<BenefitType, BenefitTypeDetail> = new Map([
  [
    BenefitType.OfficeVisits,
    {
      benefitType: BenefitType.OfficeVisits,
      benefitTypeHeaderDetails: {
        title: 'Office Visits',
        benefitLevelDetails: [
          {
            benefitLevel: 'Benefit Level 1',
            benefitValue: '[Services performed by ...]',
          },
          {
            benefitLevel: 'Benefit Level 2',
            benefitValue: '[Services performed by ...]',
          },
        ],
      },
      benefitDetails: [
        {
          listBenefitDetails: [
            {
              benefitTitle: 'Benefit Level 1 Office Visit, PCP In-Network:',
              copayOrCoinsurance: '$10 Copay',
            },
            {
              benefitTitle: 'Benefit Level 2 Office Visit, PCP In-Network:',
              copayOrCoinsurance: '$30 Copay',
            },
            {
              benefitTitle: 'Office Visit, PCP Out-of-Network:',
              copayOrCoinsurance: '40$ Coinsurance after you pay deductible',
            },
          ],
        },
        {
          listBenefitDetails: [
            {
              benefitTitle:
                'Benefit Level 1 Office Visit, Specialist In-Network:',
              copayOrCoinsurance: '$45 Copay',
            },
            {
              benefitTitle:
                'Benefit Level 2 Office Visit, Specialist In-Network:',
              copayOrCoinsurance: '$45 Copay',
            },
            {
              benefitTitle: 'Office Visit, Specialist Out-of-Network:',
              copayOrCoinsurance: '40% Coinsurance after you pay deductible',
            },
          ],
        },
        {
          listBenefitDetails: [
            {
              benefitTitle: 'Benefit Level 1 Office Surgery, PCP In-Network:',
              copayOrCoinsurance: '$10 Copay',
            },
            {
              benefitTitle: 'Benefit Level 2 Office Surgery, PCP In-Network:',
              copayOrCoinsurance: '$45 Copay',
            },
            {
              benefitTitle: 'Office Surgery, PCP Out-of-Network:',
              copayOrCoinsurance: '40% Coinsurance after you pay deductible',
            },
          ],
        },
        {
          listBenefitDetails: [
            {
              benefitTitle:
                'Benefit Level 1 Office Surgery, Specialist In-Network:',
              copayOrCoinsurance: '$45 Copay',
            },
            {
              benefitTitle:
                'Benefit Level 2 Office Surgery, Specialist In-Network:',
              copayOrCoinsurance: '$45 Copay',
            },
            {
              benefitTitle: 'Office Surgery, Specialist Out-of-Network:',
              copayOrCoinsurance: '40% Coinsurance after you pay deductible',
            },
          ],
        },
        {
          listBenefitDetails: [
            {
              benefitTitle:
                'Benefit Level 1 Routine Diagnostic Services, Office In-Network:',
              copayOrCoinsurance: '$0 Copay',
            },
            {
              benefitTitle:
                'Benefit Level 2 Routine Diagnostic Services, Office In-Network:',
              copayOrCoinsurance: '$0 Copay',
            },
            {
              benefitTitle:
                'Routine Diagnostic Services, Office Out-of-Network:',
              copayOrCoinsurance: '40% Coinsurance after you pay deductible',
            },
          ],
        },
        {
          listBenefitDetails: [
            {
              benefitTitle:
                'Benefit Level 1 Teladoc Health General Medical In-Network:',
              copayOrCoinsurance: '$15 Copay',
            },
            {
              benefitTitle:
                'Benefit Level 2 Teladoc Health General Medical In-Network:',
              copayOrCoinsurance: '$15 Copay',
            },
          ],
        },
        {
          listBenefitDetails: [
            {
              benefitTitle:
                'Benefit Level 1 Teladoc Health Mental Health Care In-Network:',
              copayOrCoinsurance: '$15 Copay',
            },
            {
              benefitTitle:
                'Benefit Level 2 Teladoc Health Mental Health Care In-Network:',
              copayOrCoinsurance: '$15 Copay',
            },
          ],
        },
        {
          listBenefitDetails: [
            {
              benefitTitle:
                'Benefit Level 1 Teladoc Health Mental Health Digital Program In-Network:',
              copayOrCoinsurance: '$0 Copay',
            },
            {
              benefitTitle:
                'Benefit Level 2 Teladoc Health Mental Health Digital Program In-Network:',
              copayOrCoinsurance: '$0 Copay',
            },
          ],
        },
        {
          listBenefitDetails: [
            {
              benefitTitle:
                'Benefit Level 1 Teladoc Health Dermatology In-Network:',
              copayOrCoinsurance: '$15 Copay',
            },
            {
              benefitTitle:
                'Benefit Level 2 Teladoc Health Dermatology In-Network:',
              copayOrCoinsurance: '$15 Copay',
            },
          ],
        },
        {
          listBenefitDetails: [
            {
              benefitTitle:
                'Benefit Level 1 Teladoc Health Back and Joint Care In-Network:',
              copayOrCoinsurance: '$0 Copay',
            },
            {
              benefitTitle:
                'Benefit Level 2 Teladoc Health Back and Joint Care In-Network:',
              copayOrCoinsurance: '$0 Copay',
            },
          ],
        },
        {
          listBenefitDetails: [
            {
              benefitTitle:
                'Benefit Level 1 Teladoc Health Nutrition Counseling In-Network:',
              copayOrCoinsurance: '$0 Copay',
            },
            {
              benefitTitle:
                'Benefit Level 2 Teladoc Health Nutrition Counseling In-Network:',
              copayOrCoinsurance: '$0 Copay',
            },
          ],
        },
        {
          listBenefitDetails: [
            {
              benefitTitle:
                'Benefit Level 1 Chiropractic Manipulation In-Network:',
              copayOrCoinsurance:
                '20% Coinsurance after you pay the deductible',
            },
            {
              benefitTitle:
                'Benefit Level 2 Chiropractic Manipulation In-Network:',
              copayOrCoinsurance:
                '20% Coinsurance after you pay the deductible',
            },
            {
              benefitTitle: 'Chiropractic Manipulation Out-of-Network:',
              copayOrCoinsurance:
                '40% Coinsurance after you pay the deductible',
            },
          ],
          note: 'Limited to 60 visits per benefit period.',
        },
        {
          listBenefitDetails: [
            {
              benefitTitle: 'Benefit Level 1 Urgent Care, Facility In-Network:',
              copayOrCoinsurance: '$50 Copay',
            },
            {
              benefitTitle: 'Benefit Level 2 Urgent Care, Facility In-Network:',
              copayOrCoinsurance: '$60 Copay',
            },
            {
              benefitTitle: 'Urgent Care, Facility Out-of-Network:',
              copayOrCoinsurance:
                '40% Coinsurance after you pay the deductible',
            },
          ],
        },
        {
          listBenefitDetails: [
            {
              benefitTitle:
                'Benefit Level 1 Urgent Care, Physician In-Network:',
              copayOrCoinsurance: '$50 Copay',
            },
            {
              benefitTitle:
                'Benefit Level 2 Urgent Care, Physician In-Network:',
              copayOrCoinsurance: '$60 Copay',
            },
            {
              benefitTitle: 'Urgent Care, Physician Out-of-Network:',
              copayOrCoinsurance:
                '40% Coinsurance after you pay the deductible',
            },
          ],
        },
      ],
      estimateCosts: {
        label: 'Estimate Costs',
        body: 'Plan your upcoming care costs before you make an appointment.',
        icon: estimateCost,
        link: 'findcare',
      },
      servicesUsed: {
        label: 'Services Used',
        // eslint-disable-next-line quotes
        body: "View a list of common services, the maximum amount covered by your plan and how many you've used.",
        icon: servicesUsed,
        link: 'servicesused',
      },
      medicalAndPharmacyBalance: {
        className: 'large-section benefit-type-card',
        members: [
          {
            label: 'Chris Hall',
            value: '0',
          },
          {
            label: 'Megan Chaler',
            value: '43',
          },
        ],
        balanceNetworks: [
          {
            label: 'In-Network',
            value: '0',
          },
          { label: 'Out-of-Network', value: '1' },
        ],
        deductibleLimit: 1500,
        deductibleSpent: 750,
        onSelectedMemberChange: () => {},
        onSelectedNetworkChange: () => {},
        outOfPocketLimit: 3750,
        outOfPocketSpent: 1875,
        selectedMemberId: '43',
        selectedNetworkId: '0',
        displayDisclaimerText: false,
      },
      spendingAccounts: {
        className: 'm-2 mt-4 p-8',
        fsaBalance: 1009.5,
        hsaBalance: 349.9,
        linkURL: '/spendingAccounts',
      },
      getHelpWithBenefits: {
        headerText: 'Get Help with Benefits',
        linkURL: 'Benefits & Coverage FAQ',
      },
    },
  ],
  [
    BenefitType.PrescriptionDrugs,
    {
      benefitType: BenefitType.PrescriptionDrugs,
      benefitTypeHeaderDetails: {
        title: 'Prescription Drugs',
        benefitLevelDetails: [
          {
            benefitLevel: 'Benefit Level 1',
            benefitValue: '[Services performed by ...]',
          },
          {
            benefitLevel: 'Benefit Level 2',
            benefitValue: '[Services performed by ...]',
          },
        ],
      },
      benefitDetails: [
        {
          listBenefitDetails: [
            {
              benefitTitle:
                'Benefit Level 1 Prescription Drugs, Generic x1 In-Network:',
              copayOrCoinsurance: '$15 Copay',
            },
            {
              benefitTitle:
                'Benefit Level 2 Prescription Drugs, Generic x1 In-Network:',
              copayOrCoinsurance: '$15 Copay',
            },
            {
              benefitTitle: 'Prescription Drugs, Generic x1 Out-of-Network:',
              copayOrCoinsurance: '40$ Coinsurance after you pay deductible',
            },
          ],
        },
        {
          listBenefitDetails: [
            {
              benefitTitle:
                'Benefit Level 1 Prescription Drugs, Preferred Brand x1 In-Network:',
              copayOrCoinsurance: '$50 Copay',
            },
            {
              benefitTitle:
                'Benefit Level 2 Prescription Drugs, Preferred Brand x1 In-Network:',
              copayOrCoinsurance: '$50 Copay',
            },
            {
              benefitTitle:
                'Prescription Drugs, Preferred Brand x1 Out-of-Network:',
              copayOrCoinsurance: '40% Coinsurance after you pay deductible',
            },
          ],
        },
        {
          listBenefitDetails: [
            {
              benefitTitle:
                'Benefit Level 1 Prescription Drugs, Non-Preferred Brand x1 In-Network:',
              copayOrCoinsurance: '$65 Copay',
            },
            {
              benefitTitle:
                'Benefit Level 2 Prescription Drugs, Non-Preferred Brand x1 In-Network:',
              copayOrCoinsurance: '$65 Copay',
            },
            {
              benefitTitle:
                'Prescription Drugs, Non-Preferred Brand x1 Out-of-Network:',
              copayOrCoinsurance: '40% Coinsurance after you pay deductible',
            },
          ],
        },
      ],
      findDrugsCostAndCoverage: {
        label: 'Find Drugs Cost & Coverage',
        body: 'Your pharmacy benefits are managed by CVS Caremark. You can estimate drug costs and view your coverage at caremark.com.',
        icon: estimatePharmacyCost,
        suffix: (
          <Image src={externalIcon} alt="external" className="inline mx-1" />
        ),
      },

      medicalAndPharmacyBalance: {
        className: 'large-section benefit-type-card',
        members: [
          {
            label: 'Chris Hall',
            value: '0',
          },
          {
            label: 'Megan Chaler',
            value: '43',
          },
        ],
        balanceNetworks: [
          {
            label: 'In-Network',
            value: '0',
          },
          { label: 'Out-of-Network', value: '1' },
        ],
        deductibleLimit: 1500,
        deductibleSpent: 750,
        onSelectedMemberChange: () => {},
        onSelectedNetworkChange: () => {},
        outOfPocketLimit: 3750,
        outOfPocketSpent: 1875,
        selectedMemberId: '43',
        selectedNetworkId: '0',
        displayDisclaimerText: false,
      },
      spendingAccounts: {
        className: 'm-2 mt-4 p-8',
        fsaBalance: 1009.5,
        hsaBalance: 349.9,
        linkURL: '/spendingAccounts',
      },
      getHelpWithBenefits: {
        headerText: 'Get Help with Benefits',
        linkURL: 'Benefits & Coverage FAQ',
      },
    },
  ],
  [
    BenefitType.DentalBasic,
    {
      benefitType: BenefitType.DentalBasic,
      benefitTypeHeaderDetails: {
        title: 'Dental Basic',
      },
      benefitDetails: [
        {
          listBenefitDetails: [
            {
              benefitTitle: 'Denture Repair, Full or Partial In-Network:',
              copayOrCoinsurance:
                '20% Coinsurance after you pay the deductible',
            },
            {
              benefitTitle: 'Denture Repair, Full or Partial Out-of-Network:',
              copayOrCoinsurance:
                '20% Coinsurance after you pay the deductible',
            },
          ],
          note: '1 in a 24 month period',
        },
        {
          listBenefitDetails: [
            {
              benefitTitle: 'Esthetic Coated Stainless Steel Crown In-Network:',
              copayOrCoinsurance:
                '20% Coinsurance after you pay the deductible',
            },
            {
              benefitTitle:
                'Esthetic Coated Stainless Steel Crown Out-of-Network:',
              copayOrCoinsurance:
                '20% Coinsurance after you pay the deductible',
            },
          ],
          note: '1 in a 36 month period, for primary teeth, limits with stainless steel crowns',
        },
        {
          listBenefitDetails: [
            {
              benefitTitle: 'Fillings, Amalgam or Resin In-Network:',
              copayOrCoinsurance:
                '20% Coinsurance after you pay the deductible',
            },
            {
              benefitTitle: 'Fillings, Amalgam or Resin Out-of-Network:',
              copayOrCoinsurance:
                '20% Coinsurance after you pay the deductible',
            },
          ],
          note: '1 per tooth surface in a 12 month period',
        },
        {
          listBenefitDetails: [
            {
              benefitTitle:
                'Palliative Treatment for the Relief of Pain In-Network:',
              copayOrCoinsurance:
                '20% Coinsurance after you pay the deductible',
            },
            {
              benefitTitle:
                'Palliative Treatment for the Relief of Pain Out-of-Network:',
              copayOrCoinsurance:
                '20% Coinsurance after you pay the deductible',
            },
          ],
        },
        {
          listBenefitDetails: [
            {
              benefitTitle:
                'Prefabricated Porcelain Ceramic Crowns In-Network:',
              copayOrCoinsurance:
                '20% Coinsurance after you pay the deductible',
            },
            {
              benefitTitle:
                'Prefabricated Porcelain Ceramic Crowns Out-of-Network:',
              copayOrCoinsurance:
                '20% Coinsurance after you pay the deductible',
            },
          ],
          note: '1 in a 36 month period, for primary anterior teeth, limits with stainless steel crowns',
        },
        {
          listBenefitDetails: [
            {
              benefitTitle: 'Resin Infiltration In-Network:',
              copayOrCoinsurance:
                '20% Coinsurance after you pay the deductible',
            },
            {
              benefitTitle: 'Resin Infiltration Out-of-Network:',
              copayOrCoinsurance:
                '20% Coinsurance after you pay the deductible',
            },
          ],
          note: '1 per lifetime for ages 15 and under for first or second permanent molar teeth, limits with sealants and preventive resins',
        },
        {
          listBenefitDetails: [
            {
              benefitTitle:
                'Stainless Steel Crown with Resin Window In-Network:',
              copayOrCoinsurance:
                '20% Coinsurance after you pay the deductible',
            },
            {
              benefitTitle:
                'Stainless Steel Crown with Resin Window Out-of-Network:',
              copayOrCoinsurance:
                '20% Coinsurance after you pay the deductible',
            },
          ],
          note: '1 in a 36 month period, for primary teeth, limits with stainless steel crowns',
        },
        {
          listBenefitDetails: [
            {
              benefitTitle: 'Stainless Steel Crowns In-Network:',
              copayOrCoinsurance:
                '20% Coinsurance after you pay the deductible',
            },
            {
              benefitTitle: 'Stainless Steel Crowns Out-of-Network:',
              copayOrCoinsurance:
                '20% Coinsurance after you pay the deductible',
            },
          ],
          note: '1 in a 36 month period per tooth',
        },
      ],
      estimateCosts: {
        label: 'Estimate Costs',
        body: 'Plan your upcoming care costs before you make an appointment.',
        icon: estimateCost,
        link: '/findcare',
      },
      dentalBalance: {
        title: 'Dental Balance',
        className: 'large-section',
        members: [
          {
            label: 'Chris Hall',
            value: '0',
          },
          {
            label: 'Megan Chaler',
            value: '43',
          },
        ],
        deductibleLimit: undefined,
        deductibleSpent: undefined,
        onSelectedMemberChange: () => {},
        outOfPocketLimit: undefined,
        outOfPocketSpent: undefined,
        selectedMemberId: '0',
        serviceDetailsUsed: [
          {
            limitAmount: '2000',
            spentAmount: '90.0',
            serviceName: 'Annual Maximum Basic and Major Coverage',
          },
          {
            limitAmount: '2000',
            spentAmount: '0.0',
            serviceName: 'Ortho Lifetime Maximum',
          },
        ],
        balancesFlag: false,
      },
      spendingAccounts: {
        className: 'large-section',
        fsaBalance: 1009.5,
        hsaBalance: 349.9,
        linkURL: '/spendingAccounts',
      },
      getHelpWithBenefits: {
        headerText: 'Get Help with Benefits',
        linkURL: 'Benefits & Coverage FAQ',
      },
    },
  ],
]);

// export const BenefitTypeMap: Map<BenefitType, BenefitTypeDetail> = new Map([
//   [
//     BenefitType.OfficeVisits,
//     {
//       benefitType: BenefitType.OfficeVisits,
//       benefitTypeHeaderDetails: {
//         title: 'Office Visits',
//         benefitLevelDetails: [
//           {
//             benefitLevel: 'Benefit Level 1',
//             benefitValue: '[Services performed by ...]',
//           },
//           {
//             benefitLevel: 'Benefit Level 2',
//             benefitValue: '[Services performed by ...]',
//           },
//         ],
//       },
//       benefitDetails: [
//         {
//           listBenefitDetails: [
//             {
//               benefitTitle: 'Benefit Level 1 Office Visit, PCP In-Network:',
//               copayOrCoinsurance: '$10 Copay',
//             },
//             {
//               benefitTitle: 'Benefit Level 2 Office Visit, PCP In-Network:',
//               copayOrCoinsurance: '$30 Copay',
//             },
//             {
//               benefitTitle: 'Office Visit, PCP Out-of-Network:',
//               copayOrCoinsurance: '40$ Coinsurance after you pay deductible',
//             },
//           ],
//         },
//         {
//           listBenefitDetails: [
//             {
//               benefitTitle:
//                 'Benefit Level 1 Office Visit, Specialist In-Network:',
//               copayOrCoinsurance: '$45 Copay',
//             },
//             {
//               benefitTitle:
//                 'Benefit Level 2 Office Visit, Specialist In-Network:',
//               copayOrCoinsurance: '$45 Copay',
//             },
//             {
//               benefitTitle: 'Office Visit, Specialist Out-of-Network:',
//               copayOrCoinsurance: '40% Coinsurance after you pay deductible',
//             },
//           ],
//         },
//         {
//           listBenefitDetails: [
//             {
//               benefitTitle: 'Benefit Level 1 Office Surgery, PCP In-Network:',
//               copayOrCoinsurance: '$10 Copay',
//             },
//             {
//               benefitTitle: 'Benefit Level 2 Office Surgery, PCP In-Network:',
//               copayOrCoinsurance: '$45 Copay',
//             },
//             {
//               benefitTitle: 'Office Surgery, PCP Out-of-Network:',
//               copayOrCoinsurance: '40% Coinsurance after you pay deductible',
//             },
//           ],
//         },
//         {
//           listBenefitDetails: [
//             {
//               benefitTitle:
//                 'Benefit Level 1 Office Surgery, Specialist In-Network:',
//               copayOrCoinsurance: '$45 Copay',
//             },
//             {
//               benefitTitle:
//                 'Benefit Level 2 Office Surgery, Specialist In-Network:',
//               copayOrCoinsurance: '$45 Copay',
//             },
//             {
//               benefitTitle: 'Office Surgery, Specialist Out-of-Network:',
//               copayOrCoinsurance: '40% Coinsurance after you pay deductible',
//             },
//           ],
//         },
//         {
//           listBenefitDetails: [
//             {
//               benefitTitle:
//                 'Benefit Level 1 Routine Diagnostic Services, Office In-Network:',
//               copayOrCoinsurance: '$0 Copay',
//             },
//             {
//               benefitTitle:
//                 'Benefit Level 2 Routine Diagnostic Services, Office In-Network:',
//               copayOrCoinsurance: '$0 Copay',
//             },
//             {
//               benefitTitle:
//                 'Routine Diagnostic Services, Office Out-of-Network:',
//               copayOrCoinsurance: '40% Coinsurance after you pay deductible',
//             },
//           ],
//         },
//         {
//           listBenefitDetails: [
//             {
//               benefitTitle:
//                 'Benefit Level 1 Teladoc Health General Medical In-Network:',
//               copayOrCoinsurance: '$15 Copay',
//             },
//             {
//               benefitTitle:
//                 'Benefit Level 2 Teladoc Health General Medical In-Network:',
//               copayOrCoinsurance: '$15 Copay',
//             },
//           ],
//         },
//         {
//           listBenefitDetails: [
//             {
//               benefitTitle:
//                 'Benefit Level 1 Teladoc Health Mental Health Care In-Network:',
//               copayOrCoinsurance: '$15 Copay',
//             },
//             {
//               benefitTitle:
//                 'Benefit Level 2 Teladoc Health Mental Health Care In-Network:',
//               copayOrCoinsurance: '$15 Copay',
//             },
//           ],
//         },
//         {
//           listBenefitDetails: [
//             {
//               benefitTitle:
//                 'Benefit Level 1 Teladoc Health Mental Health Digital Program In-Network:',
//               copayOrCoinsurance: '$0 Copay',
//             },
//             {
//               benefitTitle:
//                 'Benefit Level 2 Teladoc Health Mental Health Digital Program In-Network:',
//               copayOrCoinsurance: '$0 Copay',
//             },
//           ],
//         },
//         {
//           listBenefitDetails: [
//             {
//               benefitTitle:
//                 'Benefit Level 1 Teladoc Health Dermatology In-Network:',
//               copayOrCoinsurance: '$15 Copay',
//             },
//             {
//               benefitTitle:
//                 'Benefit Level 2 Teladoc Health Dermatology In-Network:',
//               copayOrCoinsurance: '$15 Copay',
//             },
//           ],
//         },
//         {
//           listBenefitDetails: [
//             {
//               benefitTitle:
//                 'Benefit Level 1 Teladoc Health Back and Joint Care In-Network:',
//               copayOrCoinsurance: '$0 Copay',
//             },
//             {
//               benefitTitle:
//                 'Benefit Level 2 Teladoc Health Back and Joint Care In-Network:',
//               copayOrCoinsurance: '$0 Copay',
//             },
//           ],
//         },
//         {
//           listBenefitDetails: [
//             {
//               benefitTitle:
//                 'Benefit Level 1 Teladoc Health Nutrition Counseling In-Network:',
//               copayOrCoinsurance: '$0 Copay',
//             },
//             {
//               benefitTitle:
//                 'Benefit Level 2 Teladoc Health Nutrition Counseling In-Network:',
//               copayOrCoinsurance: '$0 Copay',
//             },
//           ],
//         },
//         {
//           listBenefitDetails: [
//             {
//               benefitTitle:
//                 'Benefit Level 1 Chiropractic Manipulation In-Network:',
//               copayOrCoinsurance:
//                 '20% Coinsurance after you pay the deductible',
//             },
//             {
//               benefitTitle:
//                 'Benefit Level 2 Chiropractic Manipulation In-Network:',
//               copayOrCoinsurance:
//                 '20% Coinsurance after you pay the deductible',
//             },
//             {
//               benefitTitle: 'Chiropractic Manipulation Out-of-Network:',
//               copayOrCoinsurance:
//                 '40% Coinsurance after you pay the deductible',
//             },
//           ],
//           note: 'Limited to 60 visits per benefit period.',
//         },
//         {
//           listBenefitDetails: [
//             {
//               benefitTitle: 'Benefit Level 1 Urgent Care, Facility In-Network:',
//               copayOrCoinsurance: '$50 Copay',
//             },
//             {
//               benefitTitle: 'Benefit Level 2 Urgent Care, Facility In-Network:',
//               copayOrCoinsurance: '$60 Copay',
//             },
//             {
//               benefitTitle: 'Urgent Care, Facility Out-of-Network:',
//               copayOrCoinsurance:
//                 '40% Coinsurance after you pay the deductible',
//             },
//           ],
//         },
//         {
//           listBenefitDetails: [
//             {
//               benefitTitle:
//                 'Benefit Level 1 Urgent Care, Physician In-Network:',
//               copayOrCoinsurance: '$50 Copay',
//             },
//             {
//               benefitTitle:
//                 'Benefit Level 2 Urgent Care, Physician In-Network:',
//               copayOrCoinsurance: '$60 Copay',
//             },
//             {
//               benefitTitle: 'Urgent Care, Physician Out-of-Network:',
//               copayOrCoinsurance:
//                 '40% Coinsurance after you pay the deductible',
//             },
//           ],
//         },
//       ],
//       estimateCosts: {
//         label: 'Estimate Costs',
//         body: 'Plan your upcoming care costs before you make an appointment.',
//         icon: estimateCost,
//         link: 'findcare',
//       },
//       servicesUsed: {
//         label: 'Services Used',
//         // eslint-disable-next-line quotes
//         body: "View a list of common services, the maximum amount covered by your plan and how many you've used.",
//         icon: servicesUsed,
//         link: 'servicesused',
//       },
//       medicalAndPharmacyBalance: {
//         className: 'large-section benefit-type-card',
//         members: [
//           {
//             label: 'Chris Hall',
//             value: '0',
//           },
//           {
//             label: 'Megan Chaler',
//             value: '43',
//           },
//         ],
//         balanceNetworks: [
//           {
//             label: 'In-Network',
//             value: '0',
//           },
//           { label: 'Out-of-Network', value: '1' },
//         ],
//         deductibleLimit: 1500,
//         deductibleSpent: 750,
//         onSelectedMemberChange: () => {},
//         onSelectedNetworkChange: () => {},
//         outOfPocketLimit: 3750,
//         outOfPocketSpent: 1875,
//         selectedMemberId: '43',
//         selectedNetworkId: '0',
//         displayDisclaimerText: false,
//       },
//       spendingAccounts: {
//         className: 'm-2 mt-4 p-8',
//         fsaBalance: 1009.5,
//         hsaBalance: 349.9,
//         linkURL: '/spendingAccounts',
//       },
//       getHelpWithBenefits: {
//         headerText: 'Get Help with Benefits',
//         linkURL: 'Benefits & Coverage FAQ',
//       },
//     },
//   ],
//   [
//     BenefitType.DentalBasic,
//     {
//       benefitType: BenefitType.DentalBasic,
//       benefitTypeHeaderDetails: {
//         title: 'Dental Basic',
//       },
//       benefitDetails: [
//         {
//           listBenefitDetails: [
//             {
//               benefitTitle: 'Denture Repair, Full or Partial In-Network:',
//               copayOrCoinsurance:
//                 '20% Coinsurance after you pay the deductible',
//             },
//             {
//               benefitTitle: 'Denture Repair, Full or Partial Out-of-Network:',
//               copayOrCoinsurance:
//                 '20% Coinsurance after you pay the deductible',
//             },
//           ],
//           note: '1 in a 24 month period',
//         },
//         {
//           listBenefitDetails: [
//             {
//               benefitTitle: 'Esthetic Coated Stainless Steel Crown In-Network:',
//               copayOrCoinsurance:
//                 '20% Coinsurance after you pay the deductible',
//             },
//             {
//               benefitTitle:
//                 'Esthetic Coated Stainless Steel Crown Out-of-Network:',
//               copayOrCoinsurance:
//                 '20% Coinsurance after you pay the deductible',
//             },
//           ],
//           note: '1 in a 36 month period, for primary teeth, limits with stainless steel crowns',
//         },
//         {
//           listBenefitDetails: [
//             {
//               benefitTitle: 'Fillings, Amalgam or Resin In-Network:',
//               copayOrCoinsurance:
//                 '20% Coinsurance after you pay the deductible',
//             },
//             {
//               benefitTitle: 'Fillings, Amalgam or Resin Out-of-Network:',
//               copayOrCoinsurance:
//                 '20% Coinsurance after you pay the deductible',
//             },
//           ],
//           note: '1 per tooth surface in a 12 month period',
//         },
//         {
//           listBenefitDetails: [
//             {
//               benefitTitle:
//                 'Palliative Treatment for the Relief of Pain In-Network:',
//               copayOrCoinsurance:
//                 '20% Coinsurance after you pay the deductible',
//             },
//             {
//               benefitTitle:
//                 'Palliative Treatment for the Relief of Pain Out-of-Network:',
//               copayOrCoinsurance:
//                 '20% Coinsurance after you pay the deductible',
//             },
//           ],
//         },
//         {
//           listBenefitDetails: [
//             {
//               benefitTitle:
//                 'Prefabricated Porcelain Ceramic Crowns In-Network:',
//               copayOrCoinsurance:
//                 '20% Coinsurance after you pay the deductible',
//             },
//             {
//               benefitTitle:
//                 'Prefabricated Porcelain Ceramic Crowns Out-of-Network:',
//               copayOrCoinsurance:
//                 '20% Coinsurance after you pay the deductible',
//             },
//           ],
//           note: '1 in a 36 month period, for primary anterior teeth, limits with stainless steel crowns',
//         },
//         {
//           listBenefitDetails: [
//             {
//               benefitTitle: 'Resin Infiltration In-Network:',
//               copayOrCoinsurance:
//                 '20% Coinsurance after you pay the deductible',
//             },
//             {
//               benefitTitle: 'Resin Infiltration Out-of-Network:',
//               copayOrCoinsurance:
//                 '20% Coinsurance after you pay the deductible',
//             },
//           ],
//           note: '1 per lifetime for ages 15 and under for first or second permanent molar teeth, limits with sealants and preventive resins',
//         },
//         {
//           listBenefitDetails: [
//             {
//               benefitTitle:
//                 'Stainless Steel Crown with Resin Window In-Network:',
//               copayOrCoinsurance:
//                 '20% Coinsurance after you pay the deductible',
//             },
//             {
//               benefitTitle:
//                 'Stainless Steel Crown with Resin Window Out-of-Network:',
//               copayOrCoinsurance:
//                 '20% Coinsurance after you pay the deductible',
//             },
//           ],
//           note: '1 in a 36 month period, for primary teeth, limits with stainless steel crowns',
//         },
//         {
//           listBenefitDetails: [
//             {
//               benefitTitle: 'Stainless Steel Crowns In-Network:',
//               copayOrCoinsurance:
//                 '20% Coinsurance after you pay the deductible',
//             },
//             {
//               benefitTitle: 'Stainless Steel Crowns Out-of-Network:',
//               copayOrCoinsurance:
//                 '20% Coinsurance after you pay the deductible',
//             },
//           ],
//           note: '1 in a 36 month period per tooth',
//         },
//       ],
//       estimateCosts: {
//         label: 'Estimate Costs',
//         body: 'Plan your upcoming care costs before you make an appointment.',
//         icon: estimateCost,
//         link: '/findcare',
//       },
//       dentalBalance: {
//         className: 'large-section',
//         members: [
//           {
//             label: 'Chris Hall',
//             value: '0',
//           },
//           {
//             label: 'Megan Chaler',
//             value: '43',
//           },
//         ],
//         deductibleLimit: null,
//         deductibleSpent: null,
//         onSelectedMemberChange: () => {},
//         outOfPocketLimit: null,
//         outOfPocketSpent: null,
//         selectedMemberId: '0',
//         serviceDetailsUsed: [
//           {
//             limitAmount: 2000,
//             spentAmount: 90.0,
//             serviceName: 'Annual Maximum Basic and Major Coverage',
//           },
//           {
//             limitAmount: 2000,
//             spentAmount: 0.0,
//             serviceName: 'Ortho Lifetime Maximum',
//           },
//         ],
//         balancesFlag: false,
//       },
//       spendingAccounts: {
//         className: 'large-section',
//         fsaBalance: 1009.5,
//         hsaBalance: 349.9,
//         linkURL: '/spendingAccounts',
//       },
//       getHelpWithBenefits: {
//         headerText: 'Get Help with Benefits',
//         linkURL: 'Benefits & Coverage FAQ',
//       },
//     },
//   ],
// ]);
