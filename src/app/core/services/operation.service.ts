import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { pluckArrayPaginationWrapperData, pluckArrayWrapperData, pluckItemWrapperData, wrapJsonForRequest } from 'src/app/shared/utils/api.functions';
import { environment } from 'src/environments/environment';
import { OperationModel, OperationTable } from '../models/operation.model';
import { ResponseArrayPaginationWrapper, ResponseArrayWrapper, ResponseItemWrapper } from '../models/response-wrappers.types';
import { CustomFieldData } from '../models/custom-field.model';

@Injectable({
  providedIn: 'root'
})
export class OperationService {
    constructor(private http: HttpClient) { }

    create(data: OperationModel): Observable<any> {
      return this.http.post<ResponseItemWrapper<any>>(`${environment.apiUrl}${environment.apiVersion}/createOperation`, wrapJsonForRequest(data));
    }

    edit(id:number,data: OperationModel): Observable<any> {
      data['operationId']=id;
      return this.http.post<ResponseItemWrapper<any>>(`${environment.apiUrl}${environment.apiVersion}/setOperationInfo`, wrapJsonForRequest(data));
    }

    get(id: number): Observable<any> {
        let data ={
          "operationId":id
        }
      return this.http.post<ResponseItemWrapper<any>>(`${environment.apiUrl}${environment.apiVersion}/getOperation`, wrapJsonForRequest(data))
                      .pipe(pluckItemWrapperData<any, ResponseItemWrapper<any>>())
    }

    delete(id: number): Observable<any> {
      let data ={
        "operationId":id
      }
      return this.http.post(`${environment.apiUrl}${environment.apiVersion}/deleteOperation`, wrapJsonForRequest(data))
    }

    list(data: any): Observable<OperationModel[]> {
      return this.http.get<ResponseArrayWrapper<any>>(`${environment.apiUrl}${environment.apiVersion}/admin/operations`)
        .pipe(pluckArrayWrapperData<any, ResponseArrayWrapper<any>>())
    }



    // pagination(data: any): Observable<OperationTable> {
    //   return this.http.get<ResponseArrayPaginationWrapper<any>>(`${environment.apiUrl}${environment.apiVersion}/paginateOperations`)
    //       .pipe(pluckArrayPaginationWrapperData<any, ResponseArrayPaginationWrapper<any>>(),
    //                       map((u: OperationTable) => {
    //                            u.items = (<any>u.items).map(((c: CustomFieldData) => c.attributes));
    //                           return u;
    //                       })
    //           );
    // }
    pagination(data: any): Observable<OperationTable> {
      return this.http.post<ResponseArrayPaginationWrapper<any>>(`${environment.apiUrl}${environment.apiVersion}/paginateOperations`, wrapJsonForRequest(data))
        .pipe(pluckArrayPaginationWrapperData<any, ResponseArrayPaginationWrapper<any>>(),
          map((u: OperationTable) => {
            u.items = (<any>u.items).map(((c: CustomFieldData) => c.attributes));
            return u;
          })
        );
    }
}
