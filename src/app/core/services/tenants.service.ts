import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import {
  pluckItemWrapperData,
  wrapJsonForRequest,
  wrapJsonListForRequest
} from 'src/app/shared/utils/api.functions';
import { environment } from 'src/environments/environment';
import {
  ResponseItemWrapper
} from '../models/response-wrappers.types';

@Injectable({
  providedIn: 'root'
})
export class TenantsService {
  constructor(private http: HttpClient) { }

  create(data: any): Observable<any> {
    return this.http.post<ResponseItemWrapper<any>>(`${environment.apiUrl}${environment.apiVersion}/queue/createParameterTenant`, wrapJsonForRequest(data));
  }

  importTenants(list: any[]): Observable<any> {
    return this.http.post(`${environment.apiUrl}${environment.apiVersion}/queue/importParameterTenant`, wrapJsonListForRequest('tenants', list));
  }

  delete(id: number): Observable<any> {
    let data = {
      "parameterTenantId": id
    }
    return this.http.post(`${environment.apiUrl}${environment.apiVersion}/queue/deleteParameterTenant`, wrapJsonForRequest(data))
  }

  getTenantsList(): Observable<any> {
    return this.http.post<ResponseItemWrapper<any>>(`${environment.apiUrl}${environment.apiVersion}/queue/getParameterTenantList`, {})
      .pipe(pluckItemWrapperData<any, ResponseItemWrapper<any>>(),
        map((p: any) => {
          return p;
        })
      )
  }

}
