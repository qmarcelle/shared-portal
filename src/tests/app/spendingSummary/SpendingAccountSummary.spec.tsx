import SpendingSummaryPage from '@/app/spendingSummary/page';
import {
  dentalIcon,
  medicalIcon,
  pharmacyIcon,
  visionIcon,
} from '@/components/foundation/Icons';
import '@testing-library/jest-dom';
import { fireEvent, render, screen } from '@testing-library/react';
import Image from 'next/image';
import { AnnualSpendingSummary } from '../../../app/dashboard/components/AnnualSpendingSummary';

const renderUI = () => {
  return render(
    <AnnualSpendingSummary
      className="large-section statementSummary"
      title="Statement Summary up to November 8, 2023"
      subTitle="View Medical, Pharmacy, Dental and Vision for All Members"
      amountPaid={1199.19}
      totalBilledAmount={9804.31}
      amountSaved={8605.12}
      amountSavedPercentage={89}
      color1={'#005EB9'}
      color2={'#5DC1FD'}
      service={[
        {
          serviceIcon: (
            <Image className="w-6" src={medicalIcon} alt="Medical Icon" />
          ),
          serviceLabel: 'Medical',
          serviceSubLabel: 'Your share',
          serviceSubLabelValue: 30.24,
          labelText1: 'Amount Billed',
          labelValue1: 145.0,
          labelText2: 'Plan Discount',
          labelValue2: 114.76,
          labelText3: 'Plan Paid',
          labelValue3: 0.0,
        },
        {
          serviceIcon: (
            <Image className="w-6" src={pharmacyIcon} alt="Pharmacy Icon" />
          ),
          serviceLabel: 'Pharmacy',
          serviceSubLabel: 'Your share',
          serviceSubLabelValue: 30.24,
          labelText1: 'Amount Billed',
          labelValue1: 145.0,
          labelText2: 'Plan Discount',
          labelValue2: 114.76,
          labelText3: 'Plan Paid',
          labelValue3: 0.0,
        },
        {
          serviceIcon: (
            <Image className="w-6" src={dentalIcon} alt="Dental Icon" />
          ),
          serviceLabel: 'Dental',
          serviceSubLabel: 'Your share',
          serviceSubLabelValue: 30.24,
          labelText1: 'Amount Billed',
          labelValue1: 145.0,
          labelText2: 'Plan Discount',
          labelValue2: 114.76,
          labelText3: 'Plan Paid',
          labelValue3: 0.0,
        },
        {
          serviceIcon: (
            <Image className="w-6" src={visionIcon} alt="Vision Icon" />
          ),
          serviceLabel: 'Vision',
          serviceSubLabel: 'Your share',
          serviceSubLabelValue: 30.24,
          labelText1: 'Amount Billed',
          labelValue1: 145.0,
          labelText2: 'Plan Discount',
          labelValue2: 114.76,
          labelText3: 'Plan Paid',
          labelValue3: 0.0,
        },
      ]}
    />,
  );
};

describe('AnnualSpendingSummary', () => {
  it('should render the UI correctly', async () => {
    const component = renderUI();
    expect(
      screen.getByText('Statement Summary up to November 8, 2023'),
    ).toBeVisible();
    expect(screen.getByText('You Paid')).toBeVisible();
    expect(screen.getByText('You Saved')).toBeVisible();
    expect(screen.getByText('Your plan paid')).toBeVisible;
    expect(screen.getByText('of your costs')).toBeVisible();
    expect(screen.getByText('Total Billed')).toBeVisible();

    expect(screen.getByText('Medical')).toBeInTheDocument();
    expect(screen.getByText('Pharmacy')).toBeInTheDocument();
    expect(screen.getByText('Dental')).toBeInTheDocument();
    expect(screen.getByText('Vision')).toBeInTheDocument();

    let serviceRenderedSectionContent = screen.queryByText('Amount Billed');
    expect(serviceRenderedSectionContent).not.toBeInTheDocument();

    fireEvent.click(screen.getByText('Medical')); //check that body text is visible after clicking
    serviceRenderedSectionContent = screen.getByText('Amount Billed');
    expect(serviceRenderedSectionContent).toBeInTheDocument();

    fireEvent.click(screen.getByText('Medical')); //check that it is not visible after clicking again
    serviceRenderedSectionContent = screen.queryByText('Amount Billed');
    expect(serviceRenderedSectionContent).not.toBeInTheDocument();

    expect(component.baseElement).toMatchSnapshot();
  });

  it('should render the UI correctly', async () => {
    const Result = await SpendingSummaryPage({
      searchParams: new Promise((resolve) => {
        resolve({ type: 'Pharmacy' });
      }),
    });
    const component = render(Result);
    screen.getByRole('heading', {
      name: 'Spending Summary',
    });
    screen.getByRole('button', {
      name: /Download a PDF Statement/i,
    });
    screen.getAllByText('Pharmacy');
    expect(component).toMatchSnapshot();
  });
});
