export interface StatusListModel {
  id: number;
  statusListStatusId: number;
  name: string;
  type: string;
  description: string;
  color: string;
  position: number;
}

export enum StatusTypeEnum {
  UNKNOWN = 0,
  TIMESLOT = 1,
  SID = 2,
  GOODS = 3,
}
export interface StatusListTable {
    items: StatusListModel[];
    noFiltered: number;
    noTotal: number;
}
