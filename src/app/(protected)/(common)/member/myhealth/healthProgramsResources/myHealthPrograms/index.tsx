'use client';

import CareTNProgramLanding from './components/CareTNProgramLanding';
// import { HealthProgramsResources } from './components/HealthProgramsResources';
// import { HealthProgramType } from './models/health_program_type';
// import { healthProgramsandResourcesDetails } from './models/health_programs_resources';
import { MyHealthProgramsData } from './models/my_Health_Programs_Data';

export type MyHealthProgramsProps = {
  data: MyHealthProgramsData;
};
const MyHealthPrograms = ({ data }: MyHealthProgramsProps) => {
  return (
    <main className="flex flex-col justify-center items-center page">
      {/* For Displaying Other Health Programs */}
      {/* <HealthProgramsResources
        sessionData={data.sessionData}
        healthProgramDetails={healthProgramsandResourcesDetails.get(
          HealthProgramType.HingeHealth,
        )}
      /> */}
      <CareTNProgramLanding
        accessCodeData={data.careTNAccessCode}
      ></CareTNProgramLanding>
    </main>
  );
};

export default MyHealthPrograms;
