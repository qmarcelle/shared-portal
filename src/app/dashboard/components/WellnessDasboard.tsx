import { MyHealthOffsiteLinkCard } from '@/app/myHealth/components/MyHealthOffsiteLinkCard';
import { fitLogo, healthAssessmentIcon } from '@/components/foundation/Icons';

export const WellnessDashboard = () => (
  <div className="flex flex-col app-content app-base-font-color">
    <section>
      <MyHealthOffsiteLinkCard
        icon={healthAssessmentIcon}
        title="Member Wellness Center"
        description="Take a free personal health assessment, track your diet and exercise, sync your fitness apps to earn wellness points and more—all in one secure place."
        url=""
      />
    </section>
    <section>
      <MyHealthOffsiteLinkCard
        icon={fitLogo}
        title="Member Discount"
        description="Want access to new healthy living discounts every week? Find savings on nutrition programs, fitness accessories, medical supplies and services like hearing aids and LASIK eye surgery."
        url=""
      />
    </section>
  </div>
);
