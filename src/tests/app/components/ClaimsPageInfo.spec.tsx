import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { ClaimDetails } from '@/models/claim_details';
import { ClaimsPageInformation } from '@/components/composite/ClaimsPageInformation';

const renderUI = (claimInfo: ClaimDetails) => {
  return render(<ClaimsPageInformation claimInfo={claimInfo} />);
};
describe('Pharmacy Claims page Information', () => {
  it('Pharmacy Claims page Information', () => {
    const claims = {
      id: 'Claim1',
      claimStatus: 'Pending',
      claimType: 'Pharmacy',
      claimTotal: null,
      issuer: 'John Hopkins',
      memberName: 'Chris Hall',
      serviceDate: '08/23/23',
      totalBilled: '535.00',
      claimsFlag: true,
      claimInfo: {},
    } as ClaimDetails;
    const component = renderUI(claims);
    expect(screen.getByText('John Hopkins')).toBeVisible();
    expect(screen.getByText('Visited on 08/23/23')).toBeVisible();
    expect(screen.getByText('For Chris Hall')).toBeVisible();
    expect(screen.getByText('Claim1')).toBeVisible();
    expect(screen.getByText('1234567890')).toBeVisible();
    expect(screen.getByText('In-Network')).toBeVisible();
    expect(component).toMatchSnapshot();
  });
});
