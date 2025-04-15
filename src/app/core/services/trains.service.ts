import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import {
  pluckArrayPaginationWrapperData,
  pluckItemWrapperData,
  wrapJsonForRequest
} from 'src/app/shared/utils/api.functions';
import { environment } from 'src/environments/environment';
import {
  ResponseArrayPaginationWrapper,
  ResponseItemWrapper
} from '../models/response-wrappers.types';
import {CustomFieldData} from "../models/custom-field.model";
import { TrainModel, TrainTable } from '../models/trains.model';

@Injectable({
  providedIn: 'root'
})
export class TrainsService {
  constructor(private http: HttpClient) { }

  create(data: TrainModel): Observable<any> {
    return this.http.post<ResponseItemWrapper<any>>(`${environment.apiUrl}${environment.apiVersion}/createLocomotive`, wrapJsonForRequest(data));
  }

  edit(id:number,data: TrainModel): Observable<any> {
    data['locomotiveId']=id;
    return this.http.post<ResponseItemWrapper<any>>(`${environment.apiUrl}${environment.apiVersion}/setLocomotiveInfo`, wrapJsonForRequest(data));
  }

  get(id: number): Observable<any> {
      let data ={
        "locomotiveId":id
      }
    return this.http.post<ResponseItemWrapper<any>>(`${environment.apiUrl}${environment.apiVersion}/getLocomotive`, wrapJsonForRequest(data))
                    .pipe(pluckItemWrapperData<any, ResponseItemWrapper<any>>())
  }

  delete(id: number): Observable<any> {
    let data ={
      "locomotiveId":id
    }
    return this.http.post(`${environment.apiUrl}${environment.apiVersion}/deleteLocomotive`, wrapJsonForRequest(data))
  }



  pagination(data: any): Observable<TrainTable> {
    return this.http.post<ResponseArrayPaginationWrapper<any>>(`${environment.apiUrl}${environment.apiVersion}/paginateLocomotives`, wrapJsonForRequest(data))
        .pipe(pluckArrayPaginationWrapperData<any, ResponseArrayPaginationWrapper<any>>(),
                        map((u: TrainTable) => {
                             u.items = (<any>u.items).map(((c: CustomFieldData) => c.attributes));
                            return u;
                        })
            );
  }
  // getShipList(data: any): Observable<ShipTable> {
  //   return this.http.post<ResponseArrayPaginationWrapper<any>>(`${environment.apiUrl}${environment.apiVersion}/getShipList`, wrapJsonForRequest(data))
  //       .pipe(pluckArrayPaginationWrapperData<any, ResponseArrayPaginationWrapper<any>>(),
        //                 map((u: ShipTable) => {
        //                      u.items = (<any>u.items).map(((c: CustomFieldData) => c.attributes));
        //                     return u;
        //                 })
  //            );
  // }

}
