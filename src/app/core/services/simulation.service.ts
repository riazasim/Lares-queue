import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import {
  pluckItemWrapperData,
  wrapJsonForRequest
} from 'src/app/shared/utils/api.functions';
import { environment } from 'src/environments/environment';
import {
  ResponseItemWrapper
} from '../models/response-wrappers.types';

@Injectable({
  providedIn: 'root'
})
export class SimulationService {
  constructor(private http: HttpClient) { }

  simulation(data: any): Observable<any> {
    return this.http.post<ResponseItemWrapper<any>>(`${environment.apiUrl}${environment.apiVersion}/simulate`, data);
  }
  checkSimulationProgress(data: any): Observable<any> {
    return this.http.post<ResponseItemWrapper<any>>(`${environment.apiUrl}${environment.apiVersion}/queue/checkSimulationProgress`, wrapJsonForRequest(data));
  }

  delete(id: number): Observable<any> {
    let data = {
      "parameterAccessPointId": id
    }
    return this.http.post(`${environment.apiUrl}${environment.apiVersion}/queue/deleteParameterAccessPoint`, wrapJsonForRequest(data))
  }

  getSimulation(data: any): Observable<any> {
    return this.http.post<ResponseItemWrapper<any>>(`${environment.apiUrl}${environment.apiVersion}/getSimulation`, wrapJsonForRequest(data))
      .pipe(map(x => x.data))
  }

}
