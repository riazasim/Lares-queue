export type StationModel = {
    id?: number;
    stationId?: number;
    name: string;
    type:string;
    addrCity:string;
    addrCountry:string;
    addrCounty:string;
    addrZipCode:string;
    addrCoordinates:string;
    contactFirstName:string;
    contactLastName:string;
    contactEmail:string;
    contactPhone:string;
    contactPhoneRegionCode:string;
    comments:string;
    imgPreview: File;
}

export interface StationTable {
    items: StationModel[];
    noFiltered: number;
    noTotal: number;
}
