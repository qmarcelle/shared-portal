'use client';

import { useParams } from 'next/navigation';
import CareTNProgramLanding from './components/CareTNProgramLanding';
import { HealthProgramsResources } from './components/HealthProgramsResources';
import { HealthProgramType } from './models/health_program_type';
import { healthProgramsandResourcesDetails } from './models/health_programs_resources';
import { MyHealthProgramsData } from './models/my_Health_Programs_Data';

export type MyHealthProgramsProps = {
  data: MyHealthProgramsData;
};
const MyHealthPrograms = ({ data }: MyHealthProgramsProps) => {
  const { programName } = useParams<{ programName: string }>();
  const pageType = programName;
  let ComponentToRender;

  function isValidEnumValue<T extends string>(
    enumObj: Record<string, T>,
    value: unknown,
  ): value is T {
    return (
      typeof value === 'string' && Object.values(enumObj).includes(value as T)
    );
  }

  if (isValidEnumValue(HealthProgramType, pageType)) {
    ComponentToRender = (
      <HealthProgramsResources
        sessionData={data.sessionData}
        healthProgramDetails={healthProgramsandResourcesDetails.get(pageType)}
      />
    );
  } else if (pageType === 'careTN') {
    ComponentToRender = (
      <CareTNProgramLanding
        accessCodeData={data.careTNAccessCode}
      ></CareTNProgramLanding>
    );
  }

  return (
    <main className="flex flex-col justify-center items-center page">
      {/* For Displaying Other Health Programs */}
      {ComponentToRender}
    </main>
  );
};

export default MyHealthPrograms;
