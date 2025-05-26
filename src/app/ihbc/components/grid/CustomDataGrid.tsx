import { InnerPagination } from '@/components/foundation/Pagination/InnerPagination';
import { useEffect, useState } from 'react';
import DataGrid from 'react-data-grid';
import 'react-data-grid/lib/styles.css';
import { IColumnHeader, IGridConfig } from '../../models/GridConfigModels';
import { GridEnum } from './GridEnum';
import { RadioButtonFormatter } from './RadioButtonFormatter';

interface CustomDataGridProps {
  gridconfig: IGridConfig;
  columns: IColumnHeader[];
  rowdata: any[];
  updateSelectedRow: (value: any) => void;
  selectedRowId: any;
}

function rowKeyGetter(rowdata: any) {
  return rowdata.id;
}
function rowClass(rowdata: any, rowIdx: number) {
  return rowIdx % 2 === 0 ? 'odd' : 'even';
}

const rowHeight = (gridconfig: IGridConfig) => {
  if (gridconfig?.gridName == 'MedicalPlan') {
    return 70;
  } else {
    return 30;
  }
};

const rowDisplayCount = (rowcount: number, gridconfig: IGridConfig) => {
  switch (gridconfig?.gridName) {
    case GridEnum.MedicalPlan:
      //rowcount is the number of rows
      //15.3 is my row size
      //15 is the necessary space to show the first row
      //650 is my table max size
      return Math.min(rowcount * gridconfig?.rowSize + 15, 650) + 'vh';

    default:
      return Math.min(rowcount * gridconfig?.rowSize + 8, 80) + 'vh';
  }
};

const CustomDataGrid = ({
  gridconfig,
  columns,
  rowdata,
  updateSelectedRow,
  selectedRowId,
}: CustomDataGridProps) => {
  const [rows, setRows] = useState(rowdata);
  const [selectedRow, setSelectedRow] = useState(null);
  const [pagination, setPagination] = useState(gridconfig.pagination);

  useEffect(() => {
    setRows(rowdata);
    console.log('selectedRowId', selectedRowId);
    setSelectedRow(selectedRowId!);
  }, [rowdata, selectedRowId]);

  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = gridconfig.rowsPerPage; // Number of items per page

  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const paginatedRows = rows.slice(startIndex, endIndex); // Assuming your data is in a variable called 'rows'
  const totalPages = Math.ceil(rows.length / pageSize);

  const handlePageChange = (newPage: any) => {
    setCurrentPage(newPage);
  };

  const updatedColumns = columns.map((col) => {
    console.log('click', col.key);
    if (col.key === 'chooseplan' || col.key === 'keepcurrentbenefits') {
      console.log('here', col.key);
      return {
        ...col,
        renderCell: ({ row }: any) => (
          <RadioButtonFormatter
            value={row.planId}
            handleRadioChange={() => updateSelectedRow(row)}
            isSelected={row.planId == selectedRow}
          />
        ),
      };
    }
    return col;
  });
  //In the RadioButtonRenderer component , pass the handleChange function and the row ID

  let rowcount = rowdata.length;
  const dynamicHeight = rowDisplayCount(rowcount, gridconfig);
  return (
    <div>
      <DataGrid
        style={{ height: dynamicHeight, backgroundColor: 'lightgrey' }}
        columns={updatedColumns}
        rows={pagination ? paginatedRows : rows}
        onRowsChange={setRows}
        rowKeyGetter={rowKeyGetter}
        rowClass={rowClass}
        rowHeight={rowHeight(gridconfig)}
        defaultColumnOptions={{
          sortable: true,
          resizable: false,
        }}
        className="fill-grid"
      />
      {pagination && (
        <InnerPagination
          className="pagination"
          currentPage={currentPage}
          totalCount={rowcount ?? 10}
          pageSize={pageSize}
          onPageChange={(page: any) => handlePageChange(page)}
        />
      )}
    </div>
  );
};

export default CustomDataGrid;
