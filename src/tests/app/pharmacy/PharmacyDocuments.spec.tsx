import { PharmacyDocuments } from '@/app/pharmacy/components/PharmacyDocuments';
import { downloadIcon, rightIcon } from '@/components/foundation/Icons';
import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import Image from 'next/image';

const renderUI = () => {
  return render(
    <PharmacyDocuments
      linkDetails={[
        {
          linkTitle: 'View Covered Drug List (Formulary)',
          linkDescription: 'Download a list of all the drugs your plan covers.',
          linkURL: 'http://www.bcbst.com/docs/pharmacy/go-510.pdf',
          linkIcon: (
            <Image src={downloadIcon} alt="download Icon" className="inline" />
          ),
        },
        {
          linkTitle: 'Prescription Drug Claim Form',
          linkDescription:
            "We call it the G0-510 form. You'll use it only for prescription drug claims when the claim is not filled through your pharmacist.",
          linkURL: 'http://www.bcbst.com/docs/pharmacy/go-510.pdf',
          linkIcon: (
            <Image src={downloadIcon} alt="download Icon" className="inline" />
          ),
        },
        {
          linkTitle: 'Prescription Mail Service Order Form',
          linkDescription:
            'Mail order is easy and convenient. You can have your prescriptions delivered right to your home.',
          linkIcon: (
            <Image src={downloadIcon} alt="download Icon" className="inline" />
          ),
        },
        {
          linkTitle:
            'Request for Medicare Prescription Drug Coverage Determination',
          linkDescription:
            'You can request an exception for prescription drug coverage.',
          linkIcon: (
            <Image src={rightIcon} alt="right arrow Icon" className="inline" />
          ),
        },
        {
          linkTitle:
            'Request for Redetermination of Medicare Prescription Drug Denial',
          linkDescription:
            'If you received a Notice of Denial of Medicare Prescription Drug Coverage, you can ask us for a redetermination (appeal).',
          linkIcon: (
            <Image src={rightIcon} alt="right arrow Icon" className="inline" />
          ),
        },
      ]}
    />,
  );
};

describe('PharmacyDocuments', () => {
  it('should render UI correctly', async () => {
    const component = renderUI();

    screen.getByText('View Covered Drug List (Formulary)');
    screen.getByText('Download a list of all the drugs your plan covers.');

    screen.getByText('Prescription Drug Claim Form');
    screen.getByText(
      // eslint-disable-next-line quotes
      "We call it the G0-510 form. You'll use it only for prescription drug claims when the claim is not filled through your pharmacist.",
    );

    screen.getByText('Prescription Mail Service Order Form');
    screen.getByText(
      'Mail order is easy and convenient. You can have your prescriptions delivered right to your home.',
    );

    screen.getByText(
      'Request for Medicare Prescription Drug Coverage Determination',
    );
    screen.getByText(
      'You can request an exception for prescription drug coverage.',
    );

    screen.getByText(
      'Request for Redetermination of Medicare Prescription Drug Denial',
    );
    screen.getByText(
      'If you received a Notice of Denial of Medicare Prescription Drug Coverage, you can ask us for a redetermination (appeal).',
    );

    expect(component.baseElement).toMatchSnapshot();
  });
});
