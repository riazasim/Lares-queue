import { BuildingModel } from "./building.model";
import { ResponseDataItem } from "./response-wrappers.types";
import {CustomFieldModel} from "./custom-field.model";
import {VehicleModel} from "./vehicle.model";

export type LocationModel = {
    id?: number;
    locationId?: number;
    name: string;
    locationType: string;
    addrCoordinates: string;
    addrStreet: string;
    addrNumber: string;
    addrCity: string;
    addrCountry: string;
    addrCounty: string;
    addrZipCode: string;
    addrTimezone:string;
    contactFirstName: string;
    contactLastName: string;
    contactPhone: string;
    contactPhoneRegionCode:string;
    contactEmail: string;
    comments?:string;
    imgPreview: File;

   // locations?: ResponseDataItem<LocationModel> | LocationModel;
   warehouses?: ResponseDataItem<BuildingModel>[] | BuildingModel[] | number[];
   // customFields?: ResponseDataItem<CustomFieldModel>[] | CustomFieldModel;
}

export interface LocationTable {
    items: LocationModel[];
    noFiltered: number;
    noTotal: number;
}

export interface CountryModel {
    name: string;
    code: string;
    dialCode: string;
    mask: string;
}
