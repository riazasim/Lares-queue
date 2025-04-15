import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of, shareReplay, switchMap } from 'rxjs';
import { pluckItemWrapperData, wrapJsonForRequest } from 'src/app/shared/utils/api.functions';
import { environment } from 'src/environments/environment';
import { OrganizationModel } from '../models/organization.model';
import { ResponseItemWrapper } from '../models/response-wrappers.types';

@Injectable({
  providedIn: 'root'
})
export class OrganizationService {
  private route: string = '/getUserSettings';
  organization: BehaviorSubject<OrganizationModel | null> = new BehaviorSubject<OrganizationModel | null>(null);
  publicOrganization: BehaviorSubject<OrganizationModel | null> = new BehaviorSubject<OrganizationModel | null>(null);
  isUmexOrganization$: BehaviorSubject<boolean> = new BehaviorSubject(false);
  isChimpexOrganization$: BehaviorSubject<boolean> = new BehaviorSubject(false);
  isComvexOrganization$: BehaviorSubject<boolean> = new BehaviorSubject(false);
  constructor(private http: HttpClient) { }

  get(): Observable<OrganizationModel | null> {
    if (this.organization.getValue()) return of(this.organization.getValue());

    return this.http.post<ResponseItemWrapper<OrganizationModel>>(`${environment.apiUrl}${environment.apiVersion}/getOrganizationDetails`, null)
      .pipe(pluckItemWrapperData<OrganizationModel, ResponseItemWrapper<OrganizationModel>>());
  }

  getPublicOrganization(id: number): Observable<OrganizationModel | null> {
    const organization = this.publicOrganization.getValue();
    if (organization && +id === organization.id) return of(organization);

    return this.http.get<any>(`${environment.apiUrl}${environment.apiVersion}${this.route}/detail/${id}`)
      .pipe(pluckItemWrapperData<any, ResponseItemWrapper<OrganizationModel>>(),
        switchMap((response: OrganizationModel) => {
          this.publicOrganization.next(response);
          return of(response);
        })).pipe(shareReplay())
  }

  changeTransportMode(value: any): Observable<any> {
    return this.http.post<ResponseItemWrapper<any>>(`${environment.apiUrl}${environment.apiVersion}/changeTransportMode`, value).pipe(pluckItemWrapperData<any, ResponseItemWrapper<any>>());
  }

  setAppMode(mode: any): void {
    localStorage.setItem("appModeId", mode?.id);
    localStorage.setItem("appMode", mode?.name);
    location.reload();
  }


  getAppMode(): string | null {
    return localStorage.getItem("appMode");
  }

  getAppModeId(): string | null {
    return localStorage.getItem("appModeId");
  }

  updateLogo(id: number, file: File): Observable<OrganizationModel> {
    const data = new FormData();
    data.append('logo', file);
    return this.http.post<ResponseItemWrapper<OrganizationModel>>(`${environment.apiUrl}${environment.apiVersion}${this.route}/logo/${id}`, data)
      .pipe(pluckItemWrapperData<OrganizationModel, ResponseItemWrapper<OrganizationModel>>());
  }
  setTransportModeDetails(id: number, file: File): Observable<any> {
    const data = new FormData();
    data.append('logo', file);
    return this.http.post<ResponseItemWrapper<any>>(`${environment.apiUrl}${environment.apiVersion}/setTransportModeDetails/${id}`, data)
      .pipe(pluckItemWrapperData<any, ResponseItemWrapper<any>>());
  }

  updateCover(id: number, file: File): Observable<OrganizationModel> {
    const data = new FormData();
    data.append('cover', file);
    return this.http.post<ResponseItemWrapper<OrganizationModel>>(`${environment.apiUrl}${environment.apiVersion}${this.route}/cover/${id}`, data)
      .pipe(pluckItemWrapperData<OrganizationModel, ResponseItemWrapper<OrganizationModel>>());;
  }

  updateBookingFormActivation(id: number, isActivated: boolean): Observable<OrganizationModel> {
    return this.http.post<ResponseItemWrapper<OrganizationModel>>(`${environment.apiUrl}${environment.apiVersion}${this.route}/booking-form-is-activated/${id}`, wrapJsonForRequest({ bookingFormIsActivated: +isActivated }))
      .pipe(pluckItemWrapperData<OrganizationModel, ResponseItemWrapper<OrganizationModel>>());
  }

  updatePrivacyLink(id: number, privacyLink: string): Observable<OrganizationModel> {
    return this.http.post<ResponseItemWrapper<OrganizationModel>>(`${environment.apiUrl}${environment.apiVersion}${this.route}/privacy-link/${id}`, wrapJsonForRequest({ privacyLink }))
      .pipe(pluckItemWrapperData<OrganizationModel, ResponseItemWrapper<OrganizationModel>>());
  }

  update(id: number, data: any): Observable<OrganizationModel> {
    const formData = new FormData();
    formData.append('name', data.name);
    formData.append('bookingFormIsActivated', `${+data.bookingFormIsActivated}`);
    formData.append('privacyLink', data.privacyLink);
    formData.append('imgCover', data.imgCoverFile);
    formData.append('imgLogo', data.imgLogoFile);

    return this.http.post<ResponseItemWrapper<OrganizationModel>>(`${environment.apiUrl}${environment.apiVersion}/setOrganizationDetails`, formData)
      .pipe(pluckItemWrapperData<OrganizationModel, ResponseItemWrapper<OrganizationModel>>());
  }


}
