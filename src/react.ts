import { compose, reduce, typeOf } from '.';

const parseComponent = (component: any, func: (content: any) => any, React: any) => {
    const convertJSX2Object = (JSX: any): any =>
        typeOf(JSX) === 'object'
            ? {
                  ...React.Children.toArray(JSX.props.children).map((certainJSX: any) => convertJSX2Object(certainJSX)),
                  valueOf: () => React.cloneElement(JSX, { children: [] }),
              }
            : JSX;

    // 每一个list对应一个
    const convertObject2JSX = (object: any): any => {
        if (typeOf(object) === 'object') {
            const { valueOf, ...childrenList } = object;
            return React.cloneElement(valueOf(), {
                children: reduce(childrenList, (tempResult, value) => [...tempResult, convertObject2JSX(value)], []),
            });
        } else {
            return object;
        }
    };
    return compose(
        convertJSX2Object,
        func,
        convertObject2JSX,
    )(component);
};

export default parseComponent;
