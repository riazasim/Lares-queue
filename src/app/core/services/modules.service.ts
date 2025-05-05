import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { ResponseArrayWrapper } from '../models/response-wrappers.types';
import { pluckArrayWrapperData } from 'src/app/shared/utils/api.functions';
import { environment } from 'src/environments/environment';
import { UserRoleList } from '../models/user-role-modules.model';

@Injectable({
  providedIn: 'root'
})
export class ModulesService {
  private route: string = '/admin/all-modules';
  constructor(private readonly http: HttpClient) {}

  list(): Observable<UserRoleList[]> {
    return this.http.get<ResponseArrayWrapper<UserRoleList[]>>(`${environment.apiUrl}${environment.apiVersion}${this.route}`)
                    .pipe(pluckArrayWrapperData<any, ResponseArrayWrapper<UserRoleList[]>>())
  }
}
