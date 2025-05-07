import { LocationModel } from "./location.model";
import { ResponseDataItem } from "./response-wrappers.types";

export interface BuildingModel {
  id?: number;
  name: string;
  firstName: string;
  lastName: string;
  mobile: string;
  email: string;
  location: number | ResponseDataItem<LocationModel> | LocationModel;
}
