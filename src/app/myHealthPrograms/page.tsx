'use client';
import { HealthProgramsResources } from './components/HealthProgramsResources';
import { HealthProgramType } from './models/health_program_type';
import { healthProgramsandResourcesDetails } from './models/health_programs_resources';

const MyHealthPrograms = () => {
  return (
    <main className="flex flex-col justify-center items-center page">
      <HealthProgramsResources
        healthProgramDetails={healthProgramsandResourcesDetails.get(
          HealthProgramType.QuestSelect,
        )}
      />
    </main>
  );
};

export default MyHealthPrograms;
