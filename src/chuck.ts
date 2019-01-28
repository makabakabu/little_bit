import typeOf from './index';

const chuck = (array: any[], split: number | number[]) => {
  if (typeOf(array) !== 'array') {
    console.error(`array not accept ${typeOf(array)} type, please pass array type`);
  }
  switch (typeOf(split)) {
    case 'number':
      return array.reduce(
        ([tempArray, holderArray], element, index) =>
          (index + 1) % (split as number) === 0
            ? [[...tempArray, [...holderArray, element]], []]
            : [tempArray, [...holderArray, element]],
        [[], []],
      )[0];

    case 'array':
      // 如果是array 必须要全部加起来等于array的长度
      if ((split as number[]).reduce((value1, value2) => value1 + value2) !== array.length) {
        console.log('array length need to be equals to split sum');
      } else {
        return array.reduce(
          ([tempArray, holderArray, tempSplit, accumulator], element, index) =>
            index + 1 === accumulator
              ? [[...tempArray, [...holderArray, element]], [], tempSplit.slice(1), accumulator + tempSplit[0]]
              : [tempArray, [...holderArray, element], tempSplit, accumulator],
          [[], [], (split as number[]).slice(1), (split as number[])[0]],
        )[0];
      }

    default:
      console.error(`split not accept ${typeOf(split)} type, please pass number or array type`);
      break;
  }
};

export default chuck;
