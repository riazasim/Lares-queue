import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, map, of, shareReplay, tap } from 'rxjs';
import { StatusListModel, StatusListTable } from '../models/status-list.model';
import { HttpClient } from '@angular/common/http';
import { ResponseArrayPaginationWrapper, ResponseArrayWrapper, ResponseItemWrapper } from '../models/response-wrappers.types';
import { environment } from '../../../environments/environment';
import { pluckArrayPaginationWrapperData, pluckArrayWrapperData, pluckItemWrapperData, wrapJsonForRequest } from '../../shared/utils/api.functions';
import { CustomFieldData } from '../models/custom-field.model';

@Injectable({
  providedIn: 'root'
})
export class StatusListService {
  private readonly statusRoute: string = '/admin/status-lists';
  private readonly sidRoute: string = '/admin/sid-statuses';
  private readonly dockRoute: string = '/admin/dock-statuses';
  sidStatuses$: BehaviorSubject<StatusListModel[]> = new BehaviorSubject<StatusListModel[]>([]);
  private readonly goodsRoute: string = '/admin/goods-statuses';
  constructor(private readonly http: HttpClient) { }

  createSid(data: StatusListModel): Observable<any> {
    return this.http.post<ResponseItemWrapper<any>>(`${environment.apiUrl}${environment.apiVersion}/createSidStatus`, wrapJsonForRequest(data));
  }

  editSid(id:number,data: StatusListModel): Observable<any> {
    data['id']=id;
    return this.http.post<ResponseItemWrapper<any>>(`${environment.apiUrl}${environment.apiVersion}/setSidStatusInfo`, wrapJsonForRequest(data));
  }

  getSid(id: number): Observable<any> {
      let data ={
        "statusListStatusId":id
      }
    return this.http.post<ResponseItemWrapper<any>>(`${environment.apiUrl}${environment.apiVersion}/getSidStatus`, wrapJsonForRequest(data))
                    .pipe(pluckItemWrapperData<any, ResponseItemWrapper<any>>())
  }

  deleteSid(id: number): Observable<any> {
    let data ={
      "statusListStatusId":id
    }
    return this.http.post(`${environment.apiUrl}${environment.apiVersion}/deleteSidStatus`, wrapJsonForRequest(data))
  }

//   listSid(data: any): Observable<StatusListModel[]> {
//     return this.http.post<ResponseArrayWrapper<any>>(`${environment.apiUrl}${environment.apiVersion}/paginateSidStatuses`, wrapJsonForRequest(data))
//       .pipe(pluckArrayWrapperData<any, ResponseArrayWrapper<any>>())
//   }
listSid(): Observable<StatusListModel[]> {
    if (this.sidStatuses$.getValue()?.length) return of(this.sidStatuses$.getValue());

    return this.http.get<ResponseArrayWrapper<any>>(`${environment.apiUrl}${environment.apiVersion}${this.sidRoute}`)
                    .pipe(pluckArrayWrapperData<any, ResponseArrayWrapper<any>>(),
                    tap({
                      next: (r) => {
                      this.sidStatuses$.next(r);
                    }}), shareReplay())
  }



  paginationSid(data: any): Observable<StatusListTable> {
    return this.http.post<ResponseArrayPaginationWrapper<any>>(`${environment.apiUrl}${environment.apiVersion}/paginateSidStatuses`, wrapJsonForRequest(data))
        .pipe(pluckArrayPaginationWrapperData<any, ResponseArrayPaginationWrapper<any>>(),
                        map((u: StatusListTable) => {
                             u.items = (<any>u.items).map(((c: CustomFieldData) => c.attributes));
                            return u;
                        })
            );
  }

  updateSidPosition(statusListStatusId: number, position: number): Observable<any> {
    let data ={
        "statusListStatusId":statusListStatusId,
        "position":position
      }
    return this.http.post<ResponseItemWrapper<any>>(
      `${environment.apiUrl}${environment.apiVersion}/changeSidStatusPosition`, wrapJsonForRequest(data));
  }

  updateSidColor(statusListStatusId: number, color: string): Observable<any> {
    let data ={
        "statusListStatusId":statusListStatusId,
        "color":color
      }
    return this.http.post<ResponseArrayWrapper<any>>(
      `${environment.apiUrl}${environment.apiVersion}/changeSidStatusColor`, wrapJsonForRequest(data));
    }

  // createDock(data: StatusListModel): Observable<any> {
  //   return this.http.post<ResponseItemWrapper<any>>(`${environment.apiUrl}${environment.apiVersion}${this.dockRoute}`, wrapJsonForRequest(data));
  // }

  // editDock(id: number, data: StatusListModel): Observable<any> {
  //   return this.http.post<ResponseItemWrapper<any>>(`${environment.apiUrl}${environment.apiVersion}${this.dockRoute}/${id}`, wrapJsonForRequest(data));
  // }

  // getDock(id: number): Observable<any> {
  //   return this.http.get<ResponseItemWrapper<any>>(`${environment.apiUrl}${environment.apiVersion}${this.dockRoute}/${id}`).pipe(pluckItemWrapperData<any, ResponseItemWrapper<any>>())
  // }

  // deleteDock(id: number): Observable<any> {
  //   return this.http.delete(`${environment.apiUrl}${environment.apiVersion}${this.dockRoute}/${id}`)
  // }

  // listDock(): Observable<any[]> {
  //   return this.http.get<ResponseArrayWrapper<any>>(`${environment.apiUrl}${environment.apiVersion}${this.dockRoute}`)
  //                   .pipe(pluckArrayWrapperData<any, ResponseArrayWrapper<any>>())
  // }

  listTimeSlots(): Observable<any> {
    return of([
      { name: 'Non working', type: 'System defined', color: '#AEAAAA', description: 'Slot that hasn\'t working hour attached.' },
      { name: 'Working / free', type: 'System defined', color: '#70AD47', description: 'Available free slot for working hour.' },
      { name: 'Filled some', type: 'System defined', color: '#3ab0ed', description: 'Slot has been filled with some, but not full.' },
      { name: 'Service', type: 'System defined', color: '#FFC000', description: 'Slot that has been suspended SID and dock set on Service' },
      { name: 'Break', type: 'System defined', color: '#806000', description: 'Slot that\'s on break.' },
      { name: 'Occupied', type: 'System defined', color: '#ED7D31', description: 'Slot which\'s slot capacity is at full.' },
    ])
  }

  updateDockPosition(statusListStatusId: number, position: number): Observable<any> {
    return this.http.post<ResponseItemWrapper<any>>(
      `${environment.apiUrl}${environment.apiVersion}${this.dockRoute}/change-position/${statusListStatusId}/${position}`, {});
  }

  updateDockColor(statusListStatusId: number, color: string): Observable<any> {
    return this.http.post<ResponseArrayWrapper<any>>(
      `${environment.apiUrl}${environment.apiVersion}${this.dockRoute}/change-color/${statusListStatusId}`, wrapJsonForRequest({ color }))
      .pipe(pluckArrayWrapperData<any, ResponseArrayWrapper<any>>())
  }

  createGoods(data: StatusListModel): Observable<any> {
    return this.http.post<ResponseItemWrapper<any>>(`${environment.apiUrl}${environment.apiVersion}${this.goodsRoute}`, wrapJsonForRequest(data));
  }

  editGoods(id: number, data: StatusListModel): Observable<any> {
    return this.http.post<ResponseItemWrapper<any>>(`${environment.apiUrl}${environment.apiVersion}${this.goodsRoute}/${id}`, wrapJsonForRequest(data));
  }

  getGoods(id: number): Observable<any> {
    return this.http.get<ResponseItemWrapper<any>>(`${environment.apiUrl}${environment.apiVersion}${this.goodsRoute}/${id}`).pipe(pluckItemWrapperData<any, ResponseItemWrapper<any>>())
  }

  deleteGoods(id: number): Observable<any> {
    return this.http.delete(`${environment.apiUrl}${environment.apiVersion}${this.goodsRoute}/${id}`)
  }

  listGoods(): Observable<any[]> {
    return this.http.get<ResponseArrayWrapper<any>>(`${environment.apiUrl}${environment.apiVersion}${this.goodsRoute}`)
                    .pipe(pluckArrayWrapperData<any, ResponseArrayWrapper<any>>())
  }

  updateGoodsPosition(statusListStatusId: number, position: number): Observable<any> {
    return this.http.post<ResponseItemWrapper<any>>(
      `${environment.apiUrl}${environment.apiVersion}${this.goodsRoute}/change-position/${statusListStatusId}/${position}`, {});
  }

  updateGoodsColor(statusListStatusId: number, color: string): Observable<any> {
    return this.http.post<ResponseArrayWrapper<any>>(
      `${environment.apiUrl}${environment.apiVersion}${this.goodsRoute}/change-color/${statusListStatusId}`, wrapJsonForRequest({ color }))
      .pipe(pluckArrayWrapperData<any, ResponseArrayWrapper<any>>())
  }
}
