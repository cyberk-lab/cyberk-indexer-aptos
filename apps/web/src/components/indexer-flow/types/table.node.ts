export type TableColumn = {
  name: string;
  type: string;
  displayType: string;
  // kind: string;
  isPrimaryKey?: boolean;
}
export interface TableData {
  name: string;
  columns: TableColumn[];
}