import { BuildingModel } from "./building.model";
import { DockModel } from "./dock.model";
import { LocationModel } from "./location.model";
import { OperationModel } from "./operation.model";
import { PartnerModel } from "./partner.model";
import { ResponseDataItem } from "./response-wrappers.types";
import { StatusListModel } from "./status-list.model";
import { WorkingHoursModel } from "./working-hours.model";

export interface SchedulingModel {
    id?: number;
    convoyType:string;
    eta:string;
    locationPort:string;
    zone:string;
    departurePort:string;
    arrivalPort:string;
    pilotCompany:string;
    length:number;
    width:number;
    maxDraft:number;
    aerialGuage:number;
    capacityMax:number;
    typeOfLock:string;
    ship:string;
    shipType:string;
    pavilion:string;
    enginePower:string;
    loa:string;
    navigationType:string;
    manevra:string;
    agent:string;
    shipOwner:string;
    purpose:string;
    trafficType:string;
    cargo:string;
    unitNo:string;
    portOfOrigin:string;
    observation:string;

    schedulingDate: string | Date;
    operationType: string;
    auto: string;
    timeSlot: string;
    customerId: number;
    customerName: string;
    customer: ResponseDataItem<PartnerModel> | PartnerModel | number;
    destination: string;
    loadingAddress: string;
    truckLicensePlateFront: string;
    truckLicensePlateBack: string;
    driverName: string;
    driverId: string;
    sId?: number;
    phoneNumber: string;
    phoneRegionCode: string;
    customFieldTransportData: SchedulingCustomField[];
    customFieldCargoData: SchedulingCustomField[];
    customFieldAdditionalData: SchedulingCustomField[];
    products: ResponseDataItem<SchedulingProduct>[] | SchedulingProduct[];
    operator: string;
    clientInstruction: string;
    operatorMention: string;
    documents: File[];
    oldDocuments: number[];
    location: ResponseDataItem<LocationModel> | LocationModel | number;
    warehouse:  ResponseDataItem<BuildingModel> | BuildingModel | number;
    dock: DockModel | ResponseDataItem<DockModel> | number;
    operation: ResponseDataItem<OperationModel> | OperationModel | number;
    statusListStatus: ResponseDataItem<StatusListModel> | StatusListModel | number;

    shipmentLogs?: ResponseDataItem<ShipmentLogsModel>[] | ShipmentLogsModel[];
}

export interface SchedulingPreviewModel extends SchedulingModel {
    dockName: string;
    dockId: number;
    status: string;
    statusColor: string;
    goodsNoticeNr: string;
    createdBy: string;
    driverName: string;
    goodsName: string;
    goodsBuyer: string;
    goodsSupplier: string;
    operationType: string;
    sidType: string;
}

export interface ComvexPlanningList {
    id: number;
    sId: number;
    truckLicensePlateFront: string;
    truckLicensePlateBack: string;
    dockName: string;
    driverId: string;
    phoneNumber: string;
    phoneRegionCode: string;
    dockId: number;
    status: string;
    statusColor: string;
    goodsNoticeNr: string;

    schedulingDate: string;
    firstName: string;
    lastName: string;
    identityDocumentNumber: string;
    quantityBrut: number;
    quantityNet: number;
    quantityEmptyContainer: number;
    loadUnloadingPlace: string;
    statusUpdatedAt: string;

    goodsName: string;
    goodsBuyer: string;
    goodsSupplier: string;
    country: string;
    harvestYear: string;
    timeSlot: string;
}

export interface SchedulingCustomField {
    customField: number;
    name: string;
    value: string | string[] | number;
}

export interface SchedulingProduct {
    name: string;
    size: string;
    brand: string;
    batch: string;
    amount: number;
    weight: number;

    planningProductId?: number;
    productCode?: string;
    productId?: number;
    productName?: string;
}

export interface SchedulingDockModel {
    id: number;
    name: string;
    status: number;
    startSuspendTime: string;
    endSuspendTime: string;
    workingHour: null | ResponseDataItem<WorkingHoursModel> | WorkingHoursModel;
    dockToPlannings: ResponseDataItem<DockToPlanningModel>[] | DockToPlanningModel[];
    statusListStatus: null | ResponseDataItem<StatusListModel> | StatusListModel;
}

export interface DockToPlanningModel {
    hour: string;
    usedAllocatedTime: string;
    remainingTime: number;
    assigningDate: string;
}

export interface ShipmentLogsModel {
    shipmentLogId: number;
    operationType: string;
    sId: string;
    message: string;
    createdAt: string;
    userFullName: string;
}

export interface SchedulingLogModel {
    id?: number;
    schedulingDate: string | Date;
    operationType: string;
    auto: string;
    timeSlot: string;
    customerId: number;
    customerName: string;
    customer: ResponseDataItem<PartnerModel> | PartnerModel | number;
    destination: string;
    loadingAddress: string;
    truckLicensePlateFront: string;
    truckLicensePlateBack: string;
    driverName: string;
    driverId: string;
    sId?: number;
    phoneNumber: string;
    phoneRegionCode: string;
    customFieldTransportData: SchedulingCustomField[];
    customFieldCargoData: SchedulingCustomField[];
    customFieldAdditionalData: SchedulingCustomField[];
    products: ResponseDataItem<SchedulingProduct>[] | SchedulingProduct[];
    operator: string;
    clientInstruction: string;
    operatorMention: string;
    documents: ResponseDataItem<DocumentObject>[] | DocumentObject[];
    oldDocuments: number[];
    location: ResponseDataItem<LocationModel> | LocationModel | number;
    warehouse:  ResponseDataItem<BuildingModel> | BuildingModel | number;
    dock: DockModel | ResponseDataItem<DockModel> | number;
    operation: ResponseDataItem<OperationModel> | OperationModel | number;
    statusListStatus: ResponseDataItem<StatusListModel> | StatusListModel | number;

    shipmentLogs?: ResponseDataItem<ShipmentLogsModel>[] | ShipmentLogsModel[];
}

export type DocumentObject = {
    document: string;
    id: number;
}
