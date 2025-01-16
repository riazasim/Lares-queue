import { ResponseDataItem } from "./response-wrappers.types";

export interface WorkingHoursModel {
    id?: number;
    name: string;
    startTime: string;
    endTime: string;
    defaultStatus?: boolean;
    nonWorkingHours: BreakModel[] | ResponseDataItem<BreakModel>[];
    weekDays?: number[];
    locations?: number[];
}

export interface NonWorkingHoursModel {
    id?: number;
    name: string;
    type?: string;
    duration: string;
}

export interface BreakModel {
    id?: number;
    nonWorkingHour: number | ResponseDataItem<NonWorkingHoursModel> | NonWorkingHoursModel;
    startWithTime?: string;
    startTime?: string;
    duration?: string;
}
