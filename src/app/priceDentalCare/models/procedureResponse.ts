// Procedure.ts
export interface Procedure {
  id: number;
  code: string;
  name: string;
  description: string;
}

// ProcedureCategory.ts
export interface ProcedureCategory {
  id: number;
  name: string;
  procedures: Procedure[];
}

// Full response
export interface ProcedureResponse {
  procedureCategories: ProcedureCategory[];
}
