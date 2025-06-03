'use client';

import CustomDataGrid from '@/app/ihbc/components/grid/CustomDataGrid';
import {
  currentDentalGridConfig,
  CurrentDentalVisionColumns,
  currentVisionGridConfig,
  selectDentalGridConfig,
  SelectDentalVisionColumns,
  selectVisionGridConfig,
} from '@/app/ihbc/components/grid/GridColDefConfig';

import { useBenefitSelectionStore } from '@/app/ihbc/stores/benefitSelectionStore';
import { Card } from '@/components/foundation/Card';
import { Column } from '@/components/foundation/Column';
import { Spacer } from '@/components/foundation/Spacer';
import { TextBox } from '@/components/foundation/TextBox';
import { Title } from '@/components/foundation/Title';

export const DentalVisionPlan = () => {
  const [
    visionPlan,
    dentalPlan,
    currentDentalPlan,
    currentVisionPlan,
    selectedVisionPlan,
    selectedDentalPlan,
    updateDentalPlan,
    updateVisionPlan,
  ] = useBenefitSelectionStore((state) => [
    state.visionPlan,
    state.dentalPlan,
    state.currentDentalPlan,
    state.currentVisionPlan,
    state.selectedVisionPlan,
    state.selectedDentalPlan,
    state.updateDentalPlan,
    state.updateVisionPlan,
  ]);

  return (
    <main className="flex flex-col justify-center items-center page">
      <Column className="app-content app-base-font-color">
        <div className="p-2 bg-primary ">
          <Title className="text-white" text="Dental & Vision Policy Changes" />
        </div>

        <div>
          <Spacer size={32} />
          <TextBox
            className="body-1"
            text="Would you like to add dental and/or vision coverage? You can add coverage for yourself as well as for your family members. Please select the plan(s) you wish to purchase or select Continue to proceed without adding a dental or vision plan."
          />
          <Spacer size={32} />
          <TextBox
            type="title-3"
            className="lg:pr-2 primary-color body-1 text-center"
            text="Current Dental Benefits:"
          />
          <Spacer size={16} />
          <TextBox
            className="body-1 text-center"
            text="To keep your current benefits, select Keep Current Benefits from the below grid."
          />
          <Spacer size={32} />
          <CustomDataGrid
            gridconfig={currentDentalGridConfig}
            columns={CurrentDentalVisionColumns}
            rowdata={currentDentalPlan}
            updateSelectedRow={updateDentalPlan}
            selectedRowId={selectedDentalPlan?.planId}
          />
          <Spacer size={32} />
          <TextBox
            type="title-3"
            className="lg:pr-2 primary-color body-1 text-center"
            text="Select Dental Plan:"
          />
          <Spacer size={32} />
          <CustomDataGrid
            gridconfig={selectDentalGridConfig}
            columns={SelectDentalVisionColumns}
            rowdata={dentalPlan}
            updateSelectedRow={updateDentalPlan}
            selectedRowId={selectedDentalPlan?.planId}
          />
          <Spacer size={32} />
          <TextBox
            type="title-3"
            className="lg:pr-2 primary-color body-1 text-center"
            text="Current Vision Benefits:"
          />
          <Spacer size={16} />
          <TextBox
            className="body-1 text-center"
            text="To keep your current benefits, select Keep Current Benefits from the below grid."
          />
          <Spacer size={32} />
          <CustomDataGrid
            gridconfig={currentVisionGridConfig}
            columns={CurrentDentalVisionColumns}
            rowdata={currentVisionPlan}
            updateSelectedRow={updateVisionPlan}
            selectedRowId={selectedVisionPlan?.planId}
          />
          <Spacer size={32} />
          <TextBox
            type="title-3"
            className="lg:pr-2 primary-color body-1 text-center"
            text="Select Vision Plan:"
          />
          <Spacer size={32} />
          <CustomDataGrid
            gridconfig={selectVisionGridConfig}
            columns={SelectDentalVisionColumns}
            rowdata={visionPlan}
            updateSelectedRow={updateVisionPlan}
            selectedRowId={selectedVisionPlan?.planId}
          />
          <Spacer size={32} />
          <Card
            className={
              'row-span-6 font-normal text-gray-500 secondary-bg-color1-accent p-5 rounded-lg'
            }
            type="info"
          >
            <TextBox
              className="body-1 text-black"
              text="The rates shown above are only estimated rates based upon the information you provided. Approval of coverage and the actual rates will depend on your eligibility and the date your application is submitted."
            />
          </Card>
        </div>
      </Column>
    </main>
  );
};
