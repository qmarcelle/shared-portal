import css from 'styled-jsx/css';
import { IColumnHeader, IGridConfig } from '../../models/GridConfigModels';
import { RadioButtonFormatter } from './RadioButtonFormatter';
const cellHeaderClass = css`
  margin-top: 1px;
  margin-left: 1px;
  margin-right: 1px;
  margin-bottom: 1px;
`;

export const currentDentalGridConfig: IGridConfig = {
  gridName: 'DentalGrid',
  rowSize: 1.5,
  pagination: false,
  rowsPerPage: 10,
};

export const selectDentalGridConfig: IGridConfig = {
  gridName: 'DentalGrid',
  rowSize: 3,
  pagination: false,
  rowsPerPage: 10,
};

export const currentVisionGridConfig: IGridConfig = {
  gridName: 'VisionGrid',
  rowSize: 1.5,
  pagination: false,
  rowsPerPage: 10,
};

export const selectVisionGridConfig: IGridConfig = {
  gridName: 'VisionGrid',
  rowSize: 3,
  pagination: false,
  rowsPerPage: 10,
};

export const currentMedicalConfig: IGridConfig = {
  gridName: 'MedicalPlan',
  rowSize: 6.5,
  pagination: false,
  rowsPerPage: 4,
};
export const selectMedicalConfig: IGridConfig = {
  gridName: 'MedicalPlan',
  rowSize: 6.5,
  pagination: true,
  rowsPerPage: 4,
};

export const CurrentDentalVisionColumns: IColumnHeader[] = [
  {
    key: 'keepcurrentbenefits',
    name: 'Keep Current Benefits',
    formatter: RadioButtonFormatter,
    sortable: true,
    resizable: false,
    columnMinWidth: 10,
    width: 300,
    headerCellClass: 'm-px bg-primary text-white text-wrap',
    cellClass: 'm-px',
  },
  {
    key: 'planName',
    name: 'Plan Name (View Plan Details)',
    sortable: true,
    columnMinWidth: 10,
    width: 692,
    resizable: false,
    headerCellClass: 'm-px bg-primary text-white text-wrap',
    cellClass: 'm-px',
  },
];

export const SelectDentalVisionColumns: IColumnHeader[] = [
  {
    key: 'chooseplan',
    name: 'Choose Plan',
    formatter: RadioButtonFormatter,
    sortable: true,
    resizable: false,
    columnMinWidth: 10,
    width: 300,
    headerCellClass: 'm-px bg-primary text-white text-wrap',
    cellClass: 'm-px',
  },
  {
    key: 'planName',
    name: 'Plan Name (View Plan Details)',
    resizable: false,
    sortable: true,
    columnMinWidth: 10,
    width: 490,
    headerCellClass: 'm-px bg-primary text-white text-wrap',
    cellClass: 'm-px text-wrap text-sky-600',
  },
  {
    key: 'rate',
    name: 'Rate Per Month',
    resizable: false,
    sortable: true,
    columnMinWidth: 10,
    width: 202,
    headerCellClass: 'm-px bg-primary text-white text-wrap',
    cellClass: 'm-px text-wrap text-orange-500 font-bold',
  },
];

export const CurrentBenefitGridColumns: IColumnHeader[] = [
  {
    key: 'keepcurrentbenefits',
    name: 'Keep Current Benefits',
    formatter: RadioButtonFormatter,
    sortable: true,
    resizable: false,
    columnMinWidth: 10,
    headerCellClass: 'm-px bg-primary text-white text-wrap',
    cellClass: 'm-px',
    width: 70,
  },
  {
    key: 'planName',
    name: 'Plan Name (View Plan Details)',
    resizable: false,
    sortable: true,
    columnMinWidth: 10,
    headerCellClass: 'm-px bg-primary text-white text-wrap',
    width: 130,
    cellClass: 'm-px text-wrap text-sky-600',
  },
  {
    key: 'rate',
    name: 'Rate Per Month',
    resizable: false,
    sortable: true,
    columnMinWidth: 10,
    headerCellClass: 'm-px bg-primary text-white text-wrap',
    width: 80,
    cellClass: 'm-px text-wrap text-orange-500 font-bold',
  },
  {
    key: 'metalLevel',
    name: 'Metal Level',
    resizable: false,
    sortable: true,
    columnMinWidth: 10,
    headerCellClass: 'm-px bg-primary text-white text-wrap',
    width: 67,
    cellClass: 'm-px text-wrap',
  },
  {
    key: 'network',
    name: 'Network',
    resizable: false,
    sortable: true,
    columnMinWidth: 10,
    headerCellClass: 'm-px bg-primary text-white text-wrap',
    width: 70,
    cellClass: 'm-px text-wrap',
  },
  {
    key: 'deductible',
    name: 'Deductible',
    resizable: false,
    sortable: true,
    columnMinWidth: 10,
    headerCellClass: 'm-px bg-primary text-white text-wrap',
    width: 150,
    cellClass: 'm-px text-wrap',
  },
  {
    key: 'oopMax',
    name: 'Out Of Pocket Max',
    resizable: false,
    sortable: true,
    columnMinWidth: 10,
    headerCellClass: 'm-px bg-primary text-white text-wrap',
    width: 150,
    cellClass: 'm-px text-wrap',
  },
  {
    key: 'offVisitCopay',
    name: 'Office Visit Copay',
    resizable: false,
    sortable: true,
    columnMinWidth: 10,
    headerCellClass: 'm-px bg-primary text-white text-wrap',
    width: 85,
    cellClass: 'm-px text-wrap',
  },
  {
    key: 'specialistCopay',
    name: 'Specialist Copay',
    resizable: false,
    sortable: true,
    columnMinWidth: 10,
    headerCellClass: 'm-px bg-primary text-white text-wrap',
    width: 90,
    cellClass: 'm-px text-wrap',
  },
  {
    key: 'prescriptioncoverage',
    name: 'RX',
    resizable: false,
    sortable: true,
    columnMinWidth: 10,
    headerCellClass: 'm-px bg-primary text-white text-wrap',
    width: 100,
    cellClass: 'm-px text-wrap',
  },
];

export const CurrentBenefitSelectPlanGridColumns: IColumnHeader[] = [
  {
    key: 'chooseplan',
    name: 'Choose Plan',
    sortable: true,
    formatter: RadioButtonFormatter,
    resizable: false,
    columnMinWidth: 10,
    headerCellClass: 'm-px bg-primary text-white text-wrap',
    width: 70,
    cellClass: 'm-px',
  },
  {
    key: 'planName',
    name: 'Plan Name (View Plan Details)',
    resizable: false,
    sortable: true,
    columnMinWidth: 10,
    headerCellClass: 'm-px bg-primary text-white text-wrap',
    width: 130,
    cellClass: 'm-px text-wrap text-sky-600',
  },
  {
    key: 'rate',
    name: 'Rate Per Month',
    resizable: false,
    sortable: true,
    columnMinWidth: 10,
    headerCellClass: 'm-px bg-primary text-white text-wrap',
    width: 80,
    cellClass: 'm-px text-wrap text-orange-500 font-bold',
  },
  {
    key: 'metalLevel',
    name: 'Metal level',
    resizable: false,
    sortable: true,
    columnMinWidth: 10,
    headerCellClass: 'm-px bg-primary text-white text-wrap',
    width: 67,
    cellClass: 'm-px text-wrap',
  },
  {
    key: 'network',
    name: 'Network',
    resizable: false,
    sortable: true,
    columnMinWidth: 10,
    headerCellClass: 'm-px bg-primary text-white text-wrap',
    width: 70,
    cellClass: 'm-px text-wrap',
  },
  {
    key: 'deductible',
    name: 'Deductible',
    resizable: false,
    sortable: true,
    columnMinWidth: 10,
    headerCellClass: 'm-px bg-primary text-white text-wrap',
    width: 145,
    cellClass: 'm-px text-wrap',
  },
  {
    key: 'oopMax',
    name: 'Out Of Pocket Max',
    resizable: false,
    sortable: true,
    columnMinWidth: 10,
    headerCellClass: 'm-px bg-primary text-white text-wrap',
    width: 145,
    cellClass: 'm-px text-wrap',
  },
  {
    key: 'offVisitCopay',
    name: 'Office Visit Copay',
    resizable: false,
    sortable: true,
    columnMinWidth: 10,
    headerCellClass: 'm-px bg-primary text-white text-wrap',
    width: 85,
    cellClass: 'm-px text-wrap',
  },
  {
    key: 'specialistCopay',
    name: 'Specialist Copay',
    resizable: false,
    sortable: true,
    columnMinWidth: 10,
    headerCellClass: 'm-px bg-primary text-white text-wrap',
    width: 90,
    cellClass: 'm-px text-wrap',
  },
  {
    key: 'prescriptioncoverage',
    name: 'RX',
    resizable: false,
    sortable: true,
    columnMinWidth: 10,
    headerCellClass: 'm-px bg-primary text-white text-wrap',
    width: 100,
    cellClass: 'm-px text-wrap',
  },
];
