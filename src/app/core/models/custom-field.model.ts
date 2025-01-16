import { OrganizationModel } from "./organization.model";
import { ResponseDataItem } from "./response-wrappers.types";
import { UserModel } from "./user.model";

export interface ResponseCustomFieldModel {
    id?: number;
    label: string;
    name: string;
    type: string;
    format: null;
    module: string;
    required: boolean;
    placeholder: string;
    description: string;
    user?: ResponseDataItem<UserModel> | UserModel;
    organization?: ResponseDataItem<OrganizationModel> | OrganizationModel;
    customFieldLists: ResponseCustomFieldList[] | CustomFieldList[];
}

export interface CustomFieldModel {
    id?: number;
    label: string;
    name: string;
    type: string;
    format: null;
    module: string;
    required: boolean;
    placeholder: string;
    description: string;
    user?: UserModel;
    organization?: OrganizationModel;
    customFieldLists: CustomFieldList[];
}

export interface ResponseCustomFieldList {
    type: 'customFieldList',
    attributes: CustomFieldList
}

export interface CustomFieldList {
    id?: number;
    label: string;
    value: string;
}

export interface CustomFieldData {
    type: "customField",
    attributes: CustomFieldModel | ResponseCustomFieldModel;
}

export interface ResponseCustomField {
    data: {
        type: "list",
        transportData: CustomFieldData[];
        cargoData: CustomFieldData[];
        additionalData : CustomFieldData[];
    }
}
