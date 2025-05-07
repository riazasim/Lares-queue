import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { pluckArrayWrapperData, pluckItemWrapperData, wrapJsonForRequest } from 'src/app/shared/utils/api.functions';
import { environment } from 'src/environments/environment';
import { BuildingModel } from '../models/building.model';
import { ResponseArrayWrapper, ResponseDataItem, ResponseItemWrapper } from '../models/response-wrappers.types';
import { LocationModel } from '../models/location.model';

@Injectable({
  providedIn: 'root'
})
export class BuildingService {
  private readonly route: string = '/admin/warehouses';
  constructor(private http: HttpClient) { }

  create(data: BuildingModel): Observable<any> {
    return this.http.post<ResponseItemWrapper<any>>(`${environment.apiUrl}${environment.apiVersion}${this.route}`, wrapJsonForRequest(data));
  }

  edit(id: number, data: BuildingModel): Observable<any> {
    return this.http.post<ResponseItemWrapper<any>>(`${environment.apiUrl}${environment.apiVersion}${this.route}/${id}`, wrapJsonForRequest(data));
  }

  get(id: number): Observable<any> {
    return this.http.get<ResponseItemWrapper<any>>(`${environment.apiUrl}${environment.apiVersion}${this.route}/${id}`).pipe(pluckItemWrapperData<any, ResponseItemWrapper<any>>())
  }

  delete(id: number): Observable<any> {
    return this.http.delete(`${environment.apiUrl}${environment.apiVersion}${this.route}/${id}`)
  }

  list(data: any): Observable<BuildingModel[]> {
    return this.http.get<ResponseArrayWrapper<any>>(`${environment.apiUrl}${environment.apiVersion}${this.route}`)
                    .pipe(pluckArrayWrapperData<any, ResponseArrayWrapper<BuildingModel[]>>(),
                      map((l: BuildingModel[]) => {
                        l = l.map((b: BuildingModel) => {
                          b.location = (<ResponseDataItem<LocationModel>>b.location).attributes;

                          return b;
                        })


                        return l;
                      })
                    )
  }

  listTable(data: any): Observable<BuildingModel[]> {
    return this.http.get<ResponseArrayWrapper<any>>(`${environment.apiUrl}${environment.apiVersion}${this.route}/table`).pipe(pluckArrayWrapperData<any, ResponseArrayWrapper<any>>())
  }
}
