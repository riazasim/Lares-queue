import { BuildingModel } from "./building.model";
import { LocationModel } from "./location.model";
import { ResponseDataItem } from "./response-wrappers.types";

export interface ProductModel {
    id?: number;
    name: string;
    productCode: string;
    size: string;
    brand: string;
    batch: string;
    amount: number;
    weight: number;
    locations: ResponseDataItem<LocationModel>[] | LocationModel[] | number[];
}

export interface WarehouseAvailabilityModel {
    locationId: number;
    warehouses: number[];
}

export interface WarehouseAvailablityResponse {
    id: number;
    name: string;
    warehouses: ResponseDataItem<BuildingModel>[] | BuildingModel[] | number[];
}
