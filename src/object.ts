import { compose, hasOwnProperty, numberRange, size, typeOf } from './common';

const equal = (obj1: any, obj2: any): boolean => {
    switch (true) {
        case obj1 === obj2:
            return true; /*?*/

        case typeOf(obj1) === typeOf(obj2) && ['object', 'array'].includes(typeOf(obj1)) && size(obj1) === size(obj2):
            return every(obj1, (value, key) => hasOwnProperty(obj2 /*?*/, key /*?*/) /*?*/ && equal(value, obj2[key]));

        default:
            return false;
    }
};
// a lot of object function combined  with array
const fromEntries = (entriesArray: Array<[any, any]>) =>
    entriesArray.reduce((tempObj, [certainKey, certainValue]) => ({ ...tempObj, [certainKey]: certainValue }), {});
const filter = (obj: any, func: (value: any, key?: any) => boolean) => {
    switch (typeOf(obj)) {
        case 'object':
            return compose(
                (object: any) => Object.entries(object),
                (entries: Array<[any, any]>) => entries.filter(([key, value]) => func(value, key)),
                fromEntries,
            )(obj);

        case 'array':
            return obj.filter(func);

        default:
            console.error('obj type need to be object or array');
            return;
    }
};

const map = (obj: any, func: (value: any, key?: any) => any) => {
    switch (typeOf(obj)) {
        case 'object':
            return compose(
                (object: any) => Object.entries(object) /*?*/,
                (entries: Array<[any, any]>) =>
                    entries /*?*/
                        .map(([key, value]) => [key, func(value, key)]),
                fromEntries,
            )(obj);
        case 'array':
            return obj.map(func);

        default:
            console.error('obj type need to be object or array');
            return;
    }
};

map({ 1: [1], 2: [2], 3: [3] }, (value, key) => value); /*?*/

const reduce = (obj: any, func: (tempResult: any, value: any, key?: any) => any, initialResult?: any) => {
    switch (typeOf(obj)) {
        case 'object':
            return compose(
                (object: any) => Object.entries(object),
                (entries: Array<[any, any]>) =>
                    entries.reduce((tempResult /*?*/, [key, value]) => func(tempResult, value, key), initialResult),
            )(obj);

        case 'array':
            return obj.reduce(func);

        default:
            console.error('obj type need to be object or array');
            return;
    }
};

const every = (obj: any, func: (value: any, key: any) => boolean) => {
    switch (typeOf(obj)) {
        case 'object':
            return compose(
                (object: any) => Object.entries(object),
                (entries: Array<[any, any]>) => entries.every(([key, value]: [any, any]) => func(value, key)),
            )(obj);

        case 'array':
            return obj.every(func);

        default:
            console.error('obj type need to be object or array');
            return false;
    }
};

const some = (obj: any, func: (value: any, key: any) => boolean) => {
    switch (typeOf(obj)) {
        case 'object':
            return compose(
                (object: any) => Object.entries(object),
                (entries: Array<[any, any]>) => entries.some(([key, value]: [any, any]) => func(value, key)),
            )(obj);

        case 'array':
            return obj.some(func);

        default:
            console.error('obj type need to be object or array');
            return false;
    }
};

type P = string | number;
const convertPath2List = (path?: P | P[]) => {
    switch (typeOf(path)) {
        case 'string':
        case 'number':
            return [path as P];

        case 'array':
            return path as P[];

        default:
            return [];
    }
};

const get = (path: P | P[], object: any) => {
    path = convertPath2List(path); /*?*/
    return path.reduce((certainList: any, certainPath: string | number) => {
        if (
            (typeOf(certainPath) === 'number' && certainPath >= 0 && certainPath < certainList.length) ||
            hasOwnProperty(certainList, certainPath)
        ) {
            return certainList[certainPath];
        } else {
            throw new Error("don't have the key");
        }
    }, object);
};
const set = (path: P | P[], value: any, object: any): any => {
    path = convertPath2List(path);
    switch (path.length) {
        case 0:
            return value;

        case 1: {
            const [lastPath] = path;
            return typeOf(object) === 'array'
                ? [...object.slice(0, lastPath), value, ...object.slice((lastPath as number) + 1)]
                : {
                      ...object,
                      [lastPath]: value,
                  };
        }

        default: {
            const [firstPath, ...otherPath] = path;
            return typeOf(object) === 'array'
                ? [
                      ...object.slice(0, firstPath),
                      set(otherPath, value, object[firstPath]),
                      ...object.slice((firstPath as number) + 1),
                  ]
                : {
                      ...object,
                      [firstPath]: set(otherPath, value, object[firstPath]),
                  };
        }
    }
};
const update = (path: P | P[], func: (value: any) => any, object: any) => set(path, func(get(path, object)), object);

const remove = (path: P | P[], object: any) => {
    path = convertPath2List(path);
    const lastPath = path[path.length - 1];
    const restPath = path.slice(0, path.length - 1);
    const lastObject = get(restPath, object);
    let value: any;
    let restObject: any;
    if (typeOf(lastObject) === 'object') {
        ({ [lastPath]: value, ...restObject } = lastObject);
    } else {
        restObject = [...lastObject.slice(0, lastPath), ...lastObject.slice((lastPath as number) + 1)];
    }
    return restPath.length === 0 ? restObject : set(restPath, restObject, object);
};

const insert = (path: P | P[], value: any, object: any) => {
    path = convertPath2List(path);
    const lastPath = path[path.length - 1];
    const restPath = path.slice(0, path.length - 1);
    let lastObject = get(restPath, object);
    // debugger;
    lastObject =
        typeOf(lastObject) === 'object'
            ? { ...lastObject, [lastPath]: value }
            : [...lastObject.slice(0, lastPath), value, ...lastObject.slice(lastPath)];
    return restPath.length === 0 ? lastObject : set(restPath, lastObject, object);
};

const invert = <T>(obj: T): T => {
    if (typeOf(obj) !== 'object') {
        console.error('type need to be object');
        return obj;
    } else {
        const values = Object.values(obj);
        const keys = Object.keys(obj);
        return compose(
            (values, keys) => numberRange(values.length).map((index: number) => [values[index], keys[index]]),
            fromEntries,
        )(values, keys);
    }
};

export { equal, fromEntries, filter, map, reduce, some, every, get, set, update, remove, insert, invert };
