import { compose, hasOwnProperty, numberRange, typeOf } from './common';
import { filter, map, remove, update } from './object';

const fill = (array: any[], length: number, defaultValue?: any) =>
    array.length < length
        ? [...array /*?.*/, ...Array.from(Array(length - array.length).keys()).map(() => defaultValue)]
        : array.slice(0, length);

const range = (start: number | string, end?: number | string): any[] => {
    // 增加 A-Z支持, 识别 大小写, a, z
    // a -> b -> c -> d -> e -> f - - -> z
    // ↑                                 ↓
    // Z <- Y <- X <- W <- V <- U - - <- A
    // don't have the end
    // if start is string, to the end like start = a, result is a, b, ... z;
    // if start is number, start as length;
    // have the end
    // if start is string, to the end;
    // if start is a, end is A, can be ["a", "b", ... "z", "A"];
    // if start is A, end is a, can be ["A", "B", ... "Z", "a"];
    // if start is number, to the end;
    // TODO 首先进行参数验证
    // 在没有end的时候数据类型只能是 1个字符 和 number
    // 如果同时有两个参数 , 两个必须同时是数字 或者同时为字符
    // TODO 逆序数字
    if (
        end === undefined &&
        !(
            (typeof start === 'number' && (/^[0-9]*[1-9][0-9]*$/.test(start.toString()) || start === 0)) ||
            (typeof start === 'string' && start.length === 1)
        )
    ) {
        console.error('只有一个参数时， 需要是正整数, 如果是字符串， 需要是字符');
        return [];
    }
    if (
        end !== undefined &&
        !(
            (typeof start === 'number' &&
                /^-?\d+$/.test(start.toString()) &&
                typeof end === 'number' &&
                /^-?\d+$/.test(end.toString())) ||
            (typeof start === 'string' && start.length === 1 && typeof end === 'string' && end.length === 1)
        )
    ) {
        console.error('有两个参数时， 只可以两个都为整数，或者两个都为字符');
        return [];
    }
    if (start === 0 && end === undefined) {
        return [];
    }
    const alphabetList = [...numberRange(65, 90), ...numberRange(97, 122), ...numberRange(65, 90)];
    if (end === undefined) {
        switch (true) {
            case typeof start === 'string' && range(97, 122).includes(start.charCodeAt(0)):
                end = 'z';
                break;
            case typeof start === 'string' && range(65, 90).includes(start.charCodeAt(0)):
                end = 'Z';
                break;
            case typeof start === 'number':
                end = (start as number) - 1;
                start = 0;
                break;
            default:
                break;
        }
    }
    switch (true) {
        case typeof start === 'number' && typeof end === 'number' && start <= end:
            return numberRange(start as number, end as number);
        case typeof start === 'number' && typeof end === 'number' && start > end:
            return numberRange(end as number, start as number).reverse();
        case typeof start === 'string' && typeof end === 'string':
            start = (start as string).charCodeAt(0);
            end = (end as string).charCodeAt(0);
            if (start <= end) {
                return [
                    ...alphabetList.slice(alphabetList.indexOf(start), alphabetList.indexOf(end)),
                    alphabetList[alphabetList.indexOf(end)],
                ].map((value: number) => String.fromCharCode(value));
            } else {
                return [
                    ...alphabetList.slice(alphabetList.indexOf(start), alphabetList.lastIndexOf(end)),
                    alphabetList[alphabetList.lastIndexOf(end)],
                ].map((value: number) => String.fromCharCode(value));
            }
        default:
            return [];
    }
};
const groupBy = <T>(array: T[], func: (element: T) => any) => {
    const convertArray = array.map(element => func(element)); /*?*/
    // const uniqueArray = unique(array);
    let result: any = {};
    let seenValue: any[] = [];
    convertArray.forEach((value: any, index: number) => {
        if (seenValue.includes(value)) {
            result = update([value], (certainKeyValue: any) => [...certainKeyValue, array[index]], result);
        } else {
            seenValue = [...seenValue, value];
            result = { ...result, [value]: [array[index]] };
        }
    });
    return result;
};

const sample = <T>(array: T[]): T => array[Math.floor(Math.random() * array.length)];

const shuffle = <T>(array: T[]): T[] => {
    const helper = (array: T[], result: T[]): T[] => {
        if (array.length === 1) {
            return [...result, ...array];
        } else {
            const index = Math.floor(Math.random() * array.length);
            return helper(remove(index, array), [...result, array[index]]);
        }
    };
    return helper(array, []);
};

shuffle(range(10)); /*?*/

const chuck = (array: any[], split: number | number[]) => {
    if (typeOf(array) !== 'array') {
        console.error(`array not accept ${typeOf(array)} type, please pass array type`);
    }
    switch (typeOf(split)) {
        case 'number':
            const chuckedArray = array.reduce(
                ([tempArray, holderArray], element, index) =>
                    (index + 1) % (split as number) === 0
                        ? [[...tempArray, [...holderArray, element]], []]
                        : [tempArray, [...holderArray, element]],
                [[], []],
            )[0];
            if (array.length % (split as number) === 0) {
                return chuckedArray;
            } else {
                return [
                    ...chuckedArray,
                    array
                        .reverse()
                        .slice(0, array.length % (split as number))
                        .reverse(),
                ];
            }

        case 'array':
            // 如果是array 必须要全部加起来等于array的长度 h
            if ((split as number[]).reduce((value1, value2) => value1 + value2) !== array.length) {
                console.log('array length need to be equals to split sum');
            } else {
                return array.reduce(
                    ([tempArray, holderArray, tempSplit, accumulator], element, index) =>
                        index + 1 === accumulator
                            ? [
                                  [...tempArray, [...holderArray, element]],
                                  [],
                                  tempSplit.slice(1),
                                  accumulator + tempSplit[0],
                              ]
                            : [tempArray, [...holderArray, element], tempSplit, accumulator],
                    [[], [], (split as number[]).slice(1), (split as number[])[0]],
                )[0];
            }

        default:
            console.error(`split not accept ${typeOf(split)} type, please pass number or array type`);
            break;
    }
};

const mixture = (list1: any[], list2: any[]) =>
    list1.length > list2.length
        ? range(list2.length)
              .reduce((tempList: any[]) => [...tempList, list1.shift(), list2.shift()], [])
              .concat(list1)
        : range(list1.length)
              .reduce((tempList: any[]) => [...tempList, list1.shift(), list2.shift()], [])
              .concat(list2);

const clear = (obj: any, exceptValueArray: any[] = []): any => {
    // clear all the false value, false, null, 0, "", undefined, NAN...
    if (['array', 'object'].includes(typeOf(obj))) {
        return filter(obj, value => clear(value, exceptValueArray));
    } else {
        return (
            (exceptValueArray.length === 0 && obj) ||
            (exceptValueArray.length > 0 && !exceptValueArray.some(certainExceptValue => obj === certainExceptValue))
        );
    }
};

clear([undefined, 1, 2, 3], [3]); /*?*/

const drop = <T>(array: T[], dropIndexArray: number[]): T[] =>
    dropIndexArray.reduce((tempResult: T[], index: number) => remove(index, tempResult), array);

const pick = <T>(array: T[], pickIndexArray: number[]): T[] =>
    pickIndexArray.reduce((tempResult: T[], index: number) => [...tempResult, array[index]], []);

const difference = <T>(array1: T[], array2: T[]) => {
    // already done
    return 1;
};

const flatten = (array: any) => {
    // 将每一个元素平放
    if (typeOf(array) === 'array') {
        return array.reduce(
            (tempResult: any[], certainElement: any) => [...tempResult, ...flatten(certainElement)],
            [],
        );
    } else {
        return [array];
    }
};

// 相交数据
const intersection = (array1: any[], array2: any[]) => {
    const [chuck1, chuck] = [array1, [...array1, ...array2]].map(certainArray =>
        groupBy(certainArray, element => element),
    );
    return compose(
        (chuck1, chuck) =>
            map(chuck1, (value: any[], key: string) =>
                value.slice(0, Math.min(chuck[key].length - value.length, value.length)),
            ),
        Object.values,
        flatten,
    )(chuck1, chuck);
};

intersection([1, 2, 2, 3], [3, 2, 2, 2, 4]); /*?*/

const Xor = (array1: any[], array2: any[]) => {
    // 将不相交的数据取出
    const [chuck1, chuck] = [array1, [...array1, ...array2]].map(certainArray =>
        groupBy(certainArray, element => element),
    );
    return compose(
        (chuck1, chuck) =>
            map(chuck, (value: any[], key: string) =>
                value.slice(
                    0,
                    Math.abs(value /*?*/.length - 2 * (hasOwnProperty(chuck1, key) /*?*/ ? chuck1[key].length : 0)),
                ),
            ),
        Object.values,
        flatten,
    )(chuck1, chuck);
};

Xor([1, 2, 2, 2, 3], [3, 2, 2, 4, 0]); /*?*/

// 查找， 排序方法
const sortedIndex = <T>(array: T[], func: (value1: T, value2: T) => -1 | 0 | 1) => {
    //
};

const unique = (array: any[]) => {
    return new Array(new Set(array));
};

export { fill, range, groupBy, sample, shuffle, chuck, clear, drop, pick, flatten, intersection, Xor, unique, mixture };
