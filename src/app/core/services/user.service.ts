import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import {
    pluckArrayPaginationWrapperData,
    pluckArrayWrapperData,
    pluckItemWrapperData,
    pluckUsersWrapperData,
    wrapJsonForRequest
} from 'src/app/shared/utils/api.functions';
import { environment } from 'src/environments/environment';
import {
    ResponseArrayPaginationWrapper,
    ResponseArrayWrapper,
    ResponseDataItem,
    ResponseItemWrapper
} from '../models/response-wrappers.types';
import { UserModel, UserTable } from '../models/user.model';
import { VehicleTable } from "../models/vehicle.model";
import { CustomFieldData } from "../models/custom-field.model";
import { ProfileModel } from '../models/profile.model';


@Injectable({
    providedIn: 'root'
})
export class UserService {
    private route: string = '/createUser';
    private locations: string = '/admin/assign-locations-to-users';
    constructor(private http: HttpClient) { }

    create(data: UserModel): Observable<any> {
        return this.http.post<ResponseItemWrapper<any>>(`${environment.apiUrl}${environment.apiVersion}/createUser`, data);
    }

    edit(id: number, data: UserModel): Observable<any> {
        data['userId'] = id;
        return this.http.post<ResponseItemWrapper<any>>(`${environment.apiUrl}${environment.apiVersion}/setUserInfo`, wrapJsonForRequest(data)).pipe(pluckItemWrapperData<any, ResponseItemWrapper<any>>());
    }

    get(id: number): Observable<any> {
        let data = { 'userId': id };
        return this.http.post<ResponseItemWrapper<any>>(`${environment.apiUrl}${environment.apiVersion}/getUser`, wrapJsonForRequest(data))
            .pipe(pluckItemWrapperData<any, ResponseItemWrapper<UserModel>>())
    }

    // get(id: number): Observable<UserModel> {
    //     let data = {'user_id':id};
    //     return this.http.post<ResponseItemWrapper<any>>(`${environment.apiUrl}${environment.apiVersion}/getUser`, wrapJsonForRequest(data))
    //         .pipe(pluckItemWrapperData<any, ResponseItemWrapper<UserModel>>(),
    //             map((u: UserModel) => {
    //                 // u.userRole = <number>(<ResponseDataItem<UserRoleModel>>u.userRole)?.attributes?.id ?? null;
    //                 return u;
    //             })
    //         )
    // }

    delete(id: number): Observable<any> {
        let data = { 'userId': id };
        return this.http.post(`${environment.apiUrl}${environment.apiVersion}/deleteUser`, wrapJsonForRequest(data))
    }

    list(data: any): Observable<UserModel[]> {
        return this.http.post<ResponseArrayWrapper<any>>(`${environment.apiUrl}${environment.apiVersion}/paginateUsers`, wrapJsonForRequest(data)).pipe(pluckArrayWrapperData<any, ResponseArrayWrapper<any>>())
    }

    pagination(data: any): Observable<UserTable> {
        return this.http.post<ResponseArrayPaginationWrapper<any>>(`${environment.apiUrl}${environment.apiVersion}/paginateUsers`, wrapJsonForRequest(data))
            .pipe(pluckArrayPaginationWrapperData<any, ResponseArrayPaginationWrapper<any>>(),
                map((u: UserTable) => {
                    u.items = (<any>u.items).map(((c: CustomFieldData) => c.attributes));
                    return u;
                })
            );
    }
    setOrganization(data: ProfileModel): Observable<any> {
        return this.http.post<ResponseItemWrapper<any>>(`${environment.apiUrl}${environment.apiVersion}/setOrganizationDetails`, wrapJsonForRequest(data));
    }
}
