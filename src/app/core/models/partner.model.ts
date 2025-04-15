export type PartnerModel = {
    id?: number;
    partnerId?: number;
    name: string;
    status: boolean;
    addrStreet: string;
    addrStreetNumber: string;
    addrCity:string,
    addrCounty: string;
    addrCountry: string;
    addrZipCode: string;
    contactPhone: string;
    contactEmail: string;
    // email: string;
    // phone: string;
    // contactNumber: string;
    // address: string;
    // partnerSpecialStatus: number;
    type: string;
    // blockSidStatus: boolean;
    // partnerDockRelationships?: PartnerDockRelationships[] | DockOnlyRelationship[] | number | number[];
    // docks?: number[];
    // partners?: number[];
}

export interface PartnerTable {
  items: PartnerModel[];
  noFiltered: number;
  noTotal: number;
}

// export type PartnerDockRelationships = {
//     id: number;
//     partners: ResponseDataItem<PartnerModel>[];
//     dock: ResponseDataItem<DockModel>[];
//     docks: ResponseDataItem<DockModel>[];
// }

// export type DockOnlyRelationship = {
//     attributes: {
//       id: number;
//       dock: ResponseDataItem<DockModel>[]
//     }
//   }
