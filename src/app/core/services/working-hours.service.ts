import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { pluckArrayWrapperData, pluckItemWrapperData, wrapJsonForRequest } from 'src/app/shared/utils/api.functions';
import { environment } from 'src/environments/environment';
import { ResponseArrayWrapper, ResponseDataItem, ResponseItemWrapper } from '../models/response-wrappers.types';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { NonWorkingHoursModel, WorkingHoursModel } from '../models/working-hours.model';
import { LocationModel } from '../models/location.model';
import { WeekDayModel } from '../models/days.model';

@Injectable({
  providedIn: 'root'
})
export class WorkingHoursService {
  private readonly workingHourRoute: string = '/admin/working-hours';
  private readonly nonWorkingHourRoute = '/admin/non-working-hours';
  private readonly breakRoute = '/admin/non-working-hour-breaks';
  private readonly holidayRoute = '/admin/non-working-hour-holidays';
  constructor(private http: HttpClient) { }

  create(data: WorkingHoursModel): Observable<any> {
    return this.http.post(`${environment.apiUrl}${environment.apiVersion}${this.workingHourRoute}`, wrapJsonForRequest(data))
  }

  edit(id: number, data: WorkingHoursModel): Observable<any> {
    return this.http.put(`${environment.apiUrl}${environment.apiVersion}${this.workingHourRoute}/${id}`, wrapJsonForRequest(data))
  }

  get(id: number): Observable<WorkingHoursModel> {
    return this.http.get<ResponseItemWrapper<WorkingHoursModel>>(`${environment.apiUrl}${environment.apiVersion}${this.workingHourRoute}/${id}`)
                    .pipe(pluckItemWrapperData<WorkingHoursModel, ResponseItemWrapper<WorkingHoursModel>>())
  }

  delete(id: number): Observable<any> {
    return this.http.delete(`${environment.apiUrl}${environment.apiVersion}${this.workingHourRoute}/${id}`)
  }

  list(data: any): Observable<WorkingHoursModel[]> {
    return this.http.get<ResponseArrayWrapper<WorkingHoursModel[]>>(`${environment.apiUrl}${environment.apiVersion}${this.workingHourRoute}`)
                    .pipe(pluckArrayWrapperData<any, ResponseArrayWrapper<WorkingHoursModel[]>>());
  }

  getBreakById(id: number): Observable<NonWorkingHoursModel> {
    return this.http.get<ResponseItemWrapper<NonWorkingHoursModel>>(`${environment.apiUrl}${environment.apiVersion}${this.breakRoute}/${id}`)
                  .pipe(pluckItemWrapperData<any, ResponseItemWrapper<any>>());
  }

  addBreak(data: NonWorkingHoursModel): Observable<NonWorkingHoursModel> {
    return this.http.post<ResponseItemWrapper<NonWorkingHoursModel>>(`${environment.apiUrl}${environment.apiVersion}${this.breakRoute}`, wrapJsonForRequest(data))
                      .pipe(pluckItemWrapperData<any, ResponseItemWrapper<any>>());
  }

  editBreak(id: number, data: NonWorkingHoursModel): Observable<NonWorkingHoursModel> {
    return this.http.put<ResponseItemWrapper<NonWorkingHoursModel>>(`${environment.apiUrl}${environment.apiVersion}${this.breakRoute}/${id}`, wrapJsonForRequest(data))
                      .pipe(pluckItemWrapperData<any, ResponseItemWrapper<any>>());
  }

  deleteBreak(id: number): Observable<unknown> {
    return this.http.delete(`${environment.apiUrl}${environment.apiVersion}${this.breakRoute}/${id}`);
  }

  getHolidayById(id: number): Observable<any> {
    return this.http.get<ResponseItemWrapper<any>>(`${environment.apiUrl}${environment.apiVersion}${this.holidayRoute}/${id}`)
                    .pipe(pluckItemWrapperData<any, ResponseItemWrapper<any>>());
  }

  addHoliday(data: NonWorkingHoursModel): Observable<NonWorkingHoursModel> {
    return this.http.post<ResponseItemWrapper<NonWorkingHoursModel>>(`${environment.apiUrl}${environment.apiVersion}${this.holidayRoute}`, wrapJsonForRequest(data))
                      .pipe(pluckItemWrapperData<any, ResponseItemWrapper<any>>());
  }

  editHoliday(id: number, data: NonWorkingHoursModel): Observable<NonWorkingHoursModel> {
    return this.http.put<ResponseItemWrapper<NonWorkingHoursModel>>(`${environment.apiUrl}${environment.apiVersion}${this.holidayRoute}/${id}`, wrapJsonForRequest(data))
                      .pipe(pluckItemWrapperData<any, ResponseItemWrapper<any>>());
  }

  deleteHoliday(id: number): Observable<unknown> {
    return this.http.delete(`${environment.apiUrl}${environment.apiVersion}${this.breakRoute}/${id}`);
  }

  listNonWorkingHours(): Observable<any> {
    return this.http.get<ResponseArrayWrapper<any>>(`${environment.apiUrl}${environment.apiVersion}${this.nonWorkingHourRoute}`)
                    .pipe(pluckArrayWrapperData<any, ResponseArrayWrapper<any>>());
  }
}
