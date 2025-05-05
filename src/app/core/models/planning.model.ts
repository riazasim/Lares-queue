import { ResponseDataItem } from "./response-wrappers.types";

export interface UpdatePlanningDock {
    assigningDate: string;
    hour: string;
    planning: number;
    dock: number;
    statusListStatus: number;
}

export interface convoyModel {
    planningConvoyId?: number;
    id?: number;
    company: string;
    navigationType: string;
    ship: string;
    status: string;
    shipType: string;
    pavilion: string;
    enginePower: number;
    lengthOverall: number;
    width: number;
    maxDraft: number;
    maxQuantity: number;
    agent?: string;
    maneuvering?: string;
    shipowner: string;
    purpose: string;
    operator: string;
    trafficType: string;
    operatonType: string;
    cargo: string;
    quantity: number;
    unitNo: string;
    originPort: string;
    destination: string;
    observation: string;
    additionalOperator: string;
    clientComments: string;
    arrivalGauge: number;
    lockType: string;
    products: "";
    operatorComments: string;
    planningConvoyDocuments: File[];
    documents: any[];
    // documents: ResponseDataItem<DocumentObject>[] | DocumentObject[];
    oldDocuments: string;
}

export interface PlanningModel {
    id?: number | undefined;
    planningId?: number;
    sId?: number;
    planning: any;
    relativeTimeArrival?: string;
    shipmentStatus?: string;
    estimatedTimeArrival: string;
    routingDetail: {
        convoyType: string;
        estimatedTimeArrival: string;
        locationPort: string;
        departureZone: string;
        arrivalZone: string;
        departurePort: string;
        arrivalPort: string;
        company: string;
        pilotCompany: string;
        length: number;
        width: number;
        maxDraft: number;
        arrivalGauge: number;
        maxCapacity: number;
        lockType: string;
        ridCoordinates: string;
    };
    pointDetail: PointModal[];
    convoyDetail: convoyModel[];
    documents: any[];
}

export interface PointModal {
    pointType: string;
    stationType: string;
    station: string;
}

export interface PlanningDetailModel {
    planningConvoys: convoyModel[];
    id?: number;
    planningId?: number;
    sId?: number;
    rId?: string;
    relativeTimeArrival?: string;
    shipmentStatus?: string;
    convoyType: string;
    estimatedTimeArrival: string;
    locationPort: string;
    departureZone: string;
    arrivalZone: string;
    departurePort: string;
    arrivalPort: number;
    company: number;
    pilotCompany: string;
    length: number;
    width: number;
    maxDraft: number;
    arrivalGauge: number;
    maxCapacity: number;
    lockType: string;
    ridCoordinates: string;
}


export interface PlanningTable {
    items: PlanningModel[];
    noFiltered: number;
    noTotal: number;
}
export type DocumentObject = {
    document: string;
    id: number;
}
