export interface Plan {
  productType: string;
  productId: string;
  name: string;
  classId: string;
  coverageLevel: string;
  exchange: boolean;
  individual: boolean;
  pediatric: boolean;
  effectiveDate: Date;
  termDate: Date | null; //Term date is null if the value in Facets is 12/31/2199 or 9999 etc.
  eligibilityIndicator: 'Y' | 'N';
}
