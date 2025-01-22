import { IComponent } from '@/components/IComponent';
import { VirtualHealthCareDetails } from '../models/mental_health_care_options_details';
import { HealthCareItem } from './HealthCareItem';

interface VirtualMentalHealthCareSectionProps extends IComponent {
  mentalHealthCareOptions: VirtualHealthCareDetails[];
}

export const VirtualMentalHealthCareSection = ({
  mentalHealthCareOptions,
}: VirtualMentalHealthCareSectionProps) => {
  return (
    <div className="gap-4 flex flex-wrap">
      {mentalHealthCareOptions
        .slice(0, mentalHealthCareOptions.length)
        .map((item) => (
          <HealthCareItem
            key={item.healthCareName}
            className="mb-4"
            itemDataTitle={item.itemDataTitle}
            itemData={item.itemData}
            healthCareInfo={item}
          />
        ))}
    </div>
  );
};
