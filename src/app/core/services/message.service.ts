import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {map, Observable, Subject} from 'rxjs';
import {
  pluckArrayPaginationWrapperData,
  pluckArrayWrapperData,
  pluckItemWrapperData,
  wrapJsonForRequest
} from 'src/app/shared/utils/api.functions';
import { environment } from 'src/environments/environment';
import {MessageModel, MessageTable} from '../models/message.model';
import {
  ResponseArrayPaginationWrapper,
  ResponseArrayWrapper,
  ResponseItemWrapper
} from '../models/response-wrappers.types';
import { TemplateQueryWithTime } from '../models/template-query.model';
import {CustomFieldData} from "../models/custom-field.model";

@Injectable({
  providedIn: 'root'
})
export class MessageService {
    constructor(private http: HttpClient) { }
    public saveTrigger : Subject<TemplateQueryWithTime> = new Subject<TemplateQueryWithTime>;
    create(data: MessageModel): Observable<any> {
      return this.http.post<ResponseItemWrapper<any>>(`${environment.apiUrl}${environment.apiVersion}/createTemplate`, wrapJsonForRequest(data));
    }

    edit(id:number,data: MessageModel): Observable<any> {
      data['id']=id;
      return this.http.post<ResponseItemWrapper<any>>(`${environment.apiUrl}${environment.apiVersion}/setTemplateInfo`, wrapJsonForRequest(data));
    }

    get(id: number): Observable<any> {
        let data ={
          "templateId":id
        }
      return this.http.post<ResponseItemWrapper<any>>(`${environment.apiUrl}${environment.apiVersion}/getTemplate`, wrapJsonForRequest(data))
                      .pipe(pluckItemWrapperData<any, ResponseItemWrapper<any>>())
    }

    delete(id: number): Observable<any> {
      let data ={
        "templateId":id
      }
      return this.http.post(`${environment.apiUrl}${environment.apiVersion}/deleteTemplate`, wrapJsonForRequest(data))
    }

    list(data: any): Observable<MessageModel[]> {
      return this.http.post<ResponseArrayWrapper<any>>(`${environment.apiUrl}${environment.apiVersion}/paginatTemplates`, wrapJsonForRequest(data))
        .pipe(pluckArrayWrapperData<any, ResponseArrayWrapper<any>>())
    }



    pagination(data: any): Observable<MessageTable> {
      return this.http.post<ResponseArrayPaginationWrapper<any>>(`${environment.apiUrl}${environment.apiVersion}/paginateTemplates`, wrapJsonForRequest(data))
          .pipe(pluckArrayPaginationWrapperData<any, ResponseArrayPaginationWrapper<any>>(),
                          map((u: MessageTable) => {
                               u.items = (<any>u.items).map(((c: CustomFieldData) => c.attributes));
                              return u;
                          })
              );
    }

}
