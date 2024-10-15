import { FindMedicalProvidersComponent } from '@/app/dashboard/components/FindMedicalProvidersComponent';
import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';

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
  });
});
