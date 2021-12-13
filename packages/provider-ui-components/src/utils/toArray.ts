export const toArray = <T>(data: T | Array<T>): Array<T> =>
    Array.isArray(data) ? data : [data];
