const typeOf = (anyType: any) =>
    Object.prototype.toString
        .call(anyType)
        .split(' ')[1]
        .replace(']', '')
        .toLowerCase();

const compose = (...functionList: any[]) => (value?: any) =>
    functionList.reduce((tempValue, certainFunction) => certainFunction(tempValue), value);

const range = (start: number | string, end?: number | string): any[] => {
    // 增加 A-Z支持, 识别 大小写, a, z
    // don't have the end
    // if start is string, to the end like start = a, result is a, b, ... z;
    // if start is number, start as length;
    // have the end
    // if start is string, to the end;
    // if start is a, end is A, can be ["a", "b", ... "z", "A"];
    // if start is A, end is a, can be ["A", "B", ... "Z", "a"];
    // if start is number, to the end;
    if (!end) {
        switch (true) {
            case typeof start === 'string' &&
                ((start.length > 1 && isNaN(Number(start))) ||
                    (start.length === 1 &&
                        ![...range(48, 57), ...range(65, 90), ...range(97, 122)].includes(start.charCodeAt(0)))):
                throw new Error('start is not a number or a isValid string!');

            case typeof start === 'string' && start.length === 1 && range(97, 122).includes(start.charCodeAt(0)):
                end = 'z';
                break;

            case typeof start === 'string' && start.length === 1 && range(65, 90).includes(start.charCodeAt(0)):
                end = 'Z';
                break;

            case typeof start === 'string' && !isNaN(Number(start)):
                end = Number(start) - 1;
                start = 0;
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
        case typeof start === 'number':
            return [...Array((end as number) - (start as number) + 1).keys()].map(
                (value: number) => value + (start as number),
            );

        case typeof start === 'string' &&
            ((range(65, 90).includes(start.charCodeAt(0)) && range(65, 90).includes((end as string).charCodeAt(0))) ||
                (range(97, 122).includes(start.charCodeAt(0)) &&
                    range(97, 122).includes((end as string).charCodeAt(0)))):
            start = (start as string).charCodeAt(0);
            end = (end as string).charCodeAt(0);
            return range(start, end).map((value: number) => String.fromCharCode(value));

        case typeof start === 'string' &&
            range(65, 90).includes(start.charCodeAt(0)) &&
            range(97, 122).includes((end as string).charCodeAt(0)): {
            const start1 = (start as string).charCodeAt(0);
            const end1 = 90;
            const start2 = 97;
            const end2 = (end as string).charCodeAt(0);
            return [
                ...range(start1, end1).map((value: number) => String.fromCharCode(value)),
                ...range(start2, end2).map((value: number) => String.fromCharCode(value)),
            ];
        }

        case typeof start === 'string' &&
            range(97, 122).includes(start.charCodeAt(0)) &&
            range(65, 90).includes((end as string).charCodeAt(0)): {
            const start1 = (start as string).charCodeAt(0);
            const end1 = 122;
            const start2 = 65;
            const end2 = (end as string).charCodeAt(0);
            return [
                ...range(start1, end1).map((value: number) => String.fromCharCode(value)),
                ...range(start2, end2).map((value: number) => String.fromCharCode(value)),
            ];
        }

        default:
            return [];
    }
};

export { typeOf, compose, range };
