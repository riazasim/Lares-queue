import { ResponseDataItem } from "./response-wrappers.types";

export interface WeekDayModel {
    id: number;
    name: string;
    type: string;
    description: string;

    weekDay?: ResponseDataItem<WeekDayModel> | WeekDayModel;
    weekDays?: ResponseDataItem<WeekDayModel> | WeekDayModel;
}
