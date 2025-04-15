import { map, OperatorFunction } from "rxjs";
import { RequestListWrapper, RequestWrapper } from "src/app/core/models/request-wrapper.model";
import {
    ResponseArrayPaginationWrapper,
    ResponseArrayWrapper, ResponseItemPaginationWrapper,
    ResponseItemWrapper,
    ResponseUsersWrapper
} from "src/app/core/models/response-wrappers.types";

/**
 * @description Converts a JSON object to a FormData instance.
 * @description If the prefix is blank, it will output the object keys as is if the prefix is not blank, the keys will be appended within []
 *
 * @param obj - the object to convert from
 * @param prefix - the name prefix
 *
 * @returns FormData
 *
 * @example prefix = 'container' => name = container[key]
 * @example prefix = '' => name = key
 */
 export function convertJsonToFormData(obj: unknown, prefix: string): FormData {

  const recursiveConversion = (formData: FormData, target: unknown, pref: string) => {
    for (const [key, val] of Object.entries(target as Record<string, unknown>)) {
      const name = pref ? `${pref}[${key}]` : `${key}`;
      if (val instanceof Date) {
        formData.append(name, val.getTime().toString());
      } else if (typeof val === 'object') {
        (val === null || val instanceof Blob) ?
          formData.append(name, val as Blob) :
          recursiveConversion(formData, val as Record<string, unknown>, name);
      } else if (typeof val !== 'symbol' && typeof val !== 'function') {
        formData.append(name, val as string);
      }
    }
  };

  const fd = new FormData();
  recursiveConversion(fd, obj, prefix);
  return fd;
}

/**
 * Wraps the json object into a wrapper for the api request
 * @param json
 */
// export function wrapJsonForRequest<T>(json: T): RequestWrapper<T> {
export function wrapJsonForRequest<T>(json: T): T {
    return json;

    // return {
    //     data: {
    //         attributes: json
    //     }
    // };
}

export function wrapJsonListForRequest<T extends string, A>(type: T, jsonList: ReadonlyArray<A>): RequestListWrapper<T, A> {
    return {
        data: {
        items: jsonList.map(item => ({
            type,
            attributes: item
        }))
        }
    };
}

export function pluckItemWrapperData<X, T extends ResponseItemWrapper<X>>(): OperatorFunction<T, X> {
    return source => source.pipe(
      map(x => x.data),
      map(x => x.attributes)
    );
  }

export function pluckArrayWrapperData<X, T extends ResponseArrayWrapper<X>>(): OperatorFunction<T, X[]> {

    return source => source.pipe(
    map(x => x.data),
    map(x => x.items),
    map(items => items.map(x => x.attributes))
  );
}

export function pluckSubCategoriesData<X>(): OperatorFunction<any, X> {
  return (source) =>
      source.pipe(
          map((response: any) => {
              // Flatten the response into a single array of subcategories
              const subcategories = response.flatMap((category: any) =>
                  Object.values(category).flat()
              );

              // Return the processed array
              return subcategories as X;
          })
      );
}


///////// Asim ///////////////

export function pluckArrayPaginationWrapperData<X, T extends ResponseArrayPaginationWrapper<X>>(): OperatorFunction<T, X> {

    return source => source.pipe(
        map(x => x.data),
        map(x => x.attributes)
    );
}

///////////////////////


// export function pluckArrayWrapperData<X, T extends ResponseArrayWrapper<X>>(): OperatorFunction<T, X[]> {
//
//     return source => source.pipe(
//         map(x => x.data),
//         map(x => x.items),
//         map(items => items.map(x => x.attributes))
//     );
// }

export function pluckUsersWrapperData<X, T extends ResponseUsersWrapper<X>>(): OperatorFunction<T, X[]> {
  return source => source.pipe(
    map(x => x.data),
    map(x => x.items),
  )
}
