import { FindMedicalProvidersComponent } from '@/app/(protected)/(common)/member/dashboard/components/FindMedicalProvidersComponent';
import '@testing-library/jest-dom';
import { fireEvent, render, screen } from '@testing-library/react';

const mockPush = jest.fn();
jest.mock('next/navigation', () => ({
  useRouter() {
    return {
      push: mockPush,
    };
  },
}));
process.env.NEXT_PUBLIC_IDP_EMBOLD = 'EMBOLD';
process.env.NEXT_PUBLIC_IDP_PROVIDER_DIRECTORY = 'PROVIDER_DIRECTORY';
const renderUI = () => {
  return render(<FindMedicalProvidersComponent />);
};

describe('FindMedicalProvidersComponent', () => {
  it('should render UI correctly', () => {
    const component = renderUI();

    expect(
      screen.getByText(
        'Use the employer-provided Embold Health search tool to',
      ),
    ).toBeVisible();
    expect(screen.getByText('find medical providers.')).toBeVisible();
    expect(screen.getByText('find other care')).toBeVisible();
    expect(
      screen.getByText(
        ', like dental or vision, use our find care search tool.',
      ),
    ).toBeVisible();
    expect(screen.queryAllByText('Find Medical Providers')).toHaveLength(2);
    expect(screen.getByText('Find Other Care')).toBeVisible();
    expect(component.baseElement).toMatchSnapshot();
    fireEvent.click(
      screen.getByRole('button', { name: 'Find Medical Providers' }),
    );
    expect(mockPush).toHaveBeenCalledWith('/sso/launch?PartnerSpId=EMBOLD');
  });
  it('should navigate to Sapphire SSO', () => {
    const component = renderUI();

    expect(screen.getByText('Find Other Care')).toBeVisible();
    expect(component.baseElement).toMatchSnapshot();
    fireEvent.click(screen.getByRole('button', { name: 'Find Other Care' }));
    expect(mockPush).toHaveBeenCalledWith(
      '/sso/launch?PartnerSpId=PROVIDER_DIRECTORY',
    );
  });
});
