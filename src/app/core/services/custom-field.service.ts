import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CustomFieldList, CustomFieldModel, ResponseCustomField, ResponseCustomFieldList, ResponseCustomFieldModel } from '../models/custom-field.model';
import { Observable, BehaviorSubject } from 'rxjs';
import { tap, map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { ResponseDataItem, ResponseItemWrapper } from '../models/response-wrappers.types';
import { pluckItemWrapperData, wrapJsonForRequest } from 'src/app/shared/utils/api.functions';
import { UserModel } from '../models/user.model';
import { OrganizationModel } from '../models/organization.model';

@Injectable({
  providedIn: 'root'
})
export class CustomFieldService {
  private readonly route: string = '/admin/custom-fields';
  public customFields: BehaviorSubject<ResponseCustomField|null> = new BehaviorSubject<ResponseCustomField|null>(null);
  constructor(private readonly http: HttpClient) { }

  get(id: number): Observable<ResponseCustomFieldModel> {
    return this.http.get<ResponseItemWrapper<ResponseCustomFieldModel>>(`${environment.apiUrl}${environment.apiVersion}${this.route}/${id}`)
                    .pipe(pluckItemWrapperData<any, ResponseItemWrapper<ResponseCustomFieldModel>>(),
                      map((c: ResponseCustomFieldModel) => {

                        c.user = (<ResponseDataItem<UserModel>>c.user)?.attributes;
                        c.organization =  <OrganizationModel>(<ResponseDataItem<OrganizationModel>>c?.organization)?.attributes;
                        c.customFieldLists = <CustomFieldList[]>(<ResponseCustomFieldList[]>c?.customFieldLists).map(c => c.attributes);

                        return c;
                      })
                    )
  }

  create(data: CustomFieldModel): Observable<unknown> {
    return this.http.post(`${environment.apiUrl}${environment.apiVersion}${this.route}`, wrapJsonForRequest(data))
  }

  update(id: number, data: CustomFieldModel): Observable<unknown> {
    return this.http.put(`${environment.apiUrl}${environment.apiVersion}${this.route}/${id}`, wrapJsonForRequest(data))
  }

  list(forceLoad: boolean = false): Observable<ResponseCustomField|null> {
    if (!this.customFields.value || forceLoad) {
      return this.http.get<ResponseCustomField|null>(`${environment.apiUrl}${environment.apiVersion}${this.route}`)
                      .pipe(tap(f => {
                              this.customFields.next(f);
                              return f;
                            })
                      )
    }

    return this.customFields.asObservable()
  }
}
