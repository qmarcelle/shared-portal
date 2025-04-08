import RequestFormPage from '@/app/1095BFormRequest/page';
import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';

const renderUI = async () => {
  const page = await RequestFormPage();
  return render(page);
};

describe('1095BFormRequest Page', () => {
  it('should render FormRequest Page UI correctly', async () => {
    const component = await renderUI();
    expect(screen.getByText('Request a 1095-B Form')).toBeVisible();
    expect(component.baseElement).toMatchSnapshot();
  });
});
