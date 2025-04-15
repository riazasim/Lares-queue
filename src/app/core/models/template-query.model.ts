export interface TemplateQuery {
    key: string;
    condition: string;
    value?: string;
    start_value?: string;
    end_value?: string;
}

/* Internal model - not used in API */
export interface TemplateQueryWithTime {
  messageAutomationEvent: string;
  waitingPeriod: number;
  repeatOption: number;
  automationDate: string | Date;
  whereQuery: TemplateQuery[];
}
