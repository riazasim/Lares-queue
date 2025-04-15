export interface IntegrationModel {
    id: number;
    target_entity: string;
    name: string;
    category: string;
    subcategory: string;
    api_key: string;
    refresh_token: string;
    api_token: string;
    json_data: string;
    url1: string;
    url2: string;
    url3: string;

    scopes?: string[];
}