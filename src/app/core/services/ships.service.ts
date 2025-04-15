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
import { ShipModel, ShipTable } from '../models/ship.model';

@Injectable({
  providedIn: 'root'
})
export class ShipsService {
  constructor(private http: HttpClient) { }

  create(data: ShipModel): Observable<any> {
    return this.http.post<ResponseItemWrapper<any>>(`${environment.apiUrl}${environment.apiVersion}/createShip`, wrapJsonForRequest(data));
  }

  edit(id:number,data: ShipModel): Observable<any> {
    data['shipId']=id;
    return this.http.post<ResponseItemWrapper<any>>(`${environment.apiUrl}${environment.apiVersion}/updateShip`, wrapJsonForRequest(data));
  }

  get(id: number): Observable<any> {
      let data ={
        "shipId":id
      }
    return this.http.post<ResponseItemWrapper<any>>(`${environment.apiUrl}${environment.apiVersion}/getShip`, wrapJsonForRequest(data))
                    .pipe(pluckItemWrapperData<any, ResponseItemWrapper<any>>())
  }

  delete(id: number): Observable<any> {
    let data ={
      "shipId":id
    }
    return this.http.post(`${environment.apiUrl}${environment.apiVersion}/deleteShip`, wrapJsonForRequest(data))
  }



  pagination(data: any): Observable<ShipTable> {
    return this.http.post<ResponseArrayPaginationWrapper<any>>(`${environment.apiUrl}${environment.apiVersion}/paginateShips`, wrapJsonForRequest(data))
        .pipe(pluckArrayPaginationWrapperData<any, ResponseArrayPaginationWrapper<any>>(),
                        map((u: ShipTable) => {
                             u.items = (<any>u.items).map(((c: CustomFieldData) => c.attributes));
                            return u;
                        })
            );
  }
  // getShipList(data: any): Observable<ShipTable> {
  //   return this.http.post<ResponseArrayPaginationWrapper<any>>(`${environment.apiUrl}${environment.apiVersion}/getShipList`, wrapJsonForRequest(data))
  //       .pipe(pluckArrayPaginationWrapperData<any, ResponseArrayPaginationWrapper<any>>(),
  //       //                 map((u: ShipTable) => {
  //       //                      u.items = (<any>u.items).map(((c: CustomFieldData) => c.attributes));
  //       //                     return u;
  //       //                 })
  //            );
  // }

  getShipList(data: any ): Observable<any> {
    return this.http.post<ResponseItemWrapper<any>>(`${environment.apiUrl}${environment.apiVersion}/getShipList`, data )
        .pipe(pluckItemWrapperData<any, ResponseItemWrapper<any>>(),
            map((p: any) => {
                return p;
            })
        )
}

}
