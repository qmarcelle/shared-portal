import { IComponent } from '../../../components/IComponent';
import { HealthCareItem } from '../components/HealthCareItem';
import { VirtualHealthCareDetails } from '../models/mental_health_care_options_details';

interface VirtualMentalHealthCareSectionProps extends IComponent {
  mentalHealthCareOptions: VirtualHealthCareDetails[];
}

export const VirtualMentalHealthCareSection = ({
  mentalHealthCareOptions,
}: VirtualMentalHealthCareSectionProps) => {
  return (
    <div className="gap-4 md:flex sm:inline">
      {mentalHealthCareOptions.slice(0, 2).map((item) => (
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
