import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError } from 'rxjs';
import { convertJsonToFormData, pluckArrayWrapperData, pluckItemWrapperData, wrapJsonForRequest } from 'src/app/shared/utils/api.functions';
import { environment } from 'src/environments/environment';
import { LocationModel } from '../models/location.model';
import { ResponseArrayWrapper, ResponseItemWrapper } from '../models/response-wrappers.types';
import {AlertModel} from "../models/alert..model";

@Injectable({
  providedIn: 'root'
})
export class AlertService {
  private route: string = '/admin/alerts';
  constructor(private http: HttpClient) {}

  /*create(data: AlertModel): Observable<any> {
    const formData = convertJsonToFormData(data, 'data[attributes]');
    formData.delete('data[attributes][image]');
    formData.append('image', data.image);
    return this.http.post<ResponseItemWrapper<any>>(`${environment.apiUrl}${environment.apiVersion}${this.route}`, formData);
  }

  edit(data: LocationModel): Observable<any> {
    const formData = convertJsonToFormData(data, 'data[attributes]');
    formData.delete('data[attributes][image]');
    formData.delete('data[attributes][id]');
    if (data.image) formData.append('image', data.image);
    return this.http.post<ResponseItemWrapper<any>>(`${environment.apiUrl}${environment.apiVersion}${this.route}/${data.id}`, formData);
  }

  get(id: number): Observable<any> {
    return this.http.get<ResponseItemWrapper<any>>(`${environment.apiUrl}${environment.apiVersion}${this.route}/${id}`)
                    .pipe(pluckItemWrapperData<any, ResponseItemWrapper<any>>())
  }

  delete(id: number): Observable<any> {
    return this.http.delete(`${environment.apiUrl}${environment.apiVersion}${this.route}/${id}`)
  }

  list(data: any): Observable<LocationModel[]> {
    return this.http.get<ResponseArrayWrapper<any>>(`${environment.apiUrl}${environment.apiVersion}${this.route}`)
    .pipe(
      pluckArrayWrapperData<any, ResponseArrayWrapper<any>>(),
      catchError(() => [])
      )
  }

  listTable(data: any): Observable<LocationModel[]> {
    return this.http.get<ResponseArrayWrapper<any>>(`${environment.apiUrl}${environment.apiVersion}${this.route}/table`)
    .pipe(
      pluckArrayWrapperData<any, ResponseArrayWrapper<any>>(),
      catchError(() => [])
      )
  }

  getLocationsByUser(): Observable<any> {
    return this.http.get<ResponseArrayWrapper<any>>(`${environment.apiUrl}${environment.apiVersion}${this.locations}`).pipe(pluckArrayWrapperData<any, ResponseArrayWrapper<any>>());
  }

  changeLocation(id: number): Observable<any> {
    return this.http.post(`${environment.apiUrl}${environment.apiVersion}${this.locations}/${id}`, {});
  }*/
}
