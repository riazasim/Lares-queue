import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { WeekDayModel } from '../models/days.model';
import { ResponseArrayWrapper } from '../models/response-wrappers.types';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';
import { pluckArrayWrapperData } from 'src/app/shared/utils/api.functions';

@Injectable({
  providedIn: 'root'
})
export class DayService {
  private readonly route: string = '/admin/week-days';
  constructor(private readonly http: HttpClient) { }

  list(): Observable<WeekDayModel[]> {
    return this.http.get<ResponseArrayWrapper<WeekDayModel[]>>(`${environment.apiUrl}${environment.apiVersion}${this.route}`)
                    .pipe(pluckArrayWrapperData<any, ResponseArrayWrapper<WeekDayModel[]>>())
  }
}
