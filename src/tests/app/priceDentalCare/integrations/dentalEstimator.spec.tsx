import {
  getCategoryDropdownValues,
  getNetworkDropdownValues,
  getProcedureDropdownValues,
} from '@/app/priceDentalCare';
import { Network } from '@/app/priceDentalCare/models/network';
import { ProcedureResponse } from '@/app/priceDentalCare/models/procedureResponse';

describe('dental cost estimator', () => {
  describe('getNetworkDropdownValues', () => {
    it('should map networks to dropdown values', () => {
      const networks: Network[] = [
        {
          networkPrefix: 'CD09',
          networkDesc: 'BlueCarePlus',
        },
        {
          networkPrefix: 'CD10',
          networkDesc: 'BlueChoice(HMO)',
        },
      ];

      const result = getNetworkDropdownValues(networks);

      expect(result).toEqual([
        { label: 'BlueCarePlus', value: 'CD09', id: '0' },
        { label: 'BlueChoice(HMO)', value: 'CD10', id: '1' },
      ]);
    });
  });

  describe('getCategory and Procedure DropdownValues', () => {
    it('should map categories to dropdown values', () => {
      const categories: ProcedureResponse = {
        procedureCategories: [
          {
            id: 1,
            name: 'Exams',
            procedures: [
              {
                code: 'D0120',
                description: 'periodic oral evaluation',
                id: 1,
                name: 'Periodic Oral Eval',
              },
              {
                code: 'D0150',
                description: 'comprehensive oral evaluation',
                id: 2,
                name: 'Comprehensive Oral Eval',
              },
            ],
          },
          {
            id: 20,
            name: 'Fluoride',
            procedures: [
              {
                code: 'D1206',
                description: 'topical fluoride varnish',
                id: 18,
                name: 'Topical fluoride varnish',
              },
            ],
          },
        ],
      };

      const result = getCategoryDropdownValues(categories);
      const procedures = getProcedureDropdownValues([
        {
          code: 'D0120',
          description: 'periodic oral evaluation',
          id: 1,
          name: 'Periodic Oral Eval',
        },
        {
          code: 'D0150',
          description: 'comprehensive oral evaluation',
          id: 2,
          name: 'Comprehensive Oral Eval',
        },
      ]);

      expect(result).toEqual([
        { label: 'Exams', value: '1', id: '0' },
        { label: 'Fluoride', value: '20', id: '1' },
      ]);

      expect(procedures).toEqual([
        { label: 'Periodic Oral Eval', value: 'D0120', id: '0' },
        { label: 'Comprehensive Oral Eval', value: 'D0150', id: '1' },
      ]);
    });
  });
});
