import {ResponseDataItem} from "./response-wrappers.types";
import {BuildingModel} from "./building.model";

export enum VehicleTypesEnum {
    'Truck',
    'Trailer'
}

export type VehicleModel = {
    vehicleId?: number;
    licensePlate: string;
    type: VehicleTypesEnum;
    status: boolean;
    loadingCapacity?: string;
    //loading_capacities?: [];
}

export interface VehicleTable {
    items: VehicleModel[];
    noFiltered: number;
    noTotal: number;
}
