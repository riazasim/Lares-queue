import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { pluckArrayWrapperData, wrapJsonForRequest } from 'src/app/shared/utils/api.functions';
import { environment } from 'src/environments/environment';
import { ModuleAttributeUpdate } from '../models/module.model';
import { ResponseArrayWrapper } from '../models/response-wrappers.types';

@Injectable({
  providedIn: 'root'
})
export class ManageModuleService {
  private readonly route: string = '/admin/table-view-modules';
  private readonly updateRoute: string = '/admin/update-manage-table-view-options';
  constructor(private http: HttpClient) { }

  list(data: any): Observable<any> {
    return this.http.get<ResponseArrayWrapper<any>>(`${environment.apiUrl}${environment.apiVersion}${this.route}`).pipe(pluckArrayWrapperData<any, ResponseArrayWrapper<any>>());
  }

  listOptions(id: number): Observable<any> {
    return this.http.get<any>(`${environment.apiUrl}${environment.apiVersion}/admin/get-manage-table-view-options/${id}`);
  }

  updateName(id: number, data: { id: number, name: string }[]): Observable<unknown> {
    return this.http.put(`${environment.apiUrl}${environment.apiVersion}/admin/table-view-module-attributes/${id}`, wrapJsonForRequest(data));
  }

  update(id: number, data: ModuleAttributeUpdate[]): Observable<any> {
    return this.http.post<any>(`${environment.apiUrl}${environment.apiVersion}${this.updateRoute}/${id}`, wrapJsonForRequest({manageTableViews: data}))
  }
}
