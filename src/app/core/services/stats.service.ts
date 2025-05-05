import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map, shareReplay } from 'rxjs';
import { wrapJsonForRequest, pluckItemWrapperData } from 'src/app/shared/utils/api.functions';
import { environment } from 'src/environments/environment';
import { ResponseItemWrapper } from '../models/response-wrappers.types';

@Injectable({
    providedIn: 'root'
})
export class StatsService {
    private readonly route: string = '/admin/stats/vehicles';
    constructor(private readonly http: HttpClient) { }

    getDashboardStats(): Observable<any> {
        return this.http.post(`${environment.apiUrl}${environment.apiVersion}/getDashboardStats`, {}).pipe(
            map((x: any) => {
                return x
            })
        )
    }
    getVehiclesToday(): Observable<any> {
        return this.http.get(`${environment.apiUrl}${environment.apiVersion}${this.route}/today`)
            .pipe(map((body: any) => +body.data.count), shareReplay())
    }

    getVehiclesInside(): Observable<any> {
        return this.http.get(`${environment.apiUrl}${environment.apiVersion}${this.route}/inside`)
            .pipe(map((body: any) => +body.data.count), shareReplay())
    }

    getVehiclesPlanned(): Observable<any> {
        return this.http.get(`${environment.apiUrl}${environment.apiVersion}${this.route}/planned`)
            .pipe(map((body: any) => +body.data.count), shareReplay())
    }

    getHourlyVehiclesToday(): Observable<any> {
        return this.http.get(`${environment.apiUrl}${environment.apiVersion}${this.route}/today/hourly`)
            .pipe((map((body: any) => {
                const data = body.data;
                const series = [];
                for (let key in data) {
                    series.push({ name: key.length < 4 ? `0${key.slice(1, 2)}:00` : `${key.slice(1, 3)}:00`, value: data[key] });
                }

                return [{ name: 'Checkins', series }];
            })), shareReplay())
    }

    getVehiclesInsideByOperation(): Observable<any> {
        return this.http.get(`${environment.apiUrl}${environment.apiVersion}${this.route}/inside/operations`)
            .pipe(map((body: any) => body.data.map((d: any) => ({ name: d.operationName, value: d.count }))), shareReplay());
    }

    getVehiclesPlannedByOperation(): Observable<any> {
        return this.http.get(`${environment.apiUrl}${environment.apiVersion}${this.route}/planned/operations`)
            .pipe(map((body: any) => body.data.map((d: any) => ({ name: d.operationName, value: d.count }))), shareReplay());
    }
}
