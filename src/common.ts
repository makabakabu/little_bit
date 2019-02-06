const typeOf = (anyType: any) =>
    Object.prototype.toString
        .call(anyType)
        .split(' ')[1]
        .replace(']', '')
        .toLowerCase();

const hasOwnProperty = (obj1: any, obj2: any) => {
    switch (typeOf(obj1)) {
        case 'object':
            return Object.prototype.hasOwnProperty.call(obj1, obj2);

        case 'array':
            return typeOf(obj2) === 'number' && obj2 >= 0 && obj1.length > obj2;

        default:
            return false;
    }
};

const compose = (...functionList: Array<(...props: any[]) => any>) => (...argsArray: any[]) => {
    const [firstFunction, ...restFunction] = functionList;
    const args = firstFunction(...argsArray);
    return restFunction.reduce((tempValue, certainFunction) => certainFunction(tempValue), args);
};

const size = (obj: any): number => {
    switch (typeOf(obj)) {
        case 'array':
            return obj.length;

        case 'object':
            return Object.keys(obj).length;

        default:
            return 0;
    }
};

const numberRange = (start: number, end?: number) => {
    if (end === undefined && !(typeof start === 'number' && /^[0-9]*[1-9][0-9]*$/.test(start.toString()))) {
        console.error('只有一个参数时， 需要是正整数');
        return [];
    }
    if (
        end !== undefined &&
        !(
            typeof start === 'number' &&
            /^-?\d+$/.test(start.toString()) &&
            typeof end === 'number' &&
            /^-?\d+$/.test(end.toString())
        )
    ) {
        console.error('有两个参数时， 只可以两个都为整数');
        return [];
    }
    start = end === undefined ? 0 : start;
    end = end === undefined ? start - 1 : end;
    return [...Array((end as number) - (start as number) + 1).keys()].map((value: number) => value + (start as number));
};

export { typeOf, hasOwnProperty, compose, size, numberRange };
