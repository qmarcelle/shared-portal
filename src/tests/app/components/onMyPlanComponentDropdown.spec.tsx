import { OnMyPlanComponent } from '@/components/composite/OnMyPlanComponent';
import { TextBox } from '@/components/foundation/TextBox';
import '@testing-library/jest-dom';
import { fireEvent, render, screen } from '@testing-library/react';
import { ShareMyInfoDetails } from '../../../app/(main)/shareMyInformation/models/sharemyinfo_details';

const renderUI = (
  planItems: ShareMyInfoDetails[],
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  selectedItem: ShareMyInfoDetails,
) => {
  return render(
    <OnMyPlanComponent
      items={planItems}
      initialSelectedValue={{
        label:
          'Subscriber ID ABC000000000 \n Medical/Dental/Vision \n Policy End 01/01/2000',
        shortLabel: 'Subscriber ID ABC000000000',
        value: '1',
        id: '2',
      }}
      onSelectedIdChange={() => {}}
      onMyPlanDetails={[]}
      infoIcon={false}
    />,
  );
};

describe('OnMyPlanComponent', () => {
  it('should render the UI correctly for more that one options', async () => {
    const { container } = renderUI(
      [
        {
          label:
            'Subscriber ID ABC000000000 \n Medical/Dental/Vision \n Policy End 01/01/2000',
          shortLabel: 'Subscriber ID ABC000000000',
          value: '1',
          id: '2',
        },
        {
          label:
            'Subscriber ID ABC123456789 \n Medical/Dental/Vision \n Policy Active',
          shortLabel: 'Subscriber ID ABC123456789',
          value: '0',
          id: '1',
        },
      ],
      {
        label:
          'Subscriber ID ABC000000000 \n Medical/Dental/Vision \n Policy End 01/01/2000',
        shortLabel: 'Subscriber ID ABC000000000',
        value: '1',
        id: '2',
      },
    );

    const { getByText } = render(<TextBox text="Subscriber ID ABC000000000" />);
    expect(getByText('Subscriber ID ABC000000000')).toBeTruthy();
    const dropdowncontent = screen.queryByText('Subscriber ID ABC000000000');
    expect(dropdowncontent).toBeInTheDocument();
    expect(container).toMatchSnapshot();
    fireEvent.click(screen.getByText('Subscriber ID ABC000000000'));
    render(
      <TextBox text="Subscriber ID ABC000000000 Medical/Dental/Vision Policy End 01/01/2000" />,
    );
    expect(
      getByText(
        'Subscriber ID ABC000000000 Medical/Dental/Vision Policy End 01/01/2000',
      ),
    ).toBeVisible();
    expect(container).toMatchSnapshot();
  });
});
