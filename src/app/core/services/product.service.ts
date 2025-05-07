import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { pluckArrayPaginationWrapperData, pluckArrayWrapperData, pluckItemWrapperData, pluckSubCategoriesData, wrapJsonForRequest } from 'src/app/shared/utils/api.functions';
import { environment } from 'src/environments/environment';
import { ProductModel, WarehouseAvailablityResponse } from '../models/product.model';
import { ResponseArrayPaginationWrapper, ResponseArrayWrapper, ResponseDataItem, ResponseItemWrapper } from '../models/response-wrappers.types';
import { BuildingModel } from '../models/building.model';
import { CustomFieldData } from '../models/custom-field.model';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private route: string = '/admin/products'
  private warehouseGetRoute: string = '/admin/product-warehouse-availabilities-by-product';
  private warehousePostRoute: string = '/admin/product-warehouse-availabilities';
  constructor(private http: HttpClient) { }

  create(data: ProductModel): Observable<any> {
    return this.http.post<ResponseItemWrapper<any>>(`${environment.apiUrl}${environment.apiVersion}/createProduct`, wrapJsonForRequest(data));
  }

  // edit(id: number, data: ProductModel): Observable<any> {
  //   return this.http.post<ResponseItemWrapper<any>>(`${environment.apiUrl}${environment.apiVersion}${this.route}/${id}`, wrapJsonForRequest(data));
  // }

  edit(id: number, data: any): Observable<any> {
    data['productId'] = id;
    return this.http.post<ResponseItemWrapper<any>>(`${environment.apiUrl}${environment.apiVersion}/setProductInfo`, wrapJsonForRequest(data));
  }

  get(id: number): Observable<any> {
    let data = {
      "productId": id
    }
    return this.http.post<ResponseItemWrapper<any>>(`${environment.apiUrl}${environment.apiVersion}/getProduct`, wrapJsonForRequest(data))
      .pipe(pluckItemWrapperData<any, ResponseItemWrapper<any>>())
  }

  // get(id: number): Observable<ProductModel> {
  //   return this.http.get<ResponseItemWrapper<any>>(`${environment.apiUrl}${environment.apiVersion}${this.route}/${id}`)
  //                   .pipe(pluckItemWrapperData<ProductModel, ResponseItemWrapper<ProductModel>>(),
  //                       map((p: ProductModel) => {
  //                         p.locations = (<ResponseDataItem<LocationModel>[]>p.locations).map((l) => (l.attributes))
  //                                                                                       .map(l => {
  //                           l.warehouses = (<ResponseDataItem<BuildingModel>[]>l.warehouses).map(w => <number>w.attributes.id);
  //                           return l;
  //                         });

  //                         return p;
  //                       })
  //                   )
  // }

  pagination(data: any): Observable<any> {
    return this.http.post<ResponseArrayPaginationWrapper<any>>(`${environment.apiUrl}${environment.apiVersion}/paginateProducts`, wrapJsonForRequest(data))
      .pipe(pluckArrayPaginationWrapperData<any, ResponseArrayPaginationWrapper<any>>(),
        map((u: any) => {
          u.items = (<any>u.items).map(((c: CustomFieldData) => c.attributes));
          return u;
        })
      );
  }

  getProductList(data: any ): Observable<any> {
    return this.http.post<ResponseItemWrapper<any>>(`${environment.apiUrl}${environment.apiVersion}/getProductList`, data )
        .pipe(pluckItemWrapperData<any, ResponseItemWrapper<any>>(),
            map((p: any) => {
                return p;
            })
        )
}

  // getCategory(data: any): Observable<any> {
  //   return this.http.post<any>(`${environment.apiUrl}${environment.apiVersion}/getCategoryList`, wrapJsonForRequest(data))
  //     .pipe(pluckArrayPaginationWrapperData<any, ResponseArrayPaginationWrapper<any>>(),
  //       map((u: any) => {

  //         return u;
  //       })
  //     );
  // }

  // getCategory(type: string): Observable<any> {
  //   let data = {
  //     "type": type
  //   }
  //   return this.http.post<ResponseItemWrapper<any>>(`${environment.apiUrl}${environment.apiVersion}/getCategoryList`, wrapJsonForRequest(data))
  //     .pipe(pluckItemWrapperData<any, ResponseItemWrapper<any>>())
  // }
  getCategoryList(data: any ): Observable<any> {
    return this.http.post<ResponseItemWrapper<any>>(`${environment.apiUrl}${environment.apiVersion}/getCategoryList`, data )
        .pipe(pluckItemWrapperData<any, ResponseItemWrapper<any>>(),
            map((p: any) => {
                return p;
            })
        )
}
  getSubCategory(id: number): Observable<any> {
    let data = {
      "categoryId": id
    }
    return this.http.post<ResponseItemWrapper<any>>(`${environment.apiUrl}${environment.apiVersion}/getSubCategoryList`, wrapJsonForRequest(data))
      .pipe(pluckItemWrapperData<any, ResponseItemWrapper<any>>())
  }

  getSubCategoryList(data: any): Observable<any> {
    return this.http.post<ResponseItemWrapper<any>>(`${environment.apiUrl}${environment.apiVersion}/getSubCategoryArrayList`, data )
        .pipe(pluckSubCategoriesData<any>(),
            map((p: any) => {
                return p;
            })
        )
  }

  delete(id: number): Observable<any> {
    let data = { "productId": id };
    return this.http.post(`${environment.apiUrl}${environment.apiVersion}/deleteProduct`, wrapJsonForRequest(data))
  }

  list(data: any): Observable<ProductModel[]> {
    return this.http.get<ResponseArrayWrapper<any>>(`${environment.apiUrl}${environment.apiVersion}${this.route}`)
      .pipe(pluckArrayWrapperData<any, ResponseArrayWrapper<any>>())
  }

  // listWarehouses(id: number): Observable<WarehouseAvailablityResponse[]> {
  //   return this.http.get<ResponseArrayWrapper<any>>(`${environment.apiUrl}${environment.apiVersion}${this.warehouseGetRoute}/${id}`)
  //                   .pipe(pluckArrayWrapperData<any, ResponseArrayWrapper<WarehouseAvailablityResponse[]>>(),
  //                     map(l => {
  //                       l = l.map((b: WarehouseAvailablityResponse) => {
  //                         b.warehouses = (<ResponseDataItem<BuildingModel>[]>b.warehouses).map(w => <number>w.attributes.id);

  //                         return b;
  //                       })

  //                       return l;
  //                     })
  //                   )
  // }

  // addWarehouses(id: number, data: any): Observable<any> {
  //   return this.http.post(`${environment.apiUrl}${environment.apiVersion}${this.warehousePostRoute}/${id}`, wrapJsonForRequest({availabilities: data}));
  // }
}
