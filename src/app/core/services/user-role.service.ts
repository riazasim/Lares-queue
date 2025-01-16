import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { pluckArrayWrapperData, pluckItemWrapperData, wrapJsonForRequest } from 'src/app/shared/utils/api.functions';
import { environment } from 'src/environments/environment';
import { ResponseArrayWrapper, ResponseDataItem, ResponseItemWrapper } from '../models/response-wrappers.types';
import { CreateUserRoleModuleModel, UserRoleList, UserRoleModule } from '../models/user-role-modules.model';
import { UserRoleModel } from '../models/user-role.model';

@Injectable({
    providedIn: 'root'
})
export class UserRoleService {
    private route: string = '/admin/user-roles';
    private roles: string = '/admin/assign-roles-to-user-role-module';
    constructor(private http: HttpClient) { }

    create(data: UserRoleModel): Observable<any> {
        return this.http.post<ResponseItemWrapper<any>>(`${environment.apiUrl}${environment.apiVersion}${this.route}`, wrapJsonForRequest(data)).pipe(pluckItemWrapperData<any, ResponseItemWrapper<any>>())
    }

    edit(id: number, data: UserRoleModel): Observable<any> {
        return this.http.post<ResponseItemWrapper<any>>(`${environment.apiUrl}${environment.apiVersion}${this.route}/${id}`, wrapJsonForRequest(data));
    }

    get(id: number): Observable<any> {
        return this.http.get<ResponseItemWrapper<any>>(`${environment.apiUrl}${environment.apiVersion}${this.route}/${id}`).pipe(pluckItemWrapperData<any, ResponseItemWrapper<any>>())
    }

    delete(id: number): Observable<any> {
        return this.http.delete(`${environment.apiUrl}${environment.apiVersion}${this.route}/${id}`)
    }

    list(data: any): Observable<UserRoleModel[]> {
        return this.http.get<ResponseArrayWrapper<any>>(`${environment.apiUrl}${environment.apiVersion}${this.route}`).pipe(pluckArrayWrapperData<any, ResponseArrayWrapper<any>>())
    }

    assignUserRoles(id: number, data: { roles: CreateUserRoleModuleModel[] }): Observable<ResponseArrayWrapper<CreateUserRoleModuleModel[]>> {
        return this.http.post<ResponseArrayWrapper<CreateUserRoleModuleModel[]>>(`${environment.apiUrl}${environment.apiVersion}${this.roles}/${id}`, wrapJsonForRequest(data))
    }

    getAuthRoles(id: number): Observable<UserRoleList[]> {
        return this.http.get<ResponseArrayWrapper<UserRoleList[]>>(`${environment.apiUrl}${environment.apiVersion}${this.roles}/${id}`)
            .pipe(
                pluckArrayWrapperData<any, ResponseArrayWrapper<UserRoleList[]>>(),
                map((r: UserRoleList[]) => {
                    r = r.map((role: UserRoleList) => {
                        role.modules = <UserRoleModule>(<ResponseDataItem<UserRoleModule>>role.modules).attributes;
                        return role;
                    });
                    return r;
                })
            )
    }
}
