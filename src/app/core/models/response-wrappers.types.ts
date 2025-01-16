export interface ResponseDataItem<T> {
  type: string;
  attributes: T;
}

export interface ResponseItemWrapper<T> {
  data: ResponseDataItem<T>;
  message?: string;
}

export interface ResponseArrayWrapper<T> {
  data: {
    type: string;
    items: Array<ResponseDataItem<T>>;
  };
}

//////////Asim///////
export interface ResponseItemPaginationWrapper<T> {
  data: ResponseDataPaginationItem<T>;
  message?: string;
}


export interface ResponseDataPaginationItem<T> {
  type: string;
  attributes: T;
}

export interface ResponseArrayPaginationWrapper<T> {
  data: {
    type: string;
    attributes: T;
     //items?: Array<ResponseDataPaginationItem<T>>;
  };
}
////////////



export interface ResponseUsersWrapper<T> {
  data: {
    type: string;
    items: Array<T>;
  }
}

export interface NativeResponseWrapper<T> {
  status: string;
  code: number;
  error: {
    detail?: string;
    form?: T;
  }
  message: string;
  data: T;
}


