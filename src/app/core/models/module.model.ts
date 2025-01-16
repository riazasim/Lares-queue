import { OrganizationModel } from "./organization.model";

/* MANAGE TABLE MODELS */

export interface ModuleModel {
    id?: number;
    name: string;
    type: string;
    description: string;
}

export interface UnparsedModuleModel {
    type: string;
    attributes: {
        id?: number;
        name: string;
        type: string;
        description: string;
    }
}

export interface ModuleAttribute {
    id: number;
    name: string;
    columnName: string;
}

export interface ModuleAttributeUpdate {
    tableViewModuleAttributeId: number;
    hideStatus: boolean;
    columnPosition: number;
}

export interface UnparsedModuleAttribute {
    type: string;
    attributes: {
        id: number;
        name: string;
        columnName: string;
    }
}

export interface ModuleAttributeOptions {
    id: number;
    tableViewModule: UnparsedModuleModel;
    tableViewModuleAttribute: UnparsedModuleAttribute;
    hideStatus: boolean;
    columnPosition: number;
    createdAt: Date | string;
    organization: OrganizationModel;
}

