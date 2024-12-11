'use client';
import CareTNProgramLanding from './components/CareTNProgramLanding';

export type MyHealthProgramsProps = {
  data: string;
};
const MyHealthPrograms = ({ data }: MyHealthProgramsProps) => {
  return (
    <main className="flex flex-col justify-center items-center page">
      {/* For Displaying Other Health Programs */}
      {/* <HealthProgramsResources
        healthProgramDetails={healthProgramsandResourcesDetails.get(
          HealthProgramType.TeladocHealthDiabetesPrevention,
        )}
      /> */}
      <CareTNProgramLanding accessCodeData={data}></CareTNProgramLanding>
    </main>
  );
};

export default MyHealthPrograms;
