export interface OperationModel {
    operationId? : number;
    id?: number;
    name: string;
    allocatedTime: number;
    description: string;
    type: string;
}
export interface OperationTable {
    items: OperationModel[];
    noFiltered: number;
    noTotal: number;
}
