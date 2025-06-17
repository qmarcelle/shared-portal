'use client';
import CustomDataGrid from '@/app/ihbc/components/grid/CustomDataGrid';
import {
  CurrentBenefitGridColumns,
  CurrentBenefitSelectPlanGridColumns,
  currentMedicalConfig,
  selectMedicalConfig,
} from '@/app/ihbc/components/grid/GridColDefConfig';
import { Product } from '@/app/ihbc/models/Product';
import { useBenefitSelectionStore } from '@/app/ihbc/stores/benefitSelectionStore';
import { Card } from '@/components/foundation/Card';
import { Column } from '@/components/foundation/Column';
import { Row } from '@/components/foundation/Row';
import { Spacer } from '@/components/foundation/Spacer';
import { TextBox } from '@/components/foundation/TextBox';
import { TextField } from '@/components/foundation/TextField';
import { Title } from '@/components/foundation/Title';
import { useEffect, useState } from 'react';

export type MedicalPlanDetailsProps = {
  userPlan: Product[];
  availablePlan: Product[];
};
export const MedicalPlan = () => {
  const [medicalPlan, plans, selectedMedicalPlan, updateMedicalPlan] =
    useBenefitSelectionStore((state) => [
      state.medicalPlan,
      state.plans,
      state.selectedMedicalPlan,
      state.updateMedicalPlan,
    ]);
  const [filteredDataForMedicalPlan, setFilteredDataForMedicalPlan] =
    useState(medicalPlan);

  function updateSearch(value: string) {
    const updatedSearch = searchFilter(value);
  }

  function searchFilter(val: string) {
    console.log('search filter');
    const filtered = medicalPlan.filter((obj) =>
      Object.values(obj).some(
        (value) =>
          typeof value === 'string' &&
          value.toLowerCase().includes(val.toLowerCase()),
      ),
    );
    setFilteredDataForMedicalPlan(filtered);
  }

  useEffect(() => {
    setFilteredDataForMedicalPlan(medicalPlan);
  }, [medicalPlan]);

  return (
    <main className="flex flex-col justify-center items-center page">
      <Column className="app-content app-base-font-color">
        <div>
          <div className="p-2 bg-primary ">
            <Title className="text-white" text="Medical Plan Changes" />
          </div>

          <div>
            <Spacer size={32} />
            <Card
              backgroundColor={'#d2dae0'}
              className={'row-span-6 font-normal{ p-5 rounded-lg'}
              type="info"
            >
              <TextBox
                className="body-1"
                text="Below are the highlights of the plans that you are able to purchase. To view more detailed benefits, you can click on the Plan Name for the plan you wish to view."
              />
            </Card>
          </div>
          <Spacer size={32} />
          <TextBox
            type="title-3"
            className="flex lg:pr-2 primary-color body-1"
            text="Current Benefits:"
          />
          <Spacer size={32} />
          <Card
            className={
              'row-span-6 font-normal text-black-500 secondary-bg-color1-accent p-5 rounded-lg'
            }
            type="info"
          >
            <TextBox
              className="body-1"
              text="To keep your current benefits, select Keep Current Benefits from the below grid."
            />
          </Card>
          <Spacer size={32} />
          {/* user plan */}
          <CustomDataGrid
            gridconfig={currentMedicalConfig}
            columns={CurrentBenefitGridColumns}
            rowdata={plans}
            updateSelectedRow={updateMedicalPlan}
            selectedRowId={selectedMedicalPlan?.planId}
          ></CustomDataGrid>
          <Spacer size={32} />
          <TextBox
            type="title-3"
            className="flex lg:pr-2 primary-color body-1"
            text="Select Your Plan:"
          />
          <Spacer size={32} />
          <Row className="float-right m-3">
            <TextField
              type="text"
              label="Search"
              maxWidth={550}
              valueCallback={updateSearch}
            ></TextField>
          </Row>
          <Spacer size={80} />
          <Row>
            {/* available plan */}
            <CustomDataGrid
              gridconfig={selectMedicalConfig}
              columns={CurrentBenefitSelectPlanGridColumns}
              rowdata={filteredDataForMedicalPlan}
              updateSelectedRow={updateMedicalPlan}
              selectedRowId={selectedMedicalPlan?.planId}
            ></CustomDataGrid>
          </Row>
          <Spacer size={32} />
        </div>
      </Column>
    </main>
  );
};
