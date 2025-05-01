import { render, screen } from '@testing-library/react';
import WellnessCenterPage from '@/app/(common)/myhealth/healthprograms/wellness-center/page';
import HealthLibraryPage from '@/app/(common)/myhealth/healthprograms/health-library/page';
import RewardsPage from '@/app/(common)/myhealth/healthprograms/rewards/page';

describe('MyHealth Programs Pages', () => {
  describe('Wellness Center Page', () => {
    it('renders wellness center title and description', () => {
      render(<WellnessCenterPage />);
      
      expect(screen.getByText('Member Wellness Center')).toBeInTheDocument();
      expect(
        screen.getByText(/Take a free personal health assessment/i)
      ).toBeInTheDocument();
    });

    it('renders visit wellness center link', () => {
      render(<WellnessCenterPage />);
      
      expect(screen.getByText('Visit Member Wellness Center')).toBeInTheDocument();
    });
  });

  describe('Health Library Page', () => {
    it('renders health library title and description', () => {
      render(<HealthLibraryPage />);
      
      expect(screen.getByText('Health Library')).toBeInTheDocument();
      expect(
        screen.getByText(/From checking symptoms to answering your health questions/i)
      ).toBeInTheDocument();
    });

    it('renders visit health library link', () => {
      render(<HealthLibraryPage />);
      
      expect(screen.getByText('Visit The Health Library')).toBeInTheDocument();
    });
  });

  describe('Rewards Page', () => {
    it('renders rewards title', () => {
      render(<RewardsPage />);
      
      expect(screen.getByText('Wellness Rewards')).toBeInTheDocument();
    });

    it('renders error message when no rewards data', () => {
      render(<RewardsPage />);
      
      expect(
        screen.getByText(/There was a problem loading your information/i)
      ).toBeInTheDocument();
    });
  });
});