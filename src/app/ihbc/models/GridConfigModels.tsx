export interface IColumnHeaders {
  ColumnHeaders: IColumnHeader[];
}

export interface IColumnHeader {
  key: string;
  name: string;
  frozen?: boolean;
  sortable: boolean;
  columnMinWidth: number;
  headerAlign?: string;
  resizable?: boolean;
  style?: any;
  width?: number;
  cellClass?: any;
  headerCellClass?: any;
  formatter?: any;
  renderCell?: any;
}

export interface IRowsDatas {
  row: Record<string, unknown>;
}

export interface IGridConfig {
  gridName: string;
  rowSize: number;
  pagination: boolean;
  rowsPerPage: number;
}
