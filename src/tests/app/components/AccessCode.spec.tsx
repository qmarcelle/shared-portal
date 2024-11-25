import { AccessCode } from '@/components/composite/AccessCode';
import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';

const renderUI = (accessCode: string) => {
  return render(
    <>
      <AccessCode accessCodeData={accessCode} />
    </>,
  );
};

describe('CareTN Access Code Computation', () => {
  it('should render AccessCode correctly', () => {
    const component = renderUI('btnbluechat');
    screen.getByText('Access Code');
    screen.getByText('btnbluechat');
    expect(component.baseElement).toMatchSnapshot();
  });

  it('should render Error Scenario correctly', () => {
    const component = renderUI('');
    screen.getByText('Access code could not load.');
    expect(component.baseElement).toMatchSnapshot();
  });
});
