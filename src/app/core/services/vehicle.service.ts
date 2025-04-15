import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import {
  pluckArrayPaginationWrapperData,
  pluckArrayWrapperData,
  pluckItemWrapperData,
  pluckUsersWrapperData,
  wrapJsonForRequest
} from 'src/app/shared/utils/api.functions';
import { environment } from 'src/environments/environment';
import {
  ResponseArrayPaginationWrapper,
  ResponseArrayWrapper,
  ResponseDataItem, ResponseItemPaginationWrapper,
  ResponseItemWrapper
} from '../models/response-wrappers.types';
import {VehicleModel, VehicleTable} from "../models/vehicle.model";
import {CustomFieldData} from "../models/custom-field.model";

@Injectable({
  providedIn: 'root'
})
export class VehicleService {
  //private route: string = '/admin/vehicles';
  constructor(private http: HttpClient) { }

  create(data: VehicleModel): Observable<any> {
    return this.http.post<ResponseItemWrapper<any>>(`${environment.apiUrl}${environment.apiVersion}/createVehicle`, wrapJsonForRequest(data));
  }

  edit(id:number,data: VehicleModel): Observable<any> {
    data['vehicleId']=id;
    return this.http.post<ResponseItemWrapper<any>>(`${environment.apiUrl}${environment.apiVersion}/setVehicleInfo`, wrapJsonForRequest(data));
  }

  get(id: number): Observable<any> {
      let data ={
        "vehicleId":id
      }
    return this.http.post<ResponseItemWrapper<any>>(`${environment.apiUrl}${environment.apiVersion}/getVehicle`, wrapJsonForRequest(data))
                    .pipe(pluckItemWrapperData<any, ResponseItemWrapper<any>>())
  }

  delete(id: number): Observable<any> {
    let data ={
      "vehicleId":id
    }
    return this.http.post(`${environment.apiUrl}${environment.apiVersion}/deleteVehicle`, wrapJsonForRequest(data))
  }

  list(data: any): Observable<VehicleModel[]> {
    return this.http.post<ResponseArrayWrapper<any>>(`${environment.apiUrl}${environment.apiVersion}/paginateVehicles`, wrapJsonForRequest(data))
      .pipe(pluckArrayWrapperData<any, ResponseArrayWrapper<any>>())
  }



  pagination(data: any): Observable<VehicleTable> {
    return this.http.post<ResponseArrayPaginationWrapper<any>>(`${environment.apiUrl}${environment.apiVersion}/paginateVehicles`, wrapJsonForRequest(data))
        .pipe(pluckArrayPaginationWrapperData<any, ResponseArrayPaginationWrapper<any>>(),
                        map((u: VehicleTable) => {
                             u.items = (<any>u.items).map(((c: CustomFieldData) => c.attributes));
                            return u;
                        })
            );
  }

}
