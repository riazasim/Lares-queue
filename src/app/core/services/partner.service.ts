import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { pluckArrayPaginationWrapperData, pluckItemWrapperData, wrapJsonForRequest } from 'src/app/shared/utils/api.functions';
import { environment } from 'src/environments/environment';
import { ResponseArrayPaginationWrapper, ResponseItemWrapper } from '../models/response-wrappers.types';
import { CustomFieldData } from '../models/custom-field.model';
import { PartnerModel, PartnerTable } from '../models/partner.model';

@Injectable({
  providedIn: 'root'
})
export class PartnerService {
  constructor(private http: HttpClient) { }

  create(data: PartnerModel): Observable<any> {
    return this.http.post<ResponseItemWrapper<any>>(`${environment.apiUrl}${environment.apiVersion}/createPartner`, wrapJsonForRequest(data));
  }

  edit(id:number,data: PartnerModel): Observable<any> {
    data['partnerId']=id;
    return this.http.post<ResponseItemWrapper<any>>(`${environment.apiUrl}${environment.apiVersion}/setPartnerInfo`, wrapJsonForRequest(data));
  }

  get(id: number): Observable<any> {
      let data ={
        "partnerId":id
      }
    return this.http.post<ResponseItemWrapper<any>>(`${environment.apiUrl}${environment.apiVersion}/getPartner`, wrapJsonForRequest(data))
                    .pipe(pluckItemWrapperData<any, ResponseItemWrapper<any>>())
  }

  delete(id: number): Observable<any> {
    let data ={
      "partnerId":id
    }
    return this.http.post(`${environment.apiUrl}${environment.apiVersion}/deletePartner`, wrapJsonForRequest(data))
  }



  pagination(data: any): Observable<PartnerTable> {
    return this.http.post<ResponseArrayPaginationWrapper<any>>(`${environment.apiUrl}${environment.apiVersion}/paginatePartners`, wrapJsonForRequest(data))
        .pipe(pluckArrayPaginationWrapperData<any, ResponseArrayPaginationWrapper<any>>(),
                        map((u: PartnerTable) => {
                             u.items = (<any>u.items).map(((c: CustomFieldData) => c.attributes));
                            return u;
                        })
            );
  }
}
