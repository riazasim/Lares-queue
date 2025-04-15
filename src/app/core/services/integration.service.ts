import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { pluckArrayPaginationWrapperData, pluckItemWrapperData, wrapJsonForRequest } from 'src/app/shared/utils/api.functions';
import { environment } from 'src/environments/environment';
import { ResponseArrayPaginationWrapper, ResponseArrayWrapper, ResponseItemWrapper } from '../models/response-wrappers.types';
import { CustomFieldData } from '../models/custom-field.model';
import { IntegrationModel } from '../models/integration.model';

@Injectable({
  providedIn: 'root'
})
export class IntegrationService {
  constructor(private http: HttpClient) { }

  create(data: any): Observable<any> {
    return this.http.post<ResponseItemWrapper<any>>(`${environment.apiUrl}${environment.apiVersion}/integration/apikey/create`, wrapJsonForRequest(data));
  }

  edit(id: number, data: any): Observable<any> {
    data['integrationApiKeyId'] = id;
    return this.http.post<ResponseItemWrapper<any>>(`${environment.apiUrl}${environment.apiVersion}/integration/apikey/update`, wrapJsonForRequest(data)).pipe(pluckItemWrapperData<any, ResponseItemWrapper<any>>());
  }

  get(id: number): Observable<any> {
    let data = { 'integrationApiKeyId': id };
    return this.http.post<ResponseItemWrapper<any>>(`${environment.apiUrl}${environment.apiVersion}/integration/apikey/get`, wrapJsonForRequest(data))
      .pipe(pluckItemWrapperData<any, ResponseItemWrapper<any>>())
  }

  delete(id: number): Observable<any> {
    let data = { 'integrationApiKeyId': id };
    return this.http.post(`${environment.apiUrl}${environment.apiVersion}/integration/apikey/delete`, wrapJsonForRequest(data))
  }

  pagination(data: any): Observable<any> {
    return this.http.post<ResponseArrayPaginationWrapper<any>>(`${environment.apiUrl}${environment.apiVersion}/integration/apikey/paginate`, wrapJsonForRequest(data))
        .pipe(pluckArrayPaginationWrapperData<any, ResponseArrayPaginationWrapper<any>>(),
            map((u: any) => {
              u.items = (<any>u.items).map(((c: CustomFieldData) => c.attributes));
              return u;
            })
        );
  }

  list(data: any): Observable<IntegrationModel[]> {
  
    const filters: any = [
      data.name || '',
    ];
    const order = [{dir: data.dir||'DESC', column: data.column || 0}]
    const start = 0;
    const length = 0;

    return this.http.post<ResponseArrayWrapper<IntegrationModel[]>>(`${environment.apiUrl}${environment.apiVersion}/searchApikeys`, 
      wrapJsonForRequest({filters, order, start, length})
    ).pipe(pluckArrayWrapperData<any, ResponseArrayWrapper<IntegrationModel[]>>(), 
    );
  }
  
}
function pluckArrayWrapperData<T, U>(): import("rxjs").OperatorFunction<ResponseArrayWrapper<IntegrationModel[]>, IntegrationModel[]> {
  throw new Error('Function not implemented.');
}

