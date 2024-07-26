import '@testing-library/jest-dom';
import { fireEvent, render, screen } from '@testing-library/react';
import { ChooseMentalHealthProvider } from '../../../../app/(main)/mentalHealthOptions/components/ChooseMentalHealthProviderSection';

const renderUI = () => {
  return render(<ChooseMentalHealthProvider className="large-section" />);
};

describe('ChooseMentalHealthProvider', () => {
  it('should render the UI correctly', async () => {
    const component = renderUI();
    screen.getByRole('heading', { name: 'Choosing a Mental Health Provider' });
    screen.getByText(
      'You can speak with a therapist or a psychiatrist (a medical doctor that can prescribe medicine). Or try a self-guided program with personalized recommendations.',
    );

    screen.getByText('About Psychiatrists');
    let Psychiatrists = screen.queryByText(
      'If you are looking for medication evaluation or help with ongoing medication management, schedule a visit with a psychiatrist (MD/DO). Psychiatrists are medical doctors who may or may not provide talk therapy.',
    );
    expect(Psychiatrists).not.toBeInTheDocument();

    fireEvent.click(screen.getByText('About Psychiatrists')); //check that body text is visible after clicking
    Psychiatrists = screen.queryByText(
      'If you are looking for medication evaluation or help with ongoing medication management, schedule a visit with a psychiatrist (MD/DO). Psychiatrists are medical doctors who may or may not provide talk therapy.',
    );
    expect(Psychiatrists).toBeInTheDocument();

    fireEvent.click(screen.getByText('About Psychiatrists')); //check that it is not visible after clicking again
    Psychiatrists = screen.queryByText(
      'If you are looking for medication evaluation or help with ongoing medication management, schedule a visit with a psychiatrist (MD/DO). Psychiatrists are medical doctors who may or may not provide talk therapy.',
    );
    expect(Psychiatrists).not.toBeInTheDocument();

    screen.getByText('About Therapists');
    Psychiatrists = screen.queryByText(
      'If you are looking for talk therapy and counseling, talk to a therapist. There are different types, such as psychologists and licensed social workers, marriage and family therapists and counselors. The difference is in their level of training and the problems they specialize in handling.',
    );
    expect(Psychiatrists).not.toBeInTheDocument();

    fireEvent.click(screen.getByText('About Therapists')); //check that body text is visible after clicking
    Psychiatrists = screen.queryByText(
      'If you are looking for talk therapy and counseling, talk to a therapist. There are different types, such as psychologists and licensed social workers, marriage and family therapists and counselors. The difference is in their level of training and the problems they specialize in handling.',
    );
    expect(Psychiatrists).toBeInTheDocument();

    expect(component).toMatchSnapshot();
  });
});
