import { ResponseDataItem } from "./response-wrappers.types";

export interface CreateUserRoleModuleModel {
    moduleId: number;
    roles: string[];
}

export interface UserRoleModule {
    id: number;
    name: string;
    roles: string[]
}

export interface UserRoleList {
    id: number;
    modules?: ResponseDataItem<UserRoleModule> | UserRoleModule;
    user?: string;
}
