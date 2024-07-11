import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { ListOfDocuments } from '@/components/composite/ListOfDocuments';

const renderUI = () => {
  return render(
    <ListOfDocuments
      planDetails={[{ label: 'Date(Most Recent)', value: '1' }]}
      selectedPlanId="1"
      onSelectedPlanChange={() => {}}
      documentDetails={[
        {
          documentName: 'Caring for Asthma',
          receivedDate: 'Received: 01/20/2023',
          memberName: 'For Chris Hall',
        },
      ]}
    />,
  );
};
describe('ListOfDocuments', () => {
  it('ListOfDocuments', async () => {
    const component = renderUI();
    expect(screen.getByText('Filter Results:')).toBeVisible();
    expect(screen.getByText('1 Documents')).toBeVisible();
    expect(screen.getByText('Caring for Asthma')).toBeVisible();
    expect(screen.getByText('Received: 01/20/2023')).toBeVisible();
    expect(screen.getByText('For Chris Hall')).toBeVisible();
    expect(component).toMatchSnapshot();
  });
});
