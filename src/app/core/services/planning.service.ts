import { HttpClient, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { convertJsonToFormData, pluckArrayPaginationWrapperData, pluckArrayWrapperData, pluckItemWrapperData, wrapJsonForRequest, wrapJsonListForRequest } from 'src/app/shared/utils/api.functions';
import { environment } from 'src/environments/environment';
import { ResponseArrayPaginationWrapper, ResponseArrayWrapper, ResponseItemWrapper } from '../models/response-wrappers.types';
import { SchedulingCustomField, SchedulingLogModel, SchedulingModel, SchedulingPreviewModel, SchedulingProduct } from '../models/scheduling.model';
import { PlanningDetailModel, PlanningTable, UpdatePlanningDock, convoyModel } from '../models/planning.model';
import { map } from 'rxjs/operators';
import { BookingModel } from '../models/booking.model';
import { CustomFieldData } from '../models/custom-field.model';

@Injectable({
    providedIn: 'root'
})
export class PlanningService {
    private route: string = '/createPlanning';
    constructor(private readonly http: HttpClient) { }

    create(body: any): Observable<any> {
        const data = convertJsonToFormData(body, '');
        return this.http.post<ResponseItemWrapper<any>>(`${environment.apiUrl}${environment.apiVersion}${this.route}`, data);
    }


    editRouteingDetails(id: number, data: any): Observable<any> {
        return this.http.post<ResponseItemWrapper<any>>(`${environment.apiUrl}${environment.apiVersion}/updatePlanning`, { "planningId": id, ...data })
            .pipe(pluckItemWrapperData<any, ResponseItemWrapper<any>>(),
                map((p: any) => {
                    return p;
                })
            )
    }
    editConvoys(id: number, data: any): Observable<any> {
        data.planningShipmentId = id
        const body = convertJsonToFormData(data, '');
        // console.log(body)
        // console.log(data)
        return this.http.post<ResponseItemWrapper<any>>(`${environment.apiUrl}${environment.apiVersion}/updatePlanningConvoy`, body)
            .pipe(pluckItemWrapperData<any, ResponseItemWrapper<any>>(),
                map((p: any) => {
                    return p;
                })
            )
    }

    addConvoys(id: number, data: any): Observable<any> {
        data.planningId = id
        const body = convertJsonToFormData(data, '');
        // console.log(body)
        // console.log(data)
        return this.http.post<ResponseItemWrapper<any>>(`${environment.apiUrl}${environment.apiVersion}/createPlanningConvoyOnUpdate`, body)
            .pipe(pluckItemWrapperData<any, ResponseItemWrapper<any>>(),
                map((p: any) => {
                    return p;
                })
            )
    }

    edit(id: number, body: Partial<SchedulingModel>): Observable<any> {
        const products = [...<SchedulingProduct[]>body.products];
        const customFieldCargoData = [...<SchedulingCustomField[]>body.customFieldCargoData];
        const customFieldTransportData = [...<SchedulingCustomField[]>body.customFieldTransportData];
        const customFieldAdditionalData = [...<SchedulingCustomField[]>body.customFieldAdditionalData];

        delete body.products;
        delete body.customFieldCargoData;
        delete body.customFieldTransportData;
        delete body.customFieldAdditionalData;

        const data = convertJsonToFormData(body, 'data[attributes]');

        if ((<File[]>body?.documents)?.length) {
            (<File[]>body.documents).forEach((file: File) => {
                data.append('documents[]', file);
            })
        } else {
            data.append('documents[]', '[]');
        }

        if (body.oldDocuments!.length) {
            body.oldDocuments!.forEach((d) => {
                data.append('data[attributes][oldDocuments][]', `${d}`);
            });
        } else {
            data.append('data[attributes][oldDocuments][]', '');
        }

        data.append('data[attributes][products]', JSON.stringify(products));
        data.append('data[attributes][customFieldCargoData]', JSON.stringify(customFieldCargoData));
        data.append('data[attributes][customFieldTransportData]', JSON.stringify(customFieldTransportData));
        data.append('data[attributes][customFieldAdditionalData]', JSON.stringify(customFieldAdditionalData));

        if (!body.warehouse) {
            data.append('data[attributes][warehouse]', '');
        }

        if (!body.dock) {
            data.append('data[attributes][dock]', '');
        }

        data.delete('data[attributes][documents][0]');
        data.delete('data[attributes][documents][1]');
        data.delete('data[attributes][documents][2]');

        data.delete('data[attributes][oldDocuments][0]');
        data.delete('data[attributes][oldDocuments][1]');
        data.delete('data[attributes][oldDocuments][2]');

        return this.http.post<ResponseItemWrapper<any>>(`${environment.apiUrl}${environment.apiVersion}${this.route}/${id}`, data);
    }

    get(id: number): Observable<any> {
        return this.http.post<ResponseItemWrapper<any>>(`${environment.apiUrl}${environment.apiVersion}/getPlanning`, { "planningId": id })
            .pipe(pluckItemWrapperData<any, ResponseItemWrapper<any>>(),
                map((p: any) => {
                    return p;
                })
            )
    }

    getConvoy(id: number): Observable<any> {
        return this.http.post<ResponseItemWrapper<any>>(`${environment.apiUrl}${environment.apiVersion}/getPlanningConvoy`, { "planningShipmentId": id })
            .pipe(pluckItemWrapperData<any, ResponseItemWrapper<any>>(),
                map((p: any) => {
                    return p;
                })
            )
    }

    getPlanningRouteDetailList(id: number): Observable<any> {
        return this.http.post<ResponseItemWrapper<any>>(`${environment.apiUrl}${environment.apiVersion}/getPlanningRailwayRoutingDetailList`, { "planningId": id })
            .pipe(pluckItemWrapperData<any, ResponseItemWrapper<any>>(),
                map((p: any) => {
                    return p;
                })
            )
    }

    delete(id: number): Observable<any> {
        let data = { "planningId": id };
        return this.http.post(`${environment.apiUrl}${environment.apiVersion}/deletePlanning`, wrapJsonForRequest(data))
    }

    deleteConvoy(id: number): Observable<any> {
        let data = { "planningShipmentId": id };
        return this.http.post(`${environment.apiUrl}${environment.apiVersion}/deletePlanningConvoy`, wrapJsonForRequest(data))
    }

    deleteRailwayShipment(id: number, forceToDelete: boolean = true): Observable<any> {
        let data = { "planningShipmentId": id, "forceToDelete": forceToDelete };
        return this.http.post(`${environment.apiUrl}${environment.apiVersion}/deletePlanningConvoy`, wrapJsonForRequest(data))
    }

    checkDeleteRoute(id: number): Observable<any> {
        let data = { "planningRouteDetailId": id };
        return this.http.post<ResponseItemWrapper<any>>(`${environment.apiUrl}${environment.apiVersion}/checkPlanningRouteDetailExistedInShipemntAlertElseDelete`, data)
    }

    deleteRoute(id: number): Observable<any> {
        let data = { "planningRouteDetailId": id };
        return this.http.post(`${environment.apiUrl}${environment.apiVersion}/deletePlanningRouteDetail`, wrapJsonForRequest(data))
    }

    pagination(data: any): Observable<PlanningTable> {
        return this.http.post<ResponseArrayPaginationWrapper<any>>(`${environment.apiUrl}${environment.apiVersion}/getPaginatePlannings`, wrapJsonForRequest(data))
            .pipe(pluckArrayPaginationWrapperData<any, ResponseArrayPaginationWrapper<any>>(),
                map((u: PlanningTable) => {
                    u.items = (<any>u.items).map(((c: CustomFieldData) => c.attributes));
                    return u;
                })
            );
    }
    getPaginatePlanningShipment(data: any): Observable<PlanningTable> {
        return this.http.post<ResponseArrayPaginationWrapper<any>>(`${environment.apiUrl}${environment.apiVersion}/getPaginatePlanningShipment`, wrapJsonForRequest(data))
            .pipe(pluckArrayPaginationWrapperData<any, ResponseArrayPaginationWrapper<any>>(),
                map((u: PlanningTable) => {
                    u.items = (<any>u.items).map(((c: CustomFieldData) => c.attributes));
                    return u;
                })
            );
    }
    getTransferData(data: any): Observable<any> {
        return this.http.post<ResponseArrayPaginationWrapper<any>>(`${environment.apiUrl}${environment.apiVersion}/getUsersByUserRoleList`, wrapJsonForRequest(data));
    }

    assignTransferData(data: any): Observable<any> {
        return this.http.post<ResponseItemWrapper<any>>(`${environment.apiUrl}${environment.apiVersion}/assignPlanningToUser`, data);
    }


    /**
     * filters
     * 0 = SID filter
     * 1 = truckLicensePlateFront filter
     * 2 = truckLicensePlateBack filter
     * 3 = dockName filter
     * 4 = status name filter
     * 5 = schedulingDate filter
     * 6 = goodsName filter
     * 7 = goodsBuyer filter
     * 8 = goodsSupplier filter
     * 9 = country filter
     * 10 = harvestYear filter
     * 11 = statusUpdatedAt filter
     * 12 = timeSlot filter
     * 13 = phoneNumber filter
     *
     * "order": [{"dir": "DESC", "column": 0}]
     *
     * start = start index (e .g daca vrei sa incepi cu 11 sau whatever -by default e 0);
     * length = nr de items per page
     *
     * @param data
     * @returns
     */
    list(data: any): Observable<SchedulingPreviewModel[]> {
        let params = new URLSearchParams();
        const filters = [
            data.sId || '',
            data.truckLicensePlateFront || '',
            data.truckLicensePlateBack || '',
            data.dockName || '',
            data.status || '',
            data.schedulingDate || '',
            data.goodsName || '',
            data.goodsBuyer || '',
            data.goodsSupplier || '',
            data.country || '',
            data.harvestYear || '',
            data.statusUpdatedAt || '',
            data.timeSlot || '',
            data.phoneNumber || '',
        ];

        const order = { dir: data.dir || 'DESC', column: data.column || 5 }

        for (let key in filters) {
            params.set(`filters[${key}]`, filters[key]);
        }

        params.set(`order[0][dir]`, order.dir.toLowerCase());
        params.set(`order[0][column]`, order.column);

        if (data.start) params.set('start', data.start);
        if (data.length) params.set('length', data.length);
        return this.http.get<ResponseArrayWrapper<SchedulingPreviewModel[]>>(`${environment.apiUrl}${environment.apiVersion}${this.route}?` + params.toString())
            .pipe(pluckArrayWrapperData<any, ResponseArrayWrapper<SchedulingPreviewModel[]>>(),
                // map((l: SchedulingModel[]) => {

                //   l = l.map((p: SchedulingModel) => {

                //     p.statusListStatus = (<ResponseDataItem<StatusListModel>>p.statusListStatus)?.attributes ?? null;
                //     p.warehouse = (<ResponseDataItem<BuildingModel>>p.warehouse)?.attributes || null;
                //     p.location = (<ResponseDataItem<LocationModel>>p.location)?.attributes || null;
                //     p.dock = (<ResponseDataItem<DockModel>>p.dock)?.attributes || null;
                //     p.operation = (<ResponseDataItem<OperationModel>>p.operation)?.attributes || null;

                //     if (p.products.length) {
                //       p.products = (<ResponseDataItem<SchedulingProduct>[]>p.products).map((product: ResponseDataItem<SchedulingProduct>) => product.attributes);
                //     }

                //     return p;
                //   })

                //   return l;
                // })
            )
    }

    /**
     * Comvex filters
     * 0 = SID filter
     * 1 = truckLicensePlateFront filter
     * 2 = truckLicensePlateBack filter
     * 3 = dockName filter
     * 4 = status name filter
     * 5 = schedulingDate filter
     * 6 = goodsName filter
     * 7 = goodsBuyer filter
     * 8 = goodsSupplier filter
     * 9 = country filter
     * 10 = harvestYear filter
     * 11 = statusUpdatedAt filter
     * 12 = timeSlot filter
     * 13 = phoneNumber filter
     *
     * "order": [{"dir": "DESC", "column": 0}]
     *
     * start = start index (e .g daca vrei sa incepi cu 11 sau whatever -by default e 0);
     * length = nr de items per page
     *
     * @param data
     * @returns
     */
    listComvex(data: any): Observable<SchedulingPreviewModel[]> {
        let params = new URLSearchParams();
        const filters = [
            data.sId || '',
            data.truckLicensePlateFront || '',
            data.truckLicensePlateBack || '',
            data.dockName || '',
            data.status || '',
            data.schedulingDate || '',
            data.goodsName || '',
            data.goodsBuyer || '',
            data.goodsSupplier || '',
            data.country || '',
            data.harvestYear || '',
            data.statusUpdatedAt || '',
            data.timeSlot || '',
            data.phoneNumber || '',
        ];
        const order = { dir: data.dir || 'DESC', column: data.column || 5 }

        for (const key in filters) {
            params.set(`filters[${key}]`, filters[key]);
        }

        params.set(`order[0][dir]`, order.dir);
        params.set(`order[0][column]`, order.column);

        if (data.start) params.set('start', data.start);
        if (data.length) params.set('length', data.length);
        return this.http.get<ResponseArrayWrapper<SchedulingPreviewModel[]>>(`${environment.apiUrl}${environment.apiVersion}/admin/comvex/plannings?` + params.toString())
            .pipe(pluckArrayWrapperData<any, ResponseArrayWrapper<SchedulingPreviewModel[]>>(),
                // map((l: SchedulingModel[]) => {

                //   l = l.map((p: SchedulingModel) => {

                //     p.statusListStatus = (<ResponseDataItem<StatusListModel>>p.statusListStatus)?.attributes ?? null;
                //     p.warehouse = (<ResponseDataItem<BuildingModel>>p.warehouse)?.attributes || null;
                //     p.location = (<ResponseDataItem<LocationModel>>p.location)?.attributes || null;
                //     p.dock = (<ResponseDataItem<DockModel>>p.dock)?.attributes || null;
                //     p.operation = (<ResponseDataItem<OperationModel>>p.operation)?.attributes || null;

                //     if (p.products.length) {
                //       p.products = (<ResponseDataItem<SchedulingProduct>[]>p.products).map((product: ResponseDataItem<SchedulingProduct>) => product.attributes);
                //     }

                //     return p;
                //   })

                //   return l;
                // })
            )
    }



    updatePlanningToDock(data: UpdatePlanningDock): Observable<any> {
        return this.http.post(`${environment.apiUrl}${environment.apiVersion}/admin/assigning-dock-to-plannings`, wrapJsonForRequest(data));
    }

    downloadPlannings(lang: string): Observable<any> {
        return this.http.get(`/assets/${lang === 'en' ? 'basic_EN.xlsx' : 'basic_RO.xlsx'}`, { observe: 'response', responseType: 'blob' });
    }

    importPlannings(list: any[]): Observable<any> {
        console.log(list)
        return this.http.post(`${environment.apiUrl}${environment.apiVersion}/importPlanningByJson`, list);
    }

    listLogs(id: number): Observable<any> {
        return this.http.post<ResponseItemWrapper<any>>(`${environment.apiUrl}${environment.apiVersion}/getPlanningLogList`, { "planningId": id })
            .pipe(pluckItemWrapperData<any, ResponseItemWrapper<any>>(),
                map((p: any) => {
                    return p;
                })
            )
    }
    convoyLogs(id: number): Observable<any> {
        return this.http.post<ResponseItemWrapper<any>>(`${environment.apiUrl}${environment.apiVersion}/planningConvoyLog`, { "planningShipmentId": id })
            .pipe(pluckItemWrapperData<any, ResponseItemWrapper<any>>(),
                map((p: any) => {
                    return p;
                })
            )
    }

    // listLogs(id: number): Observable<SchedulingLogModel[]> {
    //     return this.http.get<ResponseArrayWrapper<SchedulingLogModel[]>>(`${environment.apiUrl}${environment.apiVersion}/admin/shipment-logs/${id}`)
    //         .pipe(pluckArrayWrapperData<any, ResponseArrayWrapper<SchedulingLogModel[]>>(),
    //             map((l: SchedulingLogModel[]) => {

    //                 l = l.map((p: SchedulingLogModel) => {

    //                     p.statusListStatus = (<ResponseDataItem<StatusListModel>>p.statusListStatus)?.attributes ?? null;
    //                     p.operation = (<ResponseDataItem<OperationModel>>p.operation)?.attributes ?? null;
    //                     p.warehouse = (<ResponseDataItem<BuildingModel>>p.warehouse)?.attributes || null;

    //                     if (p.products.length) {
    //                         p.products = (<ResponseDataItem<SchedulingProduct>[]>p.products).map((product: ResponseDataItem<SchedulingProduct>) => product.attributes);
    //                     }

    //                     if (p.shipmentLogs?.length) {
    //                         p.shipmentLogs = (<ResponseDataItem<ShipmentLogsModel>[]>p.shipmentLogs).map((s: ResponseDataItem<ShipmentLogsModel>) => s.attributes);
    //                     }

    //                     if (p.documents.length) {
    //                         p.documents = (<ResponseDataItem<DocumentObject>[]>p.documents).map((s: ResponseDataItem<DocumentObject>) => s.attributes);
    //                     }

    //                     return p;
    //                 })

    //                 return l;
    //             })
    //         )
    // }

    cancel(planningId: number): Observable<any> {
        return this.http.post(`${environment.apiUrl}${environment.apiVersion}${this.route}/cancel/${planningId}`, {});
    }

    reject(planningId: number): Observable<any> {
        return this.http.post(`${environment.apiUrl}${environment.apiVersion}${this.route}/reject/${planningId}`, {});
    }

    getPhoto(url: string): Observable<HttpResponse<Blob>> {
        if (!environment.production) {
            const httpURL = url.replace(new URL(url).origin, 'http://localhost:4200');
            return this.http.get(httpURL, { observe: 'response', responseType: 'blob' });
        } else {
            return this.http.get(url, { observe: 'response', responseType: 'blob' });
        }
    }

    checkin(planningId: number): Observable<any> {
        return this.http.post(`${environment.apiUrl}${environment.apiVersion}${this.route}/checkin/${planningId}`, {})
    }

    checkout(planningId: number): Observable<any> {
        return this.http.post(`${environment.apiUrl}${environment.apiVersion}${this.route}/checkout/${planningId}`, {})
    }
}
