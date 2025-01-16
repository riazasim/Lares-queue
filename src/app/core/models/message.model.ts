import { TemplateQuery } from './template-query.model';
import {VehicleModel} from "./vehicle.model";

export interface MessageModel {
  id?: number;
  name: string;
  message: string;
  tags: string[];
  requiresResponseBit: boolean;
  automationBit: AutomationTypeEnum;
  automationDate: string;
  messageAutomationEvent: string;
  repeatOption: number;
  waitingPeriod: number,
  whereQuery: TemplateQuery[] | string,
}

/**
 * Based on automationBit field
 * 0 - no automation
 * 1 - Time based
 * 2 - Action based/condition based
 */
export enum AutomationTypeEnum {
  noAutomation = 0,
  timeBased = 1,
  actionBased = 2,
}


export enum RepeatOptionEnum {
  doesNotRepeat = 0,
  daily = 1,
  weekly = 2,
  monthly = 3,
  annually = 4,
  every = 5,
  custom = 6
}


export interface MessageTable {
  items: MessageModel[];
  noFiltered: number;
  noTotal: number;
}
