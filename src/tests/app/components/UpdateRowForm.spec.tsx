import '@testing-library/jest-dom';
import { fireEvent, render, screen } from '@testing-library/react';

import { TextBox } from '@/components/foundation/TextBox';
import { UpdateRowForm } from '../../../app/otherProfileSettings/components/UpdateRowForm';

const renderUI = () => {
  const ethnicityList = [
    { label: 'Hispanic or Latino', enabled: true },
    { label: 'Not Hispanic or Latino', enabled: false },
    { label: 'Decline to answer', enabled: false },
  ];

  render(
    <UpdateRowForm
      label={
        <TextBox className="font-bold body-1" text="What is your ethnicity?" />
      }
      subLabel=""
      enabled={false}
      type={'radio'}
      optionObjects={ethnicityList}
      divider={true}
    />,
  );
};

describe('Race and Ethinicity slide', () => {
  it('should render the UI correctly', () => {
    const component = renderUI();
    const ethnicityList = [
      { label: 'Hispanic or Latino', enabled: true },
      { label: 'Not Hispanic or Latino', enabled: false },
      { label: 'Decline to answer', enabled: false },
    ];
    expect(screen.findByText('What is your ethnicity?'));
    ethnicityList.forEach((ethinicity) => {
      expect(screen.findAllByAltText(ethinicity.label)).toBeInTheDocument;
    });
    fireEvent.click(screen.getByRole('button', { name: /Save Answer/i }));
    expect(screen.findByText('What is your race?'));
    expect(screen.findByText(' How well do you speak English?'));

    expect(
      screen.findByText(
        'What language are you most comfortable using when speaking with your doctor?',
      ),
    );
    expect(screen.findByText('What language do you prefer to read?'));
    expect(component).toMatchSnapshot();
  });
});
