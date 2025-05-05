import { TemplateQuery } from "./template-query.model";

export interface TemplateRepeatQuery {
    queries: TemplateQuery[]
    index?: number;
}
