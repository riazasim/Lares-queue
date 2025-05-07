import { BuildingModel } from "./building.model";
import { LocationModel } from "./location.model";
import { PartnerModel } from "./partner.model";
import { ResponseDataItem } from "./response-wrappers.types";
import { StatusListModel } from "./status-list.model";
import { WorkingHoursModel } from "./working-hours.model";

export interface DockModel {
  id?: number;
  name: string;
  status: number;
  startSuspendTime: string;
  endSuspendTime: string;

  partners?: number[];
  workingHour: ResponseDataItem<WorkingHoursModel> | WorkingHoursModel | number;
  location?: ResponseDataItem<LocationModel> | LocationModel | number | null;
  warehouse?: ResponseDataItem<BuildingModel> | BuildingModel | number | null;
  partnerDockRelationships?: PartnerOnlyRelationship[] | number | number[];
  statusListStatus?: ResponseDataItem<StatusListModel> | StatusListModel | number;
}

export interface PartnerOnlyRelationship {
  attributes: {
    id: number;
    partner: ResponseDataItem<PartnerModel>[]
  }
}

export enum DockStatusEnum {
  Active = 1,
  Reserved = 2,
  Service = 3,
  Inactive = 4
}
