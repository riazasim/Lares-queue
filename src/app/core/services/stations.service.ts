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
import { CustomFieldData } from "../models/custom-field.model";
import { ShipTable } from '../models/ship.model';
import { StationModel, StationTable } from '../models/station.model';

@Injectable({
    providedIn: 'root'
})
export class StationService {
    constructor(private http: HttpClient) { }

    create(data: StationModel): Observable<any> {
        return this.http.post<ResponseItemWrapper<any>>(`${environment.apiUrl}${environment.apiVersion}/createStation`, wrapJsonForRequest(data));
    }

    edit(id: number, data: StationModel): Observable<any> {
        data['stationId'] = id;
        return this.http.post<ResponseItemWrapper<any>>(`${environment.apiUrl}${environment.apiVersion}/setStationInfo`, wrapJsonForRequest(data));
    }

    get(id: number): Observable<any> {
        let data = {
            "stationId": id
        }
        return this.http.post<ResponseItemWrapper<any>>(`${environment.apiUrl}${environment.apiVersion}/getStation`, wrapJsonForRequest(data))
            .pipe(pluckItemWrapperData<any, ResponseItemWrapper<any>>())
    }

    delete(id: number): Observable<any> {
        let data = {
            "stationId": id
        }
        return this.http.post(`${environment.apiUrl}${environment.apiVersion}/deleteStation`, wrapJsonForRequest(data))
    }



    pagination(data: any): Observable<any> {
        return this.http.post<ResponseArrayPaginationWrapper<any>>(`${environment.apiUrl}${environment.apiVersion}/paginateStations`, wrapJsonForRequest(data))
            .pipe(pluckArrayPaginationWrapperData<any, ResponseArrayPaginationWrapper<any>>(),
                map((u: any) => {
                    u.items = (<any>u.items).map(((c: CustomFieldData) => c.attributes));
                    return u;
                })
            );
    }

    getStationList(data: any): Observable<any> {
        return this.http.post<ResponseItemWrapper<any>>(`${environment.apiUrl}${environment.apiVersion}/getStationList`, wrapJsonForRequest(data))
            .pipe(pluckItemWrapperData<any, ResponseItemWrapper<any>>(),
                map((p: any) => {
                    return p;
                })
            )
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
