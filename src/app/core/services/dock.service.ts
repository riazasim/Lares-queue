import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { pluckArrayWrapperData, pluckItemWrapperData, wrapJsonForRequest } from 'src/app/shared/utils/api.functions';
import { environment } from 'src/environments/environment';
import { DockModel, PartnerOnlyRelationship } from '../models/dock.model';
import { ResponseArrayWrapper, ResponseDataItem, ResponseItemWrapper } from '../models/response-wrappers.types';
import { LocationModel } from '../models/location.model';
import { BuildingModel } from '../models/building.model';
import { BreakModel, NonWorkingHoursModel, WorkingHoursModel } from '../models/working-hours.model';
import { DockToPlanningModel, SchedulingDockModel } from '../models/scheduling.model';
import { StatusListModel } from '../models/status-list.model';

@Injectable({
  providedIn: 'root'
})
export class DockService {
  private readonly route: string = '/admin/docks'
  constructor(private http: HttpClient) { }

  create(data: DockModel): Observable<any> {
    return this.http.post<ResponseItemWrapper<any>>(`${environment.apiUrl}${environment.apiVersion}${this.route}`, wrapJsonForRequest(data));
  }

  edit(id: number, data: DockModel): Observable<any> {
    return this.http.post<ResponseItemWrapper<any>>(`${environment.apiUrl}${environment.apiVersion}${this.route}/${id}`, wrapJsonForRequest(data));
  }

  get(id: number): Observable<DockModel> {
    return this.http.get<ResponseItemWrapper<any>>(`${environment.apiUrl}${environment.apiVersion}${this.route}/${id}`)
                    .pipe(pluckItemWrapperData<any, ResponseItemWrapper<DockModel>>(),
                      map(d => {
                        d.location = d?.location?.attributes ?? null;
                        d.warehouse = d?.warehouse?.attributes ?? null;
                        d.workingHour = d?.workingHour?.attributes ?? null;
                        
                        if ((<PartnerOnlyRelationship[]>d.partnerDockRelationships).length) {
                          d['partners'] = (<PartnerOnlyRelationship[]>d.partnerDockRelationships).flatMap((p) => 
                                                                        p.attributes.partner.map(x => x.attributes.id));
                        } else {
                          d['partners'] = [];
                        }

                        return d;
                      })
                    )
  }

  delete(id: number): Observable<any> {
    return this.http.delete(`${environment.apiUrl}${environment.apiVersion}${this.route}/${id}`)
  }

  list(data: any): Observable<DockModel[]> {
    return this.http.get<ResponseArrayWrapper<any>>(`${environment.apiUrl}${environment.apiVersion}${this.route}`)
                    .pipe(pluckArrayWrapperData<any, ResponseArrayWrapper<DockModel[]>>(),
                    map((d: DockModel[]) => {
                      d = d.map((s: DockModel) => {
                        s.location = (<ResponseDataItem<LocationModel>>s.location)?.attributes ?? null;
                        s.warehouse = (<ResponseDataItem<BuildingModel>>s.warehouse)?.attributes ?? null;
                        s.workingHour = (<ResponseDataItem<WorkingHoursModel>>s.workingHour)?.attributes ?? null;

                        return s;
                      })

                      return d;
                    })
                    
                    )
  }

  listTable(data: any): Observable<DockModel[]> {
    return this.http.get<ResponseArrayWrapper<any>>(`${environment.apiUrl}${environment.apiVersion}${this.route}/table`)
                    .pipe(pluckArrayWrapperData<any, ResponseArrayWrapper<any>>())
  }

  listAssignedHours(data: {filterDate: string }): Observable<SchedulingDockModel[]> {
    return this.http.get<ResponseArrayWrapper<any>>(`${environment.apiUrl}${environment.apiVersion}${this.route}/scheduling?query={"assigningDate": "${data.filterDate}"}`)
                    .pipe(pluckArrayWrapperData<any, ResponseArrayWrapper<SchedulingDockModel[]>>(),
                      map((l: SchedulingDockModel[]) => {
                        l = l.map((s: SchedulingDockModel) => {

                          s.workingHour = (<ResponseDataItem<WorkingHoursModel>>s.workingHour)?.attributes ?? null;
                          s.dockToPlannings = (<ResponseDataItem<DockToPlanningModel>[]>s.dockToPlannings).map(d => d.attributes) ?? [];
                          s.statusListStatus = (<ResponseDataItem<StatusListModel>>s.statusListStatus)?.attributes ?? null;

                          // if (s.dockToPlannings.length) {
                          //   const start = new Date(data.filterDate).setHours(0, 0, 0, 0);
                          //   const end = new Date(data.filterDate).setHours(23, 59, 59, 999);
                          //   s.dockToPlannings = s.dockToPlannings.filter(nw => {
                          //     return start <= new Date(nw.assigningDate).getTime()  &&
                          //             end >= new Date(nw.assigningDate).getTime()
                          //   })
                          // }

                          if (s.workingHour) {
                            s.workingHour.nonWorkingHours = (<ResponseDataItem<BreakModel>[]>s.workingHour.nonWorkingHours).map((nw: ResponseDataItem<BreakModel>) => {
                              nw.attributes.nonWorkingHour = (<ResponseDataItem<NonWorkingHoursModel>>nw.attributes.nonWorkingHour).attributes;
  
                              return <BreakModel>nw.attributes;
                            });
                          }

                          return s;
                        }).filter(d => d.workingHour)

                        return l;
                      })
                    )
  }
}
