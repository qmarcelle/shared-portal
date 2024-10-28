import { UpdateRowWithStatus } from '@/components/composite/UpdateRowWithStatus';
import { TextBox } from '@/components/foundation/TextBox';
import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import Image from 'next/image';
import editIcon from '../../../../public/assets/edit.svg';

const renderUI = (enabled: boolean) => {
  return render(
    <UpdateRowWithStatus
      label={
        <TextBox
          className="underline underline-offset-4 decoration-dashed app-underline font-bold"
          text="Authenticator App"
        />
      }
      subLabel="Use your authenticator app's security code"
      methodName="Remove Method"
      icon={<Image src={editIcon} alt="link" />}
      divider={true}
      enabled={enabled}
    />,
  );
};

describe('Update Row With Status', () => {
  it('should render the UI with ON', () => {
    const component = renderUI(true);

    expect(screen.getByText('Authenticator App')).toBeVisible();
    expect(
      screen.getByText('Use your authenticator app&apos;s security code'),
    ).toBeVisible();
    expect(screen.getByText('Remove Method')).toBeVisible();
    screen.getAllByText('ON');
    expect(component.baseElement).toMatchSnapshot();
  });
  it('should render the UI correctly OFF', () => {
    const component = renderUI(false);

    expect(screen.getByText('Authenticator App')).toBeVisible();
    expect(
      screen.getByText('Use your authenticator app&apos;s security code'),
    ).toBeVisible();
    expect(screen.getByText('Remove Method')).toBeVisible();
    screen.getAllByText('OFF');
    expect(component.baseElement).toMatchSnapshot();
  });
});
